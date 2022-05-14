import { join } from 'path';

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';

import { EventsModule } from './events/events.module';
import { RethinkdbModule } from './rethinkdb/rethinkdb.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'build'),
      exclude: ['/api*'],
    }),
    EventsModule,
    RethinkdbModule,
  ],
})
export class AppModule {}
