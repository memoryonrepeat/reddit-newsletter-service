import { Injectable, OnModuleInit } from '@nestjs/common'
import { PreferenceInput } from './dtos/preference-input.dto'
import { InjectRedis, Redis } from '@svtslv/nestjs-ioredis'
import { SchedulerRegistry } from '@nestjs/schedule'
import { CronJob } from 'cron'
import { RedditService } from './services/reddit/reddit.service'
import { EmailService } from './services/email/email.service'
import { SlackService } from './services/slack/slack.service'

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRedis() private readonly client: Redis,
    private schedulerRegistry: SchedulerRegistry,
    private redditService: RedditService,
    private emailService: EmailService,
    private slackService: SlackService
  ) {}

  // Keep track of current jobs to remove when needed
  private readonly currentJobs = {}

  // On startup, load all preferences from storage and resume the crons
  async onModuleInit() {
    const stream = this.client.scanStream()

    stream.on('data', async (emails) => {
      emails.map(async (email) => this.configSingleJob(email))
    })

    stream.on('end', () => {
      console.log('Finished initializing existing crons')
    })
  }

  async configSingleJob(email: string) {
    const preference = await this.client.hgetall(email)

    if (
      Object.keys(preference).length === 0 &&
      preference.constructor === Object
    ) {
      return
    }

    // Only setup active jobs
    // When running job is disabled, remove it
    if (preference.active !== 'true') {
      if (email in this.currentJobs) {
        this.schedulerRegistry.deleteCronJob(email)
        delete this.currentJobs[email]
        console.log(`Job for ${email} has been disabled`)
      }

      return
    }

    // Only send on working days
    const schedule = `0 ${preference.minute} ${preference.hour} * * 1-5`

    // Send every 10 seconds. Uncomment this for quick testing
    // const schedule = '*/10 * * * * *'

    const job = new CronJob(schedule, async () => {
      const topPosts = await this.redditService.getTopPosts([
        preference.sub1,
        preference.sub2,
        preference.sub3
      ])

      if (preference.type === 'email') {
        await this.emailService.send(topPosts, email)
      } else if (preference.type === 'slack') {
        await this.slackService.send(topPosts, email)
      }
    })

    // Need to remove existing job before creating a new one
    if (email in this.currentJobs) {
      this.schedulerRegistry.deleteCronJob(email)
      delete this.currentJobs[email]
    }

    this.schedulerRegistry.addCronJob(email, job)
    this.currentJobs[email] = job
    job.start()
    console.log(
      `
        Cron initialized.
        Email: ${email}. 
        Preferences: ${JSON.stringify(preference)}.
        Schedule: ${schedule}
      `
    )
  }

  // Create / update new preference
  // Preferences are stored as hash objects in Redis with key = email
  async upsertPreference(preferenceInput: PreferenceInput) {
    const { email, ...rest } = preferenceInput

    await this.client.hmset(email, new Map(Object.entries(rest)))
    await this.configSingleJob(email)

    return preferenceInput
  }

  // Get current preference for a single email
  async getPreference(email) {
    return this.client.hgetall(email)
  }
}
