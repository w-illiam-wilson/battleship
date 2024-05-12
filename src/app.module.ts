import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './modules/match/match.module';
import { UserModule } from './modules/user/user.module';
import { SessionMiddleware } from './middleware/session.middleware';
import { User } from './modules/user/entities/database/user.entity';
import { Match } from './modules/match/entities/database/match.entity';
import { BoardModule } from './modules/board/board.module';
import { Board } from './modules/board/entities/database/board-table.entity';
import { LeaderboardModule } from './modules/leaderboard/leaderboard.module';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    UserModule,
    BoardModule,
    MatchModule,
    LeaderboardModule,

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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ClsMiddleware, SessionMiddleware)
      .exclude("users(.*)")
      .forRoutes('*');
  }
}
