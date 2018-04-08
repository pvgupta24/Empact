import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import {DomSanitizer,SafeResourceUrl,} from '@angular/platform-browser';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  room;
  user:any
	playerUrl = null
	insightUrl = null

  constructor(private auth: AuthenticationService, private route: ActivatedRoute, private http: HttpClient, public sanitizer: DomSanitizer) {
    this.route.params.subscribe(params => this.room = params.room);
  }

  ngOnInit() {

    this.getRoomInsights(this.room);
    this.auth.profile().subscribe(user => {
			this.user = user;
		}, (err) => {
			console.error(err);
		});
  }

	httpOptions = {
		headers: new HttpHeaders({ 'Content-Type': 'application/json' })
	};
  getRoomInsights(roomID) {
    console.log(roomID);
    this.http.post('/api/getURL',
      JSON.stringify({
        "roomID": roomID,
      }), this.httpOptions)
      .subscribe((res) => {
        console.log((<any>res).InsightsWidgetUrl);
        this.insightUrl = (<any>res).InsightsWidgetUrl;
        console.log((<any>res).PlayerWidgetUrl);
        this.playerUrl = (<any>res).PlayerWidgetUrl;

        // this.urls = res;
      }, (err) => {
        console.error(err);
      }
      );
  }

  // getRoomInsights(videoID) {
  //   console.log(videoID);
  //   this.http.post('/api/getURL',
  //     JSON.stringify({
  //       "videoID": videoID,
  //     }), this.httpOptions)
  //     .subscribe((res) => {
  //       console.log((<any>res).InsightsWidgetUrl);
  //       this.insightUrl = (<any>res).InsightsWidgetUrl;
  //       console.log((<any>res).PlayerWidgetUrl);
  //       this.playerUrl = (<any>res).PlayerWidgetUrl;

  //       // this.urls = res;
  //     }, (err) => {
  //       console.error(err);
  //     }
  //     );
  // }
  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
