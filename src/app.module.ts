import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from 'nestjs-redis'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    RedisModule.register({
      host: 'redis'
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
