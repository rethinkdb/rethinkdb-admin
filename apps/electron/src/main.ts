declare const module: any;
import { NestFactory } from '@nestjs/core';
import { app, BrowserWindow } from 'electron';
import { AppModule } from './app.module';

function createWindow () {
  // Создаем окно браузера.
  let win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // и загрузить index.html приложения.
  win.loadFile('index.html')
}

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  await server.listen(3000);

  console.log(app);
  app.whenReady().then(createWindow)

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      console.trace('WTF');
      server.close();
    });
  }
}

bootstrap();
