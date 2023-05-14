import { SearchField, TigrisSearchIndex } from '@tigrisdata/core';

export enum EmailStatus {
  Sent,
  Delivered,
  DeliveryDelayed,
  Complained,
  Bounced,
}

@TigrisSearchIndex('emails')
export class Email {
  @SearchField({ id: true })
  id?: string;

  @SearchField({ sort: true })
  to!: string;

  @SearchField({ sort: true })
  from!: string;

  @SearchField({ sort: true })
  body!: string;

  @SearchField({ sort: true, facet: true })
  status!: EmailStatus;
}
