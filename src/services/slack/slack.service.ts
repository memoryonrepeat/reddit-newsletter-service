import { Injectable } from '@nestjs/common'

@Injectable()
export class SlackService {
  constructor() {}

  // Mock function to send Slack message
  async send(topPosts: [], email: string) {
    console.log(
      `Sending newsletter to Slack account ${email}. Payload: ${JSON.stringify(
        topPosts
      )}`
    )
  }
}
