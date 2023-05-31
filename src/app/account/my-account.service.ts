import { Injectable } from '@angular/core';
import { IChangePass } from './shared/types/change-pass';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonService } from '../services/models/common.service';

@Injectable({
  providedIn: 'root'
})
export class MyAccountService {

  baseUrl: string;
  constructor(private http: HttpClient,   private router: Router
    , private commonService: CommonService) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminIp;;
      }
    });
  }
  logActivity(page:any,size:any) {
    return this.http.get(`${this.baseUrl}/logActivity?offset=${page}&limit=${size}`);
  }
  
  changePassword(userData: IChangePass) {
    return this.http.post(
      `${this.baseUrl}/updateUser/${userData.userId}`,
      userData
    );
  }
  getUser(userId: number) {
    return this.http.get(`${this.baseUrl}/getUser/${userId}`);
  }
}
