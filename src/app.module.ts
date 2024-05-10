import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    HistoryModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      entities: [],
      database: 'williamwilson',
      synchronize: true,
      logging: true,
    }),
  ],
})
export class AppModule { }
