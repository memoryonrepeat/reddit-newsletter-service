import { Module, HttpModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from '@svtslv/nestjs-ioredis'
import { ScheduleModule } from '@nestjs/schedule'
import { RedditModule } from './services/reddit/reddit.module'

@Module({
  imports: [
    HttpModule,
    RedditModule,
    ScheduleModule.forRoot(),
    RedisModule.forRoot({
      config: {
        host: 'redis'
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
