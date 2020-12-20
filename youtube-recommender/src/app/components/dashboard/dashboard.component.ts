import { Component, OnInit } from '@angular/core';
import {YoutubeService} from "../../service/youtube.service";
import {Video} from "../../models/video/video.model";
import {DomSanitizer} from "@angular/platform-browser";
import {faThumbsUp, faThumbsDown, faEye, faCalendarCheck, faClock} from "@fortawesome/free-solid-svg-icons";
import {TimeFormatUtil} from "../../utils/timeFormat.util";
import {NumberUtil} from "../../utils/number.util";
import {MatDialog} from "@angular/material/dialog";
import {PlayerDialogComponent} from "../player-dialog/player-dialog.component";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  query: string = '';
  results: Video[] = [];
  loading: boolean = false;
  error: boolean = false;
  errorCode: number;

  calendar = faCalendarCheck;
  likeIcon = faThumbsUp;
  dislikeIcon = faThumbsDown;
  viewIcon = faEye;
  clock = faClock;


  constructor(private youtubeService: YoutubeService,
              private sanitizer: DomSanitizer,
              private dialog: MatDialog,
              private window: Window) {
  }

  ngOnInit(): void {
  }

  onSearch() {
    this.results = [];
    if (this.query) {
      this.loading = true;
      this.error = false;
      this.youtubeService.getResults(this.query).subscribe(res => {
        this.results = res;
        this.loading = false;
      }, err => {
        this.error = true;
        this.errorCode = err.error.error.code;
        this.loading = false;
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

  getVideoLink(id) {
    return (window.matchMedia('(max-width: 467px)').matches) ?
      this.sanitizer.bypassSecurityTrustUrl('https://www.youtube.com/watch?v=' + id) :
      undefined;
  }

  getChannelLink(id) {
    return this.sanitizer.bypassSecurityTrustUrl('https://www.youtube.com/channel/' + id);
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

  play(id, title) : void {
    if (this.getVideoLink(id) === undefined) {
      const dialogRef = this.dialog.open(PlayerDialogComponent, {
        width: '1500px',
        data: {id: id, title: title}
      });

      dialogRef.afterClosed().subscribe();
    }
  }

}
