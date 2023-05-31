import { DOCUMENT, TitleCasePipe } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CommonService } from './services/models/common.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { IApis } from './shared/types/apis';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'peach_admin';
  isPremiumSite= environment.isPremiumSite;
  oldAdmin = environment.oldAdmin;
  userdata: any;
  
  // siteName = environment.siteName;

  constructor(
    private commonService: CommonService,
    private auth: AuthService,
    private router: Router,
    private titleService: Title,
    private readonly meta: Meta,
    private titleCase: TitleCasePipe,




    @Inject(DOCUMENT) private document: Document,
  )
  {
    
    // let favicon = this.document.querySelector('#appIcon') as HTMLLinkElement;
    // favicon.href = "/src/assets/images/favicon.ico" + ".ico";
    // this.document.body.classList.add(this.siteName);
    // this.loadStyle('assets/theme/' + this.siteName + '.css');


    this.commonService.getApis().subscribe((res:any) => {

      let devEnv =
        window.location.origin.includes("cricbuzzer") || window.location.origin.includes("localhost1");
      if (devEnv) {
        res.adminIp = res.ssladmin;
      } else {
        res.adminIp = res.adminIp;
        // if (location.protocol === 'https:') {
          res.adminIp = res.ssladmin;
        // }
      }
      // console.log(res);

      this.commonService.apis$.next(res);
    });
    
  }
  ngOnInit() {
    this.commonService.getApis();
    if (this.auth.checkIsLoggedIn()) {
      this.commonService.apis$.subscribe((res) => {
        // console.log(res);
        // this.commonService.loadfullHierarchy();
        this.commonService.listHierarchy();
        this.commonService.listAllHierarchy();
        this.commonService.updateBalance();
        this.commonService.apis = res;
      });
    } else {
      this.router.navigate(['/login']);
    }
    this.auth.isLoggedIn$.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        this.commonService.hierarchyMap$.subscribe((list) => {
          this.titleService.setTitle(
            this.titleCase.transform(
              list.get(this.auth.currentUser.userType).name
            )
          );
        });
      } else {
        this.titleService.setTitle('Admin');
      }
    });
  }
  

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];

    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}

