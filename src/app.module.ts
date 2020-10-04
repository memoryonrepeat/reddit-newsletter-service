import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from '@svtslv/nestjs-ioredis'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
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
