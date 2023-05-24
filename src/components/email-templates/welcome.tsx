import { EmailTemplateProps } from '@/lib/email-templates';
import * as React from 'react';

export const WelcomeEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  name,
}) => (
  <div>
    <h1>Welcome, {name}!</h1>
    <p>
      Thanks signing up for our product. We&apos;re thrilled to have you on
      board.
    </p>
  </div>
);

export default WelcomeEmailTemplate;
