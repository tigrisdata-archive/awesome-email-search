import { EmailTemplateProps, IEmailTemplate } from '@/lib/email-templates';
import * as React from 'react';

const template: React.FC<Readonly<EmailTemplateProps>> = ({ name, link }) => (
  <div>
    <h1>Hi, {name}!</h1>
    <p>
      We hope your time with our product is going well. We wanted to let you
      know we have a fantastic community that we&apos;d love you to be a part
      of.
    </p>
    <a href={link}>
      <button>Join our community</button>
    </a>
  </div>
);

const FeedbackRequestTemplate: IEmailTemplate = {
  templateName: 'Product feedback request 👂',
  emailSubject: 'Product feedback request 👂',
  template,
  fields: [
    {
      displayName: 'Name',
      formName: 'name',
    },
    {
      displayName: 'Calendar link',
      formName: 'link',
    },
  ],
};

export default FeedbackRequestTemplate;
