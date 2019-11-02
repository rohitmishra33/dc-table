import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-episode-table',
    templateUrl: './episode-table.component.html',
    styleUrls: ['./episode-table.component.css']
})
export class EpisodeTableComponent implements OnInit {

    private REST_URL = "http://34.69.234.16:3000/";

    episodes = [];
    currentDate = (new Date()).toISOString().split('T')[0];

    constructor(private httpClient: HttpClient) { }

    public getEpisodeList() {
        return this.httpClient.get(this.REST_URL);
    }

    ngOnInit() {
        this.getEpisodeList().subscribe((data: any[]) => {
            this.episodes = data;
            // console.log(data);
        });
    }

}
