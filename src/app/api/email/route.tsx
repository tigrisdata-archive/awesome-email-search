import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-template';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const formData = await request.formData();
  const body = EmailTemplate({
    firstName: formData.get('firstName')?.valueOf() as string,
    product: formData.get('product')?.valueOf() as string,
  })!;
  console.log('created email');
  const data = await resend.sendEmail({
    from: 'phil@leggetter.co.uk',
    to: 'phil@leggetter.co.uk',
    subject: 'hello world',
    react: body,
  });
  console.log('sent email');

  return NextResponse.json({ data });
}
