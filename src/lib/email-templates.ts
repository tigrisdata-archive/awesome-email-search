import FeedbackRequestTemplate from '@/components/email-templates/feedback-request';
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
  welcome: WelcomeEmailTemplate,
  community: JoinCommunityEmailTemplate,
  feedback: FeedbackRequestTemplate,
};
