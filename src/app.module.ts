import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RedisModule } from 'nestjs-redis'

@Module({
  imports: [
    RedisModule.register({
      host: 'redis',
      onClientReady: async (client) => {
        const stream = client.scanStream()
        stream.on('data', async (data) => {
          console.log('--->', data)
          const res = await client.hgetall(data)
          console.log('????', res)
        })
        /*const res = await client.scan(0, 'match', '*')
        console.log('full db', res)*/
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
