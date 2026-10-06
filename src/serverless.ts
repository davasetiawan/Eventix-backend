import { NestFactory } from '@nestjs/core';
import serverlessHttp from 'serverless-http';
import { AppModule } from './app.module';
import { setupApp } from './app.setup';

type Handler = ReturnType<typeof serverlessHttp>;

let cachedHandler: Promise<Handler> | undefined;

// Inisialisasi Nest sekali per instance function, lalu dipakai ulang
// di setiap request selama instance masih hangat.
async function bootstrap(): Promise<Handler> {
  const app = await NestFactory.create(AppModule);
  setupApp(app);
  await app.init();
  return serverlessHttp(app.getHttpAdapter().getInstance());
}

const FUNCTION_PREFIX = '/.netlify/functions/api';

export const handler = async (
  event: { path?: string } & Record<string, unknown>,
  context: object,
) => {
  // Redirect di netlify.toml meneruskan /api/* dan /docs/* ke function ini;
  // buang prefix function supaya route Nest (/api/v1/..., /docs) tetap cocok.
  if (event.path?.startsWith(FUNCTION_PREFIX)) {
    event.path = event.path.slice(FUNCTION_PREFIX.length) || '/';
  }

  cachedHandler ??= bootstrap();
  try {
    const run = await cachedHandler;
    return await run(event, context);
  } catch (error) {
    cachedHandler = undefined;
    throw error;
  }
};
