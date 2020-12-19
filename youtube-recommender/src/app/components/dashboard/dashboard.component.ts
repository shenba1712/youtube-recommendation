import { Component, OnInit } from '@angular/core';
import {YoutubeService} from "../../service/youtube.service";
import {Video} from "../../models/video/video.model";
import {DomSanitizer} from "@angular/platform-browser";
import {faThumbsUp, faThumbsDown, faEye, faCalendarCheck, faClock} from "@fortawesome/free-solid-svg-icons";
import {TimeFormatUtil} from "../../utils/timeFormat.util";
import {NumberUtil} from "../../utils/number.util";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  query: string = '';
  results: Video[] = [];

  calendar = faCalendarCheck;
  likeIcon = faThumbsUp;
  dislikeIcon = faThumbsDown;
  viewIcon = faEye;
  clock = faClock;


  constructor(private youtubeService: YoutubeService,
              private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
  }

  onSearch() {
    this.results = [];
    if (this.query) {
      this.youtubeService.getResults(this.query).subscribe(res => {
        this.results = res;
      }, err => {
        console.log(err);
      });
    }
  }

   getDescription(description) {
    if (description.length > 500) {
      return description.substring(0,350) + '...';
    } else {
      return description;
    }
  }

  getLink(id) {
    return this.sanitizer.bypassSecurityTrustUrl('https://www.youtube.com/watch?v=' + id);
  }

  getPublishedAt(date) {
    return TimeFormatUtil.getPublishedAt(date);
  }

  abbreviateNumber(number) {
    return NumberUtil.abbreviateNumber(number);
  }

  getDuration(duration) {
    return TimeFormatUtil.durationFormat(duration);
  }

}
