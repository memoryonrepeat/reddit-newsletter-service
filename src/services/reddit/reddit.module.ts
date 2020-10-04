import { Module, HttpModule } from '@nestjs/common'
import { RedditService } from './reddit.service'

@Module({
  imports: [HttpModule],
  providers: [RedditService],
  exports: [RedditService]
})
export class RedditModule {}
