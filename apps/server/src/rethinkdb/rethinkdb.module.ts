import { Module } from '@nestjs/common';
import { RethinkdbProvider } from './rethinkdb.provider';

@Module({
  providers: [RethinkdbProvider],
  exports: [RethinkdbProvider],
})
export class RethinkdbModule {}
