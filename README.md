# Awesome Email Search with Resend & Tigris Search

An example of sending emails with [Resend](https://resend.com?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search) and indexing & searching those emails with [Tigris Search](https://www.tigrisdata.com/docs/concepts/searching/?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search).

https://github.com/tigrisdata-community/awesome-email-search/assets/328367/c87c5c59-b6fc-4814-9278-be0cfdac6084

The application is built with Next.js and Tailwind CSS.

## Install dependencies

```sh
npm i
```

Or the equivalent with other package managers.

## Create a Tigris project

The following command uses the Tigris CLI to log you into Tigris Cloud (you can
signup if you don't already have an account), create a project, and save your
Tigris project configuration to a `.env.local` file.

```sh
npm run tigris:init
```

By default, the name `awesome-email-search` is used as the project name. You can override
this by passing in `--project={name}` flag. For example:

```sh
npm run tigris:init --project awesome-project
```

## Set up a Resend account

[Signup for a Resend account](https://resend.com/signup?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search) and [configure your domain](https://resend.com/docs/dashboard/domains/introduction?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search) so you can send emails from your domain via Resend.

Add a `RESEND_API_KEY` environmental variable with your Resend API key.

Add a `DEFAULT_EMAIL` with the email address associated with the domain you've configured with Resend.

Finally, setup [Resend webhooks](https://resend.com/docs/dashboard/webhooks/introduction?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search) and configure them to point to `{your-app}/api/email/webhook` where `{your-app}` is a local proxy pointing to your app running on `localhost:3000`.

## Check your environment variables

The repo contains a `.env.example` that you can use to check your `.env.local` or copy over and use directly.

## Getting Started

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## Learn More

- [Resend docs](https://resend.com/docs/introduction?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search).
- [Tigris Search TypeScript documentation](https://www.tigrisdata.com/docs/sdkstools/typescript/search/?utm_source=awesome-email-search&utm_medium=code&utm_campaign=awesome-email-search).

## Deploy on Vercel

Deploy the Awesome Email Search app to the
[Vercel Platform](https://vercel.com/new).
