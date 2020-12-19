import {Thumbnail} from "./thumbnail.model";


export class Snippet {
  publishedAt: string = '';
  channelId? : string;
  title? :string;
  description?: string;
  channelTitle?: string;
  tags?: string[];
  liveBroadcastContent?: string;
  publishTime?: string;
  thumbnails?: Thumbnail;
}
