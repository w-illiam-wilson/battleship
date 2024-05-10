import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { PlayModule } from './play/play.module';

@Module({
  imports: [
    AuthenticationsModule,
    PlayModule,
    HistoryModule,

    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
  }),
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
