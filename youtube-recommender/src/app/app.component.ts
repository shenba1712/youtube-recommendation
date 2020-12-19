import { Component } from '@angular/core';
import { faVideo, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'youtube-recommender';
  icon: IconDefinition = faVideo;
}
