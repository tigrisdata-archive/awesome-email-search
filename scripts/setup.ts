import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

import { Email } from '../src/db/models/email';
import { Tigris } from '@tigrisdata/core';

const main = async () => {
  const client = new Tigris();
  const search = client.getSearch();
  await search.createOrUpdateIndex<Email>(Email);
};

main()
  .then(() => {
    console.log('✅ Setup complete');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Something went wrong in the setup script');
    console.error(err);
    process.exit(1);
  });
