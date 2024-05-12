import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './modules/match/match.module';
import { UserModule } from './modules/user/user.module';
import { SessionMiddleware } from './middleware/session.middleware';
import { User } from './modules/user/entities/database/user-table.entity';
import { Match } from './modules/match/entities/database/match-table.entity';
import { BoardModule } from './modules/play/board.module';
import { Board } from './modules/play/entities/database/board-table.entity';

@Module({
  imports: [
    UserModule,
    BoardModule,
    MatchModule,

    ClsModule.forRoot({
      global: true,
      middleware: { mount: false },
  }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      entities: [User, Match, Board],
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
      .exclude("users/(.*)")
      .forRoutes('*');
  }
}
