import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Results} from "../models/search-results/results.model";
import {environment} from "../../environments/environment";
import {delay, map, mergeMap, tap} from "rxjs/operators";
import {VideoList} from "../models/video/video-list.model";
import {ChannelList} from "../models/channels/channelList.model";
import {RankingUtil} from "../utils/ranking.util";
import {Video} from "../models/video/video.model";

@Injectable()
export class YoutubeService {
  private baseUrl: string;
  private key: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'https://www.googleapis.com/youtube/v3/';
    this.key = environment.apiKey;
  }

  public getResults(query: string): Observable<Video[]> {
    let videoIds: string[] = [];
    return this.getSearchResults(query)
      .pipe(
        tap(videoList => {
          videoList.items.forEach(item => {
            if (item.id?.videoId) {
              videoIds.push(item.id.videoId);
            }
          })
        }),
        mergeMap(() => this.getVideoStats(videoIds)),
        map(videos => {
          videos.items.forEach(video => {
            if (video.snippet?.channelId) {
              this.getChannelStats(video.snippet?.channelId)
                .subscribe(stat => {
                  if (video.statistics && stat.items && stat.items[0].statistics) {
                    video.statistics.subscriberCount = stat.items[0].statistics.subscriberCount;
                  }
                });
            }
          });
          return videos;
        }),
        delay(1000),
        map(videoList => {
          return RankingUtil.rankVideos(videoList.items);
        })
      );
  }

  private getSearchResults(query: string, token?: string, isPrev: boolean = false): Observable<Results> {
    let params: HttpParams = new HttpParams()
      .set('key', this.key)
      .set('part', 'snippet')
      .set('maxResults', '25')
      .set('order', 'relevance')
      .set('q', query)
      .set('regionCode', 'DE');

    if (!!token) {
      if (isPrev) {
        params = params.set('prevPageToken', token);
      } else {
        params = params.set('nextPageToken', token);
      }
    }
    return this.http.get<Results>(this.baseUrl + 'search', {headers: {
        referrerPolicy: "origin"
      }, params: params});
  }

  private getVideoStats(videoIds: string[]): Observable<VideoList> {
    const params: HttpParams = new HttpParams()
      .set('key', this.key)
      .set('part', 'snippet, contentDetails, statistics')
      .set('id', videoIds.join(','));

    return this.http.get<VideoList>(this.baseUrl + 'videos', {params: params});
  }

  private getChannelStats(id: string): Observable<ChannelList> {
    const params: HttpParams = new HttpParams()
      .set('key', this.key)
      .set('part', 'statistics')
      .set('id', id);

    return this.http.get<ChannelList>(this.baseUrl + 'channels', {params: params});
  }
}
