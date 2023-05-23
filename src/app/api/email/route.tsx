import { EmailResponse, Resend, SendEmailData } from 'resend';
import { redirect } from 'next/navigation';
import { Filter, SearchQuery, Tigris } from '@tigrisdata/core';
import { EMAIL_INDEX_NAME, Email, EmailStatus } from '@/db/models/email';
import { EmailTemplates } from '@/lib/email-templates';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { log } from '@/lib/log';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
const tigris = new Tigris();
const search = tigris.getSearch();

type SearchResponse = {
  results: Email[];
  error: undefined | string;
};

export async function GET(request: Request) {
  const response: SearchResponse = {
    results: [],
    error: undefined,
  };
  const { searchParams } = new URL(request.url);
  log('searchParams', searchParams);
  try {
    const query = searchParams.get('search') || undefined;
    const statuses = searchParams.get('statuses') || undefined;
    const emails = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const searchQuery: SearchQuery<Email> = {
      q: query,
      hitsPerPage: 50,
    };
    if (statuses) {
      const orFilter: Filter<Email>[] = statuses.split(',').map((status) => {
        const enumAsStr = status as unknown as EmailStatus;
        const asEnum = EmailStatus[enumAsStr];
        log('map', status, enumAsStr, asEnum);
        return {
          status: asEnum,
        } as Filter<Email>;
      });
      if (orFilter.length > 1) {
        searchQuery.filter = {
          $or: orFilter,
        };
      } else {
        searchQuery.filter = orFilter[0];
      }
    }
    log('searchQuery', JSON.stringify(searchQuery, null, 2));
    const queryResult = await emails.search(searchQuery, 1);
    log('queryResult', queryResult);
    response.results = queryResult.hits.map((hit) => hit.document);
  } catch (ex) {
    console.error(ex);
    response.error = ex as string;
  }

  return NextResponse.json(response);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    log('Form data', JSON.stringify(formData, null, 2));
    if (!formData.get('stage')) {
      throw new Error('No onboarding stage was provided');
    }

    const emailTemplate = EmailTemplates[formData.get('stage') as string];

    if (!emailTemplate) {
      throw new Error(
        `Could not find email template for stage "${formData.get('stage')}"`
      );
    }

    const body = emailTemplate.template({
      name: formData.get('name')?.valueOf() as string,
      link: formData.get('link')?.valueOf() as string,
    })!;

    console.log('created email', JSON.stringify(body, null, 2));
    const sendEmailRequest: SendEmailData = {
      from: 'phil@leggetter.co.uk',
      to: ['phil@leggetter.co.uk'],
      subject: emailTemplate.emailSubject,
      react: body,
    };
    const sendResponse = await resend.sendEmail(sendEmailRequest);
    log('sent email');

    const bodyString = reactElementToJSXString(body);
    log('created body string', bodyString);

    const index = {
      to: sendEmailRequest.to as string[],
      firstTo: sendEmailRequest.to[0] as string, // store the first email so we can sort by email address
      from: sendEmailRequest.from,
      status: EmailStatus.Sent,
      subject: emailTemplate.emailSubject,
      body: bodyString,
      createdAt: new Date(),
      id: (sendResponse as EmailResponse).id,
    };
    log('creating index', index);
    const emails = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const createResult = await emails.createOne(index);
    if (createResult.error) {
      console.error('Error occurred saving search index', createResult.error);
    }
  } catch (ex) {
    console.error(ex);
    const redirectTo = new URL(
      `/send?success=false&description=${ex}`,
      request.url
    );
    redirect(redirectTo.href);
  }

  const redirectTo = new URL(`/send?success=true`, request.url);
  redirect(redirectTo.href);
}
