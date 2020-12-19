import {PageInfo} from "../pageInfo.model";
import {Items} from "./search-items.model";

export class Results {
  nextPageToken?: string;
  prevPageToken?: string;
  pageInfo?: PageInfo;
  items: Items[] = [];
}
