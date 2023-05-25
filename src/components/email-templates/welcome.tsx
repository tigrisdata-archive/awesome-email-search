import { EmailTemplateProps, IEmailTemplate } from '@/lib/email-templates';
import * as React from 'react';

const template: React.FC<Readonly<EmailTemplateProps>> = ({ name }) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      Thanks signing up for our product. We&apos;re thrilled to have you on
      board.
    </p>
  </div>
);

const WelcomeEmailTemplate: IEmailTemplate = {
  templateName: 'Welcome to our Product 🐯',
  emailSubject: 'Welcome to our Product 🐯',
  template,
  fields: [
    {
      displayName: 'Name',
      formName: 'name',
    },
  ],
};

export default WelcomeEmailTemplate;
