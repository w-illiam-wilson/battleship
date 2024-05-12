import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ClsMiddleware, ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchModule } from './match/match.module';
import { UsersModule } from './authentications/users.module';
import { SessionMiddleware } from './authentications/middleware/session.middleware';
import { User } from './authentications/entities/user-table.entity';
import { Match } from './match/entities/match-table.entity';
import { BoardModule } from './board/board.module';
import { Board } from './board/entities/board-table.entity';

@Module({
  imports: [
    UsersModule,
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
