import { Injectable, HttpService } from '@nestjs/common'

const POSTS_PER_SUB = 3
const TIME_UNIT = 'day'
const BASE_REDDIT_URL = 'https://www.reddit.com'

@Injectable()
export class RedditService {
  constructor(private httpService: HttpService) {}

  async getTopPosts(subs: string[]): Promise<any> {
    return Promise.all(
      subs.map(async (sub) => {
        if (!sub) {
          console.log('Warning - One of the sub is empty')
          return []
        }

        try {
          const request = `${BASE_REDDIT_URL}/r/${sub}/top.json?limit=${POSTS_PER_SUB}&t=${TIME_UNIT}`
          const response = await this.httpService.get(request).toPromise()
          if (response.status !== 200) {
            console.log(
              'Unhealthy response',
              response.status,
              response.statusText
            )
            return []
          }
          const topPosts = response.data?.data?.children.map((entry) => ({
            title: entry.data.title,
            upvotes: entry.data.ups,
            link: BASE_REDDIT_URL + entry.data.permalink
          }))

          return topPosts
        } catch (err) {
          console.log('Error while fetching posts', err.response.data)
          return []
        }
      })
    )
  }
}
