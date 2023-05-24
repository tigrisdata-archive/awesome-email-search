import { EmailResponse, Resend, SendEmailData } from 'resend';
import { Filter, SearchQuery, SortOrder, Tigris } from '@tigrisdata/core';
import { EMAIL_INDEX_NAME, Email, EmailStatus } from '@/db/models/email';
import { EmailTemplates } from '@/lib/email-templates';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { log } from '@/lib/log';
import { NextResponse } from 'next/server';
import {
  EMAIL_CACHE_TAG,
  SearchResponse,
  TestEmailStatus,
} from '@/lib/shared-email-types';
import { revalidateTag } from 'next/cache';

const resend = new Resend(process.env.RESEND_API_KEY);
const tigris = new Tigris();
const search = tigris.getSearch();

const toSortOrder = (order: string | null): SortOrder<Email> => {
  let sortOrder: SortOrder<Email> = { field: 'createdAt', order: '$desc' };
  if (order === 'asc') {
    sortOrder.order = '$asc';
  }
  return sortOrder;
};

export async function GET(request: Request) {
  const response: SearchResponse = {
    results: [],
    meta: undefined,
    error: undefined,
  };
  const { searchParams } = new URL(request.url);
  log('searchParams', searchParams);
  try {
    const query = searchParams.get('search') || undefined;
    const statuses = searchParams.get('statuses') || undefined;
    const sortOrder = toSortOrder(searchParams.get('sortdir'));

    // Number(null) = 0
    const page = Number(searchParams.get('page'));
    if (page <= 0) {
      throw new Error(
        '"page" is a required search parameter and must be a number greater than 0'
      );
    }

    const emails = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const searchQuery: SearchQuery<Email> = {
      q: query,
      hitsPerPage: 20,
      sort: sortOrder,
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
    const queryResult = await emails.search(searchQuery, page);
    log('queryResult', queryResult);
    response.results = queryResult.hits.map((hit) => hit.document);
    response.meta = queryResult.meta;
  } catch (ex) {
    console.error(ex);
    response.error = ex as string;
  }

  return NextResponse.json(response);
}

const getToEmail = (testEmailStatus: TestEmailStatus | string) => {
  log('getToEmail', testEmailStatus);

  switch (testEmailStatus) {
    case TestEmailStatus.Bounced:
      return 'bounced@resend.dev';
      break;
    case TestEmailStatus.Delivered:
      return 'delivered@resend.dev';
    case TestEmailStatus.Complained:
      return 'complained@resend.dev';
      break;
    default:
      throw new Error('Could not determine test email status');
  }
};

export async function POST(request: Request) {
  let emailIndex;
  let errorStatus = 400;
  try {
    const formData = await request.formData();
    const stage = formData.get('stage');
    if (!stage) {
      errorStatus = 400;
      throw new Error('"stage" is a required search parameter');
    }

    const emailTemplate = EmailTemplates[stage as string];

    if (!emailTemplate) {
      errorStatus = 400;
      throw new Error(`Could not find email template for stage "${stage}"`);
    }

    const body = emailTemplate.template({
      name: formData.get('name')?.valueOf() as string,
      link: formData.get('link')?.valueOf() as string,
    })!;

    log('created email');
    const testEmailStatus = formData.get('testEmailStatus')
      ? TestEmailStatus[
          formData.get('testEmailStatus') as unknown as TestEmailStatus
        ]
      : '';
    log(
      'testEmailStatus',
      testEmailStatus,
      `[${formData.get('testEmailStatus')}]`
    );
    const sendEmailRequest: SendEmailData = {
      from: process.env.DEFAULT_EMAIL as string,
      to: [getToEmail(testEmailStatus)],
      subject: emailTemplate.emailSubject,
      react: body,
    };
    const sendResponse = await resend.sendEmail(sendEmailRequest);
    log('sent email');

    const bodyString = reactElementToJSXString(body);
    log('created body string', bodyString);

    emailIndex = {
      to: sendEmailRequest.to as string[],
      firstTo: sendEmailRequest.to[0] as string, // store the first email so we can sort by email address
      from: sendEmailRequest.from,
      status: EmailStatus.Sent,
      subject: emailTemplate.emailSubject,
      body: bodyString,
      createdAt: new Date(),
      id: (sendResponse as EmailResponse).id,
    };
    log('creating index', emailIndex);
    const emails = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const createResult = await emails.createOne(emailIndex);
    if (createResult.error) {
      console.error('Error occurred saving search index', createResult.error);
    } else {
      log('Index created', createResult);
      revalidateTag(EMAIL_CACHE_TAG);
    }
  } catch (ex: any) {
    console.error(ex);
    return NextResponse.json({ error: ex.toString() }, { status: errorStatus });
  }
  return NextResponse.json(emailIndex, { status: 201 });
}
