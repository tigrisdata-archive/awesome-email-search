import { EmailStatus, EmailResult } from '../../lib/shared-email-types';
export { EmailStatus } from '../../lib/shared-email-types';
import {
  SearchField,
  TigrisDataTypes,
  TigrisSearchIndex,
} from '@tigrisdata/core';

export const EMAIL_INDEX_NAME = 'emails';

@TigrisSearchIndex(EMAIL_INDEX_NAME)
export class Email implements EmailResult {
  @SearchField({ id: true })
  id?: string;

  @SearchField({ sort: true })
  firstTo!: string;

  @SearchField({ elements: TigrisDataTypes.STRING })
  to!: string[];

  @SearchField({ sort: true })
  from!: string;

  @SearchField({ sort: true })
  subject!: string;

  @SearchField()
  body!: string;

  @SearchField({ sort: true, facet: true })
  status!: EmailStatus;

  @SearchField({ sort: true })
  createdAt!: Date;
}
