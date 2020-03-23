import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-episode-table',
    templateUrl: './episode-table.component.html',
    styleUrls: ['./episode-table.component.css']
})
export class EpisodeTableComponent implements OnInit {

    private REST_URL = 'http://34.69.234.16:3000/';

    episodes = [];
    currentDate = moment().format('YYYY-MM-DD');
    isLoaded = false;
    cookie = -1;

    constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

    public getEpisodeList() {
        return this.httpClient.get(this.REST_URL);
    }

    public createCookie(index: any) {
        this.cookieService.set('last-watched-episode', index, new Date('2093-04-15'), 'localhost', 'localhost', false, 'Strict');
        this.cookie = parseInt(this.cookieService.get('last-watched-episode'), 10);
        this.setWatchedFlag();
    }

    public setWatchedFlag() {
        let latestEpisodeWatched = -1;
        this.episodes.forEach((episode, index) => {
            if (index <= this.cookie) {
                if (episode['Original Air Date'] && episode['Original Air Date'] < this.currentDate) {
                    episode.Watched = true;
                    latestEpisodeWatched = index;
                }
            } else {
                episode.Watched = false;
            }
        });
        this.cookieService.set('last-watched-episode', latestEpisodeWatched.toString(), new Date('2093-04-15'),
            'localhost', 'localhost', false, 'Strict');
        this.cookie = parseInt(this.cookieService.get('last-watched-episode'), 10);
    }

    ngOnInit() {
        this.cookie = parseInt(this.cookieService.get('last-watched-episode'), 10);
        this.getEpisodeList().subscribe((data: any[]) => {
            data.forEach((e, index) => {
                if (e['Original Air Date']) {
                    if (e['Original Air Date'].length > 7) {
                        e['Formatted Date'] = moment(e['Original Air Date']).format('MMMM DD, YYYY');
                    } else {
                        e['Formatted Date'] = moment(e['Original Air Date']).format('MMMM, YYYY');
                    }
                }
            });

            this.episodes = data;
            this.setWatchedFlag();
            this.isLoaded = true;

            // console.log(this.episodes);
        });
    }

}
