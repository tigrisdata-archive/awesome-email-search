export enum EmailStatus {
  Sent,
  Delivered,
  DeliveryDelayed,
  Complained,
  Bounced,
  Clicked,
  Opened,
}

export enum TestEmailStatus {
  Delivered,
  Complained,
  Bounced,
}

export interface EmailResult {
  id?: string;

  firstTo: string;

  to: string[];

  from: string;

  subject: string;

  body: string;

  status: EmailStatus;

  createdAt: Date;
}
