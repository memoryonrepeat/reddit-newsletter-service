import { Injectable, OnModuleInit } from '@nestjs/common'
import { PreferenceInput } from './dtos/preference-input.dto'
import { InjectRedis, Redis } from '@svtslv/nestjs-ioredis'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { RedditService } from './services/reddit/reddit.service'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private schedulerRegistry: SchedulerRegistry,
    private redditService: RedditService
  ) {}

  async onModuleInit() {
    const result = await this.redditService.getTopPosts([
      'soccer',
      'fifa',
      'math'
    ])

    console.log('result', result)

    const stream = this.client.scanStream()
    stream.on('data', async (hashes) => {
      hashes.map(async (hash) => {
        const res = await this.client.hgetall(hash)
        console.log('--->', hash, res)
        const job = new CronJob(`2 * * * * *`, () => {
          console.log(`job ${hash} runs every 2 seconds`)
        })
        this.schedulerRegistry.addCronJob(hash, job)
        job.start()
      })
    })
    stream.on('end', () => {
      console.log('initialized existing crons')
    })
  }

  async upsertPreference(preferenceInput: PreferenceInput) {
    const { email, ...rest } = preferenceInput
    await this.client.hmset(email, new Map(Object.entries(rest)))
    return preferenceInput
  }
}
