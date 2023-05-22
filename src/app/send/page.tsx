'use client';

import { Alert } from '@/components/alert';
import Row from '@/components/row';
import { EmailTemplates, IEmailTemplate } from '@/lib/email-templates';
import { useState } from 'react';

export default function Send({
  searchParams,
}: {
  searchParams: { success: string; description?: string };
}) {
  const [selectedTemplate, setTemplate] = useState<IEmailTemplate>(
    EmailTemplates['welcome']
  );
  return (
    <Row>
      {searchParams.success && searchParams.success === 'true' && (
        <Alert
          title="Email successfully sent"
          text={searchParams.description}
          type="SUCCESS"
          className="mb-10"
        />
      )}
      {searchParams.success && searchParams.success === 'false' && (
        <Alert
          title="Email sending failed"
          text={searchParams.description}
          type="ERROR"
          className="mb-10"
        />
      )}
      <h1 className="text-lg pb-4">Send an email</h1>
      <form
        action="/api/email"
        method="POST"
        className="grid grid-cols-1 gap-6 w-2/6"
      >
        <label className="block">
          <span>Email onboarding template</span>
          <select
            className="mt-1 block w-full form-select text-slate-950 font-sans"
            name="stage"
            onChange={(e) => {
              setTemplate(EmailTemplates[e.target.value]);
            }}
          >
            {Object.keys(EmailTemplates).map((key) => {
              const template = EmailTemplates[key];
              return (
                <option key={key} value={key}>
                  {template.templateName}
                </option>
              );
            })}
          </select>
        </label>
        {selectedTemplate.fields.map((field) => {
          return (
            <label key={field.formName} className="block">
              <span>{field.displayName}</span>
              <input
                className="mt-1 block w-full form-input text-slate-950 font-sans"
                type="text"
                name={field.formName}
                required
              />
            </label>
          );
        })}
        <label className="flex justify-end">
          <button className="px-4 py-2 font-semibold text-sm bg-green-50 dark:bg-gray-800 text-white rounded-md shadow-sm opacity-100">
            Send
          </button>
        </label>
      </form>
    </Row>
  );
}
