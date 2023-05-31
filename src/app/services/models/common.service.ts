import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { IApis } from 'src/app/shared/types/apis';
import { environment } from 'src/environments/environment';
import { Hierarchy } from '../types/hierarchy';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { fullHierarchy } from 'src/app/users/models/user-list';
export const HIERARCY_LIST = 'hierarcy_list';


@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private _balanceSub = new ReplaySubject<number>(1);
  balance$ = this._balanceSub.asObservable();


  private _hierarchyMapSub = new ReplaySubject<Map<number, Hierarchy>>(1);
  hierarchyMap$ = this._hierarchyMapSub.asObservable();


  private _hierarchyListSub = new ReplaySubject<Hierarchy[]>(1);
  hierarchyList$ = this._hierarchyListSub.asObservable();


  private _allUsersSub = new ReplaySubject<fullHierarchy>(1);
  _allUsersSub$ = this._allUsersSub.asObservable();
  private baseUrl: string;
  apis: IApis;
  userid: any = 0;
  userlist = [];
  usermainid: any;
  lastuser: any;
  apis$ = new ReplaySubject<IApis>(1);
  private apisUrl = (environment.siteName == 'lc247') ? environment.BDapisUrl : environment.apisUrl;
  private isPremiumSite = environment.isPremiumSite;
  hierarchy:any;
  private isBdlevel = environment.isBdlevel;
  private isRental = environment.isRental;

  vrnlUserType: number;
  whitelabelUserType: number;
  adminUserType: number;
  subAdminUserType: number;
  superMasterUserType: number;
  masterUserType: number;
  agentUserType: number;
  clientUserType: number;

  BdbetHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "whitelabel",
    admin: "admin",
    subadmin: "senior sub admin",
    supermaster: "sub admin",
    master: "super",
    agent: "master",
    client: "user",
  }
  
  sharingHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "mother panel",
    admin: "whitelabel",
    subadmin: "admin",
    supermaster: "sub admin",
    master: "super master",
    agent: "master",
    client: "user",
  }
  defaultHierarchy = {
    vrnladmin: "vrnladmin",
    whitelabel: "whitelabel",
    admin: "admin",
    subadmin: "subadmin",
    supermaster: "supermaster",
    master: "master",
    agent: "agent",
    client: "client",
  }
  constructor(

    private http: HttpClient, private router: Router,
  ) {

    this.apis$.subscribe((res)=>{
      if(!environment.isProduction){
        this.baseUrl =res.devAdminIp;

      }else{
        this.baseUrl = res.adminIp;
      }
    });
    this.lastuser = localStorage.getItem('lastuser')

   }

   
   getApis() {
    return this.http.get(`${this.apisUrl}`);
  }

  updateBalance() {
    this.http
      .get(`${this.baseUrl}/balance`)
      .subscribe((res: any)=> {
        // console.log(res,"respocom");
        if (res && res.errorCode === 0) {
          this._balanceSub.next(res.result[0].balance);
        }
      });
  }

  listHierarchy() {
    this.http
      .get(`${this.baseUrl}/listHierarchy`)
      .subscribe((res: GenericResponse<Hierarchy[][]>) => {
        if (res && res.errorCode === 0) {
          if (this.isPremiumSite && !this.isBdlevel && !this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.BdbetHierarchy[level.name]
            })
          } else if (this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })
          } else if (!this.isPremiumSite && this.isBdlevel) {
            res.result[0].forEach(level => {
              level.name = this.sharingHierarchy[level.name]
            })
          } else if (this.isPremiumSite && this.isRental) {
            res.result[0].forEach(level => {
              level.name = this.defaultHierarchy[level.name]
            })
          }
          // console.log(res.result[0]);

          this._hierarchyListSub.next(res.result[0]);
        }
      });
  }
  loadfullHierarchy(userid:any=0 ) {
    setTimeout(() => {
      this.http
        .get(`${this.baseUrl}/fullHierarchy?last=${userid}`)
        .subscribe((res: any) => {
          // console.log("loadfullhierarchy",res)
          if (res && res.errorCode === 0) {
            this._allUsersSub.next(res.result);
            this.userlist = res.result;
            console.log(this.userlist,"loadfullhierarchy")
            this.userid = this.userlist[this.userlist.length - 1];
            this.usermainid = this.userid?.userId
            // console.log(this.usermainid)
            localStorage.setItem('lastuser', this.usermainid);

          }
        });
    }, 15000);
  }

  fullHierarchy2(userid: any) {
    return this.http.get(`${this.baseUrl}/fullHierarchy?last=${userid}`);
  }
  get hierarchyMap(): Map<number, Hierarchy> {
    return this.hierarchy;
  }

  listAllHierarchy() {
    this.http
      .get(`${this.baseUrl}/listAllHierarchy`)
      .subscribe((res: GenericResponse<Hierarchy[][]>) => {
        if (res && res.errorCode === 0) {
          let hierarchyMap = new Map<number, Hierarchy>(
            res.result[0].map((x) => [x.id, x] as [number, Hierarchy])
          );

          let heirarchyList = Array.from(hierarchyMap);

          this.vrnlUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'vrnladmin';
          })[0];

          this.whitelabelUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'whitelabel';
          })[0];

          this.adminUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'admin';
          })[0];

          this.subAdminUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'subadmin';
          })[0];

          this.superMasterUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'supermaster';
          })[0];

          this.masterUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'master';
          })[0];

          this.agentUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'agent';
          })[0];

          this.clientUserType = heirarchyList.find(([k, v]) => {
            return v.name === 'client';
          })[0];

          this.hierarchy = hierarchyMap;
          // this.cookieService.set(HIERARCY_LIST, JSON.stringify(hierarchyMap));
          this._hierarchyMapSub.next(hierarchyMap);
        }
      });
  }
  
}
