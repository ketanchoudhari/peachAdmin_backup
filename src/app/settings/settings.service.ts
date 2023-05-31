import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonService } from '../services/models/common.service';
import { environment } from 'src/environments/environment';
import { ISetting } from './types/setting';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private baseUrl: string;
  constructor(
    private httpClient: HttpClient,private commonService: CommonService
  ) {
    commonService.apis$.subscribe((res) => {
      //test--
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl = res.adminIp;;
      }
    });
   }

  setSetting(data: ISetting) {
    return this.httpClient.post(`${this.baseUrl}/setSetting`, data);
  }

  listSetting(data: {typeWise: string, value: string, userId}) {
    return this.httpClient.get(`${this.baseUrl}/listSetting?typeWise=${data.typeWise}&value=${data.value}&userId=${data.userId}`)
  }
  listTeenpatti(selectedUid?: number) {
    if (selectedUid) {
      return this.httpClient.get(
        `${this.baseUrl}/listCasinoTable/${selectedUid}`
      );
    } else {
      return this.httpClient.get(`${this.baseUrl}/listCasinoTable`);
    }
  }
  setdefaultSetting(data : string){
    return this.httpClient.post(`${this.baseUrl}/resetSettings/${data}`,{});
  }

  activeCasino(params) {
    return this.httpClient.post(`${this.baseUrl}/activateCasinoTable`, params);
  }
}
