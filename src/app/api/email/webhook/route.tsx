import { EMAIL_INDEX_NAME, Email } from '@/db/models/email';
import { log } from '@/lib/log';
import { EmailStatus } from '@/lib/shared-email-types';
import { Tigris } from '@tigrisdata/core';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const tigris = new Tigris();
const search = tigris.getSearch();

type ResendWebookType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.complained'
  | 'email.bounced'
  | 'email.opened'
  | 'email.clicked';

interface ResendWebhook {
  type: ResendWebookType;
  created_at: Date;
  data: {
    created_at: Date;
    email_id: string;
    from: string;
    to: string[];
    subject: string;
  };
}

const WebHookToEmailStatusLookup: Record<ResendWebookType, EmailStatus> = {
  'email.sent': EmailStatus.Sent,
  'email.bounced': EmailStatus.Bounced,
  'email.clicked': EmailStatus.Clicked,
  'email.complained': EmailStatus.Complained,
  'email.delivered': EmailStatus.Delivered,
  'email.delivery_delayed': EmailStatus.DeliveryDelayed,
  'email.opened': EmailStatus.Opened,
};

export async function GET(_request: Request) {
  return NextResponse.json({ endpoint: '/api/email/webhook' });
}

export async function POST(request: Request) {
  let statusCode = 500;
  try {
    // TODO request signing

    const body = (await request.json()) as ResendWebhook;
    log('WebHook', JSON.stringify(body, null, 2));
    const newStatus: EmailStatus = WebHookToEmailStatusLookup[body.type];
    log(`Updating status to`, newStatus);

    log('getting index and document');
    const emailsIndex = await search.getIndex<Email>(EMAIL_INDEX_NAME);
    const toUpdate = await emailsIndex.getOne(body.data.email_id);
    log('found document', JSON.stringify(toUpdate, null, 2));

    if (toUpdate === undefined) {
      statusCode = 404;
      throw new Error(
        `Could not find document in index for Email with id ${body.data.email_id}`
      );
    }

    toUpdate.document.status = newStatus;
    const updateStatus = await emailsIndex.updateOne(toUpdate.document);
    log('Update result', JSON.stringify(updateStatus, null, 2));

    if (updateStatus.error) {
      const msg = 'Error updating indexed document:' + updateStatus.error;
      console.error(msg);
      throw new Error(msg);
    }
    statusCode = 200;
  } catch (ex) {
    console.error(ex);
  }
  return NextResponse.json({}, { status: statusCode });
}
