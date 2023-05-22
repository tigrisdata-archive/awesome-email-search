import { EmailTemplateProps } from '@/lib/email-templates';
import * as React from 'react';

export const JoinCommunityEmailTemplate: React.FC<
  Readonly<EmailTemplateProps>
> = ({ name, link }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      We hope your time with our product is going well. We wanted to let you
      know we have a fantastic community that we'd love you to be a part of.
    </p>
    <a href={link}>
      <button>Join our community</button>
    </a>
  </div>
);

export default JoinCommunityEmailTemplate;
