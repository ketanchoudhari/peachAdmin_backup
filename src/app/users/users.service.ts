import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ISharing } from '../shared/types/sharing';
import { HttpClient } from '@angular/common/http';
import { CommonService } from '../services/models/common.service';
import { environment } from 'src/environments/environment';
import { IExposureLimit } from './models/change-exposure';
import { IChangePass } from '../account/shared/types/change-pass';
import { ChangeStatus } from './models/change-status';
import { CreateUser } from './models/create-user.model';
import { CurrentUser } from '../shared/models/current-user';
export const SHARING_MAP = 'sharing_map';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl: string;

  private _sharingSub = new BehaviorSubject<any>(null);
  public sharing$ = this._sharingSub.asObservable();

  constructor(
    private httpClient: HttpClient,

    private commonService: CommonService,


  ) {
    commonService.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl =  res.adminReport;;
      }
    });
    let sharing = localStorage.getItem(SHARING_MAP);
    if (sharing) {
      this._sharingSub.next(JSON.parse(sharing));
    }
  }
  deleteUser(uid: number) {
    //  console.log(uid, 'uid service');
      return this.httpClient.get(`${this.baseUrl}/deleteUser/${uid}`);
    }

    listHierarchy() {
      return this.httpClient.get(`${this.baseUrl}/listHierarchy`);
    }

    listUserLog(selctedUid: number) {
      return this.httpClient.get(`${this.baseUrl}/logActivity/${selctedUid}`);
    }

    getUser(selctedUid: number) {
      return this.httpClient.get(`${this.baseUrl}/getUser/${selctedUid}`);
    }

    accountDetails(selctedUid: number) {
      return this.httpClient.get(`${this.baseUrl}/accountDetails/${selctedUid}`);
    }

  
    listUser(selctedUid: number, userType?: number, userStatus?: string) {
      if (userType) {
        return this.httpClient.get(
          `${this.baseUrl}/listUsers/${selctedUid}/${userType}?active=${userStatus}`
        );
      } else {
        return this.httpClient.get(`${this.baseUrl}/listUsers/${selctedUid}?active=${userStatus}`);
      }
    }
    listsUsers(selctedUid: number){
      return this.httpClient.get(
        `${this.baseUrl}/listUsers/${selctedUid}`
      );
    }

    fullHierarchy(){
      return this.httpClient.get(`${this.baseUrl}/fullHierarchy`);
    }
    fullHierarchy2(userid:any){
      return this.httpClient.get(`${this.baseUrl}/fullHierarchy?last=${userid}`);
    }
    userbyBetslist(from:any,to: any){
      return this.httpClient.get(`${this.baseUrl}/listUserWithBets?from=${from}&to=${to}`)
    }

    updateStatus(userId: number, data: ChangeStatus) {
      return this.httpClient.post(`${this.baseUrl}/updateUser/${userId}`, data);
    }

    sendBlockMail(data: any) {
      return this.httpClient.post(`https://sc.cricbuzzer.io:15552/api/sendBlockAccountMail`, data);
    }

    sendSuspendMail(data: any) {
      return this.httpClient.post(`https://sc.cricbuzzer.io:15552/api/sendSuspendAccountMail`, data);
    }

    registration(user: CreateUser) {
      return this.httpClient.post(`${this.baseUrl}/registration`, user);
    }

    logCreditRef(userId: number) {
      return this.httpClient.get(`${this.baseUrl}/logCreditRef/${userId}`);
    }

    changePassword(userData: IChangePass) {
      return this.httpClient.post(
        `${this.baseUrl}/updateUser/${userData.userId}`,
        userData
      );
    }

    changeExposureLimit(userData: IExposureLimit) {
      return this.httpClient.post(
        `${this.baseUrl}/updateUser/${userData.userId}`,
        userData
      );
    }

    updateShare(shareData:any) {
      return this.httpClient.post(
        `${this.baseUrl}/updateUser/${shareData.userId}`,
        shareData
      );
    }

    getlog(ID:CurrentUser): Observable<any> {
      return this.httpClient.get(`${this.baseUrl}/logTransaction/${ID}`);
    }

    logActivity(userId: number) {
      return this.httpClient.get(`${this.baseUrl}/logActivity/${userId}`);
    }

    betHistory(datefrom: string, dateto: string, userId: number) {
      return this.httpClient.get(
        `${this.baseUrl}/betsHistory?from=${datefrom}&to=${dateto}&userId=${userId}`
      );
    }

    profitLoss(datefrom: string, dateto: string, userId: number) {
      return this.httpClient.get(
        `${this.baseUrl}/profitLoss?from=${datefrom}&to=${dateto}&userId=${userId}`
      );
    }

    betreport(datefrom: string, dateto: string, userId: number) {
      return this.httpClient.get(
        `${this.baseUrl}/betsReport?from=${datefrom}&to=${dateto}&userId=${userId}`
      );
    }

    setSharing(sharing: ISharing) {
      this._sharingSub.next(sharing);
      localStorage.setItem(SHARING_MAP, JSON.stringify(sharing));
    }

    allowUnmatchedBet(userId:any, allow:any) {
      if (allow) {
        return this.httpClient.get(`${this.baseUrl}/unmatchedBets/${userId}/1`);
      } else {
        return this.httpClient.get(`${this.baseUrl}/unmatchedBets/${userId}/0`);
      }
    }

    showPassword(userId: number) {
      return this.httpClient.get(`${this.baseUrl}/showPass/${userId}`);
    }

    searchUser(userName: string) {
      return this.httpClient.get(`${this.baseUrl}/searchUser/${userName}`);
    }
    resetlogin(userId: string) {
      return this.httpClient.get(`${this.baseUrl}/resetFailedLogin/${userId}`);
    }
}
