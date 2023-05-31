import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/models/common.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MmService {
  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService,
    private router: Router
  ) {
    commonService.apis$.subscribe((res) => {
     if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }
  listGame() {
    return this.httpClient.get(`${this.baseUrl}/listGames`);
  }
  activateListGame() {
    return this.httpClient.get(`${this.baseUrl}/listActiveGames`);
  }
  getGame(selctedGid: number) {
    return this.httpClient.get(`${this.baseUrl}/listGames/${selctedGid}`);
  }
}
