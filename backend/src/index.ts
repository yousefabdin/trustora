import { config } from 'dotenv';

config();

import { createApp } from './app';
import { getEnv } from './lib/env';

const env = getEnv();
const app = createApp();

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Holdline API listening on port ${env.PORT}`);
});
