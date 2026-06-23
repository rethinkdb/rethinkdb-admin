import { Module } from '@nestjs/common';
import { RethinkdbModule } from '../rethinkdb/rethinkdb.module';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [RethinkdbModule],
  providers: [EventsGateway],
})
export class EventsModule {}
