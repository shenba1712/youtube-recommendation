import {Snippet} from "../snippet.model";
import {Statistics} from "./statistics.model";
import {ContentDetails} from "./contentDetails.model";

export class Video {
  id?: string;
  snippet?: Snippet;
  contentDetails?: ContentDetails;
  statistics?: Statistics;
  customScore?: number = 0;
}
