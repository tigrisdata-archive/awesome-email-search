import {
  SearchField,
  TigrisDataTypes,
  TigrisSearchIndex,
} from '@tigrisdata/core';

export enum EmailStatus {
  Sent,
  Delivered,
  DeliveryDelayed,
  Complained,
  Bounced,
}

export const EMAIL_INDEX_NAME = 'emails';

@TigrisSearchIndex(EMAIL_INDEX_NAME)
export class Email {
  @SearchField({ id: true })
  id?: string;

  @SearchField({ sort: true })
  firstTo!: string;

  @SearchField({ elements: TigrisDataTypes.STRING })
  to!: string[];

  @SearchField({ sort: true })
  from!: string;

  @SearchField({ sort: true })
  body!: string;

  @SearchField({ sort: true, facet: true })
  status!: EmailStatus;

  @SearchField({ sort: true })
  createdAt!: Date;
}
