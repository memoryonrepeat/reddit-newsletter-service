import { Injectable } from '@nestjs/common'

@Injectable()
export class EmailService {
  constructor() {}

  // Mock function to send email
  async send(topPosts: [], email: string) {
    console.log(
      `Sending newsletter to email ${email}. Payload: ${JSON.stringify(
        topPosts
      )}`
    )
  }
}
