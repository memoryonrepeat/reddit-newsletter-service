import { Injectable, OnModuleInit } from '@nestjs/common'
import { PreferenceInput } from './dtos/preference-input.dto'
import { RedisService } from 'nestjs-redis'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'


@Injectable()
export class AppService implements OnModuleInit {
  constructor(
  	private readonly redisService: RedisService,
    private client,
    private schedulerRegistry: SchedulerRegistry
  ) {
  	this.init()
  }

  // Workaround to use async constructor
  async init(){
  	this.client = await this.redisService.getClient()

  }

  // Lifecycle event
  async onModuleInit() {
  	const stream = this.client.scanStream()
    stream.on('data', async (data) => {
      const res = await this.client.hgetall(data)
      console.log('--->', data, res)
      const seconds = 5
      const job = new CronJob(`${seconds} * * * * *`, () => {
        console.log(`time (${seconds}) for job news to run!`);
      })
      this.schedulerRegistry.addCronJob('news', job)
      
    })
    console.log(`The module has been initialized.`);
  }

  async upsertPreference(preferenceInput: PreferenceInput) {
    const { email, ...rest } = preferenceInput
    await this.client.hmset(email, new Map(Object.entries(rest)))
    return preferenceInput
  }
}
