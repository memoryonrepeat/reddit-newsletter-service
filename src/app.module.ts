import { Module, HttpModule } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from '@svtslv/nestjs-ioredis'
import { ScheduleModule } from '@nestjs/schedule'
import { RedditModule } from './services/reddit/reddit.module'
import { EmailModule } from './services/email/email.module'
import { SlackModule } from './services/slack/slack.module'

@Module({
  imports: [
    HttpModule,
    RedditModule,
    EmailModule,
    SlackModule,
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
