declare const module: any;
import { NestFactory } from '@nestjs/core';
import compression from 'compression';

import { AppModule } from './app.module';

const isDevelopment = process.env.NODE_ENV === 'development';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (isDevelopment) {
    const devModule = await import('./dev');
    devModule.initDev(app);
  }
  if (!isDevelopment) {
    app.use(compression());
  }
  await app.listen(3000);

  if (isDevelopment) {
    if (module.hot) {
      module.hot.accept();
      module.hot.dispose(() => app.close());
    }
  }
}

bootstrap();
