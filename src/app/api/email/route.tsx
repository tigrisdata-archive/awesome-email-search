import { EmailResponse, Resend, SendEmailData } from 'resend';
import { redirect } from 'next/navigation';
import { Tigris } from '@tigrisdata/core';
import { EMAIL_INDEX_NAME, Email, EmailStatus } from '@/db/models/email';
import { EmailTemplates } from '@/lib/email-templates';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { log } from '@/lib/log';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const result = {
    success: true,
    description: '',
  };

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

    const tigris = new Tigris();
    const search = tigris.getSearch();
    const emails = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const bodyString = reactElementToJSXString(body);
    log('created body string', bodyString);

    const index = {
      to: sendEmailRequest.to as string[],
      firstTo: sendEmailRequest.to[0] as string, // store the first email so we can sort by email address
      from: sendEmailRequest.from,
      status: EmailStatus.Sent,
      body: bodyString,
      createdAt: new Date(),
      id: (sendResponse as EmailResponse).id,
    };
    log('creating index', index);
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
