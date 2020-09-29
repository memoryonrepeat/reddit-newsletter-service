import { Injectable } from '@nestjs/common'
import { PreferenceInput } from './dtos/preference-input.dto'
import { RedisService } from 'nestjs-redis'

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}
  async upsertPreference(preferenceInput: PreferenceInput) {
    const client = await this.redisService.getClient()
    const { email, ...rest } = preferenceInput
    await client.hmset(email, new Map(Object.entries(rest)))
    return preferenceInput
  }
}
