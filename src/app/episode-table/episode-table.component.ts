import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';

@Component({
    selector: 'app-episode-table',
    templateUrl: './episode-table.component.html',
    styleUrls: ['./episode-table.component.css']
})
export class EpisodeTableComponent implements OnInit {

    private REST_URL = "http://34.69.234.16:3000/";

    episodes = [];
    currentDate = moment().format('YYYY-MM-DD');
    isLoaded = false;

    constructor(private httpClient: HttpClient) { }

    public getEpisodeList() {
        return this.httpClient.get(this.REST_URL);
    }

    ngOnInit() {
        this.getEpisodeList().subscribe((data: any[]) => {
            data.forEach((e) => {
                if (e['Original Air Date']) {
                    if (e['Original Air Date'].length > 7) {
                        e['Formatted Date'] = moment(e['Original Air Date']).format('MMMM DD, YYYY');
                    } else {
                        e['Formatted Date'] = moment(e['Original Air Date']).format('MMMM, YYYY');
                    }
                }
            });
            this.episodes = data;
            this.isLoaded = true;

            // console.log(this.episodes);
        });
    }

}
