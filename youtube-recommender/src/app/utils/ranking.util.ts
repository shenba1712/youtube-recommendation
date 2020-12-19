import {Video} from "../models/video/video.model";

export class RankingUtil {
  static rankVideos(videos: Video[]): Video[] {
    let maxEntries =  videos.length > 5 ? 5 : videos.length;
    let today: any = new Date();
    videos.forEach(video => {
      if (video.statistics && video.statistics.viewCount > 5000 ) {
        if (video.snippet) {
          let publishedDate: any = Date.parse(video.snippet.publishedAt);
          let diff = Math.floor((today - publishedDate) / (1000 * 60 * 60 * 24));
          let viewSubscriptionRatio = video.statistics.viewCount / video.statistics.subscriberCount;
          let likeDislikeRatio = video.statistics.likeCount / video.statistics.dislikeCount;
          video.customScore = this.rank(video.statistics.viewCount, viewSubscriptionRatio, likeDislikeRatio, diff);
        }
      }
    });
    return videos.sort((a, b) => b.customScore - a.customScore).slice(0, maxEntries);
  }

  private static rank(viewCount: number, viewSubscriptionRatio: number, likeDislikeRatio: number, days: number) {
    if (viewSubscriptionRatio > 5) {
      viewSubscriptionRatio = 5;
    }
    if (likeDislikeRatio > 5) {
      likeDislikeRatio = 5;
    }
    return (viewCount * viewSubscriptionRatio * likeDislikeRatio) / days;
  }
}
