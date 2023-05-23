'use client';

import { Alert } from '@/components/alert';
import Row from '@/components/row';
import { EmailTemplates } from '@/lib/email-templates';
import { FormEvent, useState } from 'react';

export default function Send() {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean | undefined>();
  const [error, setError] = useState<string | undefined>('');
  const defaultTemplateName = Object.keys(EmailTemplates)[0];
  const [formData, setFormData] = useState<Record<string, string>>({
    stage: defaultTemplateName,
  });

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setSubmitting(true);

    const response = await fetch('/api/email', {
      method: 'POST',
      body: new URLSearchParams(formData),
    });

    const success = response.status === 201;
    setSubmitSuccess(success);
    if (success) {
      setFormData({ stage: defaultTemplateName });
    } else {
      try {
        const result = await response.json();
        setError(result.error);
      } catch (_ex) {
        setError('An unknown error occured.');
      }
    }
    setSubmitting(false);
  };

  const updateFormData = (formName: string, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [formName]: value,
    }));
  };

  return (
    <Row>
      {submitSuccess !== undefined && submitSuccess === true && (
        <Alert
          title="Email successfully sent"
          type="SUCCESS"
          className="mb-10"
        />
      )}
      {submitSuccess !== undefined && submitSuccess === false && (
        <Alert
          title="Email sending failed"
          text={error}
          type="ERROR"
          className="mb-10"
        />
      )}
      <h1 className="text-lg pb-4">Send an email</h1>
      <form
        action="/api/email"
        method="POST"
        className="w-5/6 lg:w-2/6"
        onSubmit={handleSubmit}
      >
        <fieldset className="grid grid-cols-1 gap-6">
          <label className="block">
            <span>Email onboarding template</span>
            <select
              className="mt-1 block w-full form-select text-slate-950 font-sans"
              name="stage"
              onChange={(e) => {
                updateFormData('stage', e.target.value);
              }}
              value={formData['stage']}
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
          {EmailTemplates[formData['stage']].fields.map((field) => {
            return (
              <label key={field.formName} className="block">
                <span>{field.displayName}</span>
                <input
                  onChange={(ev) =>
                    updateFormData(field.formName, ev.target.value)
                  }
                  className="mt-1 block w-full form-input text-slate-950 font-sans"
                  type="text"
                  name={field.formName}
                  required
                  readOnly={submitting}
                  value={formData[field.formName] || ''}
                />
              </label>
            );
          })}
          <label className="flex justify-end">
            <button
              className="px-4 py-2 font-semibold text-sm bg-green-50 dark:bg-gray-800 text-white rounded-md shadow-sm opacity-100 hover:bg-green-300 hover:dark:bg-gray-600"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Send'}
            </button>
          </label>
        </fieldset>
      </form>
    </Row>
  );
}
