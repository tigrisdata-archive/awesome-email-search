export enum EmailStatus {
  Sent,
  Delivered,
  DeliveryDelayed,
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
