import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryModule } from './history/history.module';
import { AuthenticationsModule } from './authentications/authentications.module';
import { PlayModule } from './play/play.module';
import { SessionMiddleware } from './authentications/middleware/session.middleware';

@Module({
  imports: [
    AuthenticationsModule,
    PlayModule,
    HistoryModule,

    ClsModule.forRoot({
      global: true,
      middleware: { mount: false },
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, SessionMiddleware)
      .exclude("authentications/(.*)")
      .forRoutes('*');
  }
}
