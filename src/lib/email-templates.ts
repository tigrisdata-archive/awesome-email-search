import JoinCommunityEmailTemplate from '@/components/email-templates/join-community';
import WelcomeEmailTemplate from '@/components/email-templates/welcome';

export interface EmailTemplateProps {
  name: string;
  link?: string;
}

export interface ITemplateField {
  displayName: string;
  formName: string;
}

export interface IEmailTemplates {
  [key: string]: IEmailTemplate;
}

export interface IEmailTemplate {
  templateName: string;
  emailSubject: string;
  template: React.FC<Readonly<EmailTemplateProps>>;
  fields: ITemplateField[];
}

export const EmailTemplates: IEmailTemplates = {
  welcome: {
    templateName: 'Welcome',
    emailSubject: 'Welcome to our Product 🐯',
    template: WelcomeEmailTemplate,
    fields: [
      {
        displayName: 'Name',
        formName: 'name',
      },
    ],
  },
  community: {
    templateName: 'Join the community',
    emailSubject: 'Join our Product community 🌱',
    template: JoinCommunityEmailTemplate,
    fields: [
      {
        displayName: 'Name',
        formName: 'name',
      },
      {
        displayName: 'Community link',
        formName: 'link',
      },
    ],
  },
};
