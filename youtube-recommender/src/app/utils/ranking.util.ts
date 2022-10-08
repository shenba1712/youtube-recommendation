import {Video} from "../models/video/video.model";
import {Statistics} from "../models/video/statistics.model";

export class RankingUtil {
  static rankVideos(videos: Video[]): Video[] {
    let maxEntries =  videos.length > 10 ? 10 : videos.length;
    let today: any = new Date();
    videos.forEach(video => {
      let stats = video.statistics;
      if (stats && this.chooseVideo(stats)) {
        if (video.snippet) {
          let publishedDate: any = Date.parse(video.snippet.publishedAt);
          let diff = Math.floor((today - publishedDate) / (1000 * 60 * 60 * 24));
          let viewSubscriptionRatio = stats.viewCount / stats.subscriberCount;
          let likeViewRatio = stats.likeCount / stats.viewCount;
          video.customScore = this.rank(stats.viewCount, viewSubscriptionRatio, likeViewRatio, diff);
        }
      }
    });

    videos = videos.filter(video => !!video.customScore)
      .sort((a, b) => b.customScore - a.customScore)
      .slice(0, maxEntries);
    return videos;
  }

  private static chooseVideo(videoStatistics: Statistics): boolean {
    return videoStatistics.viewCount >= 7500 && videoStatistics.likeCount >= 500;
  }

  private static rank(viewCount: number, viewSubscriptionRatio: number, likeViewRatio: number, days: number): number {
    if (days <= 365 * 3) {
      return (viewCount * viewSubscriptionRatio * likeViewRatio) / days;
    } else {
      return undefined;
    }
  }
}
