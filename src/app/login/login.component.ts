import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../shared/models/current-user';
import { TokenService } from '../services/token.service'; 
import * as bcrypt from 'bcryptjs';
import { ISharing } from '../shared/types/sharing';
import { environment } from 'src/environments/environment';
import { GenericResponse } from '../shared/types/generic-response';
import { LoadingService } from '../services/loading.service';
import { Router } from '@angular/router';
import { DomSanitizer, Meta, SafeResourceUrl } from '@angular/platform-browser';
import { finalize } from 'rxjs';
import { CommonService } from '../services/models/common.service';
import { DataShareService } from '../services/data-share.service';
import { UsersService } from '../users/users.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isInTransit!: boolean;
  siteName=environment.siteName;
  errorMsg: any;
  isCaptchaInTransit: boolean;
  userdata: any;

  captchaImg: SafeResourceUrl;

  showCaptcha: boolean = environment.captcha;
  userId: any;






  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private loadingService: LoadingService,
    private router: Router,
    private sanitization: DomSanitizer,
    private meta:Meta,
    private commonService: CommonService,
    private dataShareing : DataShareService,
    private usersService:UsersService





  ){
    let img = "iVBORw0KGgoAAAANSUhEUgAAAKUAAAA3CAYAAABthYqSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAABTOSURBVHhe5d15jDVF1QZw3BVURBQXoggKCi4oKkJExcQ9EpYQNlGjxkDABVRihAgBBY2ionHX4IrsCkqCEPhDBRcWJUQEFBUUFJHNBVCB6a9+xX36q7nMnZk3Yegm75OcVHV3VZ06S52qru6+d42xY66gW2H897//7cLm2muv7e68886ax/v222+v+Zxrccstt3QXXnhh94UvfKF7wxve0G255Zbdk5/85O4xj3lMt+aaa3YPf/jDuw033LB7xSte0R144IHdeeed1/3nP//pbr311i7thrfz6QNeeNeDFcQsuaehv6B8C/J84AMf6F772td2T33qU7tHPepR3f3ud7/uwQ9+cLfpppt2r3nNa7oDDjigu+qqq2r52267raaAV/jRYzAx+7hxxBFHzD3gAQ/Q2RWjhz3sYd3973//mudQ3/rWt7p//vOflNg7ZUCRf/nLX7rPfe5z3Yte9KLuQQ96UKW11lqrb6Ml1x7ykIfU1PVnP/vZ3Yknntj9+9//rjzuuOOO2u7//ve/3kFgSLkXws0331zTG2+8sfva177Wbb311rWegZf2tDXd5yc96Uk1feELX9idf/75tX0DEDjjP/7xj5qPHkrZ8ePzn//8XEmqwCtF2n/kIx/Z53/wgx/00YpTJorddNNNXelPt8kmm9SyHHHttdeu0UE9BmFoURJxxrSJHvrQh3YPfOADa36XXXbpLr300sonEYujxkhDyt1CnwKzwpve9KZe3pa0Qd4ck9NAzDE+UpETOHfQDvxSZvw4/PDD54zikl0x4iwxDGUef/zxdeRySoqSmN722GOPWobzccjUZyT1nF/IYOgRj3hErcNQoovyprxzzjmnOr0Igk+muCHlnoYofvXVV3cveMELqnyRse0fuWZFdnykuW6pwxHjjJm+Dc5yffw48sgja8RYaeI066yzTlXcySefXCMWp5SeddZZ1ZGslRIBYkyp81LkmoihXK63jiqf+qKqtdfvf//7ahSGT+QcUu4Wmc6f85zn1PKZrjMoHZMl7SFyaTPOiIfUcfJ77713bfeGG26oaWakcm38+MhHPlIjRoy+EkRZcRzG+c53vtNHyhNOOKFbf/316zTN+ZQJqat863TT5Jp6bVRqifO+5S1v6a6//vpqnGBIuafxnve8Z56M8upm4KEsWXIcyrT96Ec/uj+Hl/QrX/nKhMNdMFOU8+PHZz/72XslYlAyZYlyZ5xxRp2uy7Qy99WvfnWeQRgzEbOtr0xbTjRMBHUszXW8WidV1npNlLTWYpwh5W7xxz/+sS8rymVgJlK2ekg+Tjs9iB0nUqLHPvax9QYqN1FQzo8fRx111Ny0A9zTpP04zGabbVansNzoWOMddthh85TfOhiDMpCtIGvOT37ykzXiuEN917ve1T396U/vnVOdlhdnTP5973tf969//au/0RhS7ham2US29Mf0LOVUUltB1omWOabjX/ziF93b3/726piut+vvVia8P/rRj1Y+tp1E6XJ+/LjkkkvmjjvuuO7b3/72TPrGN77RHX300d0xxxxTHcLWBnLsOgdR5otf/GJdrJdma2SgbM7SOofIaGHf3uhYiO+55559ZEPy6BnPeEatI8JNHLnWlbdGuuaaa6rDMZzpDS9ptmM4LN7Pe97z5k3hQ8qd/cjrrrtuXrSLk6FMy+iUU06525YWJzv77LP7Mqitj/RBO2BA3mecsnR0btbe2ULgDLmzIySSd/6b3/xmdaIYg3Nk5DKUaPe73/2uKneyTdPffbsJsQnOmRh23XXX7d7//vfX867jk7J4IWCsX/7yl3UjmRHwiSO0TvH4xz+++/Of/9zfkQ4pd/ruxsd15VI2+Tjru9/97jrwIDoI/va3v3Xvfe97+zrTdZE+nXrqqbU8vuXc+FEUVR1Dh2eRIogRmihXBQ3st5mKOFUcgXFaRe+777793eZk5PeNiHqXX35595SnPKUa8bTTTqvnFWmNkWP9anHwwQfXaOlulSHws75q+WsfHwjvaVlbUgTd03In3X333fsyIW2krjYvu+yyWh7fRNikYKCR00BOGwZEdIC22267Sen7yJqyCDgXRS0GSomhFgInMkWKVtPRwjkO8+Mf/3jeI6/S1jyn1A9GyNZN64w5lgZtX770pS91G2ywQTVonCN9yTlOmfpDyg3Wl0984hNruZRPnTiYJ1rZV+WI0Yd8+gWe/mQrqW0Hyds+StlyPH4U4aq2JbOIQBTSRgp5ymFYivvgBz9Yt3XiABbfGbGOPWH5+9//Xtc2aaOk8ywtIuUJB55pP3ynivfOgr/tD5vlRaTahxgEbyT/29/+9m68JbNopeSGP/zhD32/TLetY2b69XSmiew1bRHn/PCHP1zl1Ye0gaIDbf/617+u+i3H40cRai6jaDmghDhD8POf/7x7+ctf3isgyghR/kknndQrWIrwricKKAy0zYDTm8xBqijX9ttd+ROe8IR5/Bk3ec+Ibb+kPt5DyQ22h1KuHUQo+e9+97vz+GUZ0cIgsd2Vuni2UzeiBzdlHuOW4/GDcdzJEX4WMUaiBcXIB+p+6EMfqjcmpbmqkKypKEO67bbbdn/605/qFKYN6yvtlHyvcaPe+bZtBph2Ttedn9Tv+7TffvvVNRj+Marj5F/3utfVGwMI7wHl7j7+8Y/XemjamXOc9WQGD7nxnQYdtfWn78KRHYq//vWv8uNHcYb/H4ozECMBBUVJplrTwq677loVYS2UKalNjzrqqHnTV6JFOb4bb21TfnspzrEQXGM8TjfNO8Z1/M53vrO/2TAAhpSbLPvss08t10ZYdTh0Il0eES7kiKA/nJzTL/REp82/+c1vrmv1kh8/isKWNE6gaAxjPUVZ3up53OMeVxXbGiTH3nf8zW9+U+tMoxhnjtGWAp5xSkbgVMDI8p/61Kfqlk8bJfHmMDn+6U9/2rdBjoHl7l75yldWh0xdeSmnlHIysi4XG220Ud9WqwfEMe2j6ns5Hj/KKFtWxIhR5DOVuXF44xvf2E9XFBGFuBukaC+pTj93DuIYcZbFQKGZyjmjY7jgggu6V7/61b2BbRabRkUv/UCvf/3r69bJhF3FkHJr56UvfWntbxwpES1RksOH93LgxZO0EQfXtiWMvG02KPnxowg+txyniEGVzQj2MoV3H0szvXGSInelIlTrDC1KW/XCqkQEhtIHbVq4WyvlMZvIyCCcBX/nXPPKWLNkqOmQcovueQKUfiaNQ9mvXQ7CQ3tx6Dgnp0x7dAMlP34UoVbpLpRxrPlEHuu0jMQYRd45yvDCqoX+LHCMSXZZwFeE1F/k7XQRhRPixygxiL4wii0ZC3xgQG2oO6TcnFJkS31pImbacn05IBO4qaIH7aStpPTimmVHOR4/GCdRZBYIzoAMQ6GOvUX9rGc9qwrNEJQbhSDTp+0QNxezjI+3dDkRK7w5htRz66c97Wm98lsD5C7YdS/5inCJcupOZBhMbjJYc2oj9SOHFG2xxRaT0otjosL6HY/+ZDBqox0s+nWfcsoq1SKIcRDjmjYPOuig6gAUkAhFeNOEc5SUzxFmsSjGrheWmr7jGIEXETzFoPQYoogyzyAc096cO2X1OULk0NbActd3SNPn9F9bUrTVVlvNrD8NvLbffvu7tScVIdOmgVXS8aOM6OVJ3uAnP/lJ95KXvKQKyhBxBEbiJPLuiBlxMcWWO+9l8+ZURrrXtty5cgQUIyTiOKcPXmQwbXMmThCnZkAYUm7X7Bakz3Gi1oFe/OIXVydaDsi444471nrRRfLpF7rPOGVRUN1EXgoUSXhl7b+5gWhHtnyUa3r72c9+VpUQJ1gIpb1lOQa+1pK/+tWv6p00Xi3FORjV8V577dVvWrfOKM+5YUi5gVOaUtVL/RyjbbbZpvJcDvDbaaedaj26iCOmXWSwkr/kxw/GofilEKP6jDNbMC1xiCjjkEMOqVFKnUybCwHjbO0EeKiHrPnUlb/iiivqBrD2Ufi2jknxXgS2P6jeUrxnXWuxQnL3X2yqG+eJszvn7jsDaCnQk8jaDk5pyDaVtpUrx+MHyyw1TVAiwxDKOm299darijNtlSaqMhDl2g/zzDbRYpZhAO84pbIig/LyeGnDVOhj+7yhjSfnE7Hk0wdkXeVJC/gEYCmnHEpusE8ZJ0xbrVPaVVgu8HNjlLY4ZRslUdor+fGDcWpvl4BiFvAerZVqPcUwIZHK5jJjxkCzgHccI6nyeVZs2vQSxdve9rbeGSncTQXejIcce3Nd/0B9dYGjL9QHvCfZRaHYPS03eCm5bY8ccUrtmcpXBbmbR9rhlNrJNzvPf/7za7mSHz9WZV1n07jdFyQ0BUgde5riFTLRj2EYaDFwDEaHlGVMd8yO7Qm+4x3vqIqlZDzaqSnHO++8c3fxxRfX+iKryAZpZyEMKTf4vohckYcTTke3yLEUlGuffS9Ebg7ptuTHj6LEJY3DcTiIO9pSpRJjTCuS4F6jMm0uFSngLp+8i32m2qyjfL/i94HCQ6TkBMh2D9KH3XbbrU7Z6nKGtCcVMWf1Y0i54cgjj6x1tZV2014o36svBcsb+mjr0lPyrnn73YApx+NHUfySm8iMfeaZZ9Yv8qI8kUI+U4VzH/vYx+rzadGFQZPOQjFg/dmWlJEH0c6Lq9pG2kb4maqlnNQXfV6W5QjaSDsiVqLVYtP3UHKDrS11W+dJPrysUZeDH/7wh9W51c96V/8ca4tTfvrTn659KtfGD8ZZarrxHqKoxQiEDJXqVRmmoOc+97n1E1DRKdGOMyxmILyN3km+PgURIY844oieFx6IM5omKdra0vQnkuAHeLXOpw+LyYX3UHKDrzMjW9pMmlnBR2FLAS/6SltZb2fAhLxUrGzJjx9FmYsP6QJv4vgZvlK8jxTylCdPAX7lIdshcbClpjOOEUNKvcbm5ddMRdrmgAwUJXNM60xfB4p0jM+58IwTpA+gTPIthpQ7r+v5Zl177Qsl0shqC2opaOutb31rLY+yHAhFlxn8JT9+FEVCNS5QphuEnKPkz3zmM1WwOEemLsfO21PzmWmmQ3UpS33ESM5BnIQjWddRlmORxofztl3CK8QJGMzPrHgrqH3ZIe0uhgmvWjZbUCUPg8gNrlur5oOvOCJq+Rh8EB7Qbqr7/scA4YzqpQ3n4uQve9nL+jrlePwoiqrRKtGGMUCe4mxE54VUglNWFEgJyM1GtmO0w8DqamM6amQv0hqspJU3h/F4zl6ftkVH7cch8fBrERbr2YfEJ31OfhZNw3uO4e26Nu5NudMnkVh72bZJ9G2j3f7771/LQvrYQqROWV8tSjl6+oo+8YlP9E5djsePoqh+Co2BWkP5NYhECkorVXpyniK8ha0OilEC57Q/fX7yfLiu6/xSb36iJO22vDjmM5/5zPrzLt7S8RG/X6rwptCxxx5bf61CP2eR7Ro8/EqFiEwuvIeSm7Pqh8jsRww4eNt+CG8O61c4EuED9X3ea12baJvtpThkBlOiLZTz40dRWNWYZBK9+qnOVoMP5mMczpEoRmDTw6te9ap6J8kIbWRQ3/Gk+Woco7UtU4w/55to6x48tMlA8lm34YXCPwoPKdseL0RtGb8WMenXYHJDBsTXv/712m6iZPopn2Mb46b6c889t7vyyivrOwCWOpme9U0fUzfkvE160A8o58cPC34Ky8iWUqiRaSQahRmBFCcfYzGQ756to0xP05EnhmlBOVnol+tznoRoLwtyTulmJnk8KFw/5NOPGIFhnNfGLNIOA8mLgPo3pNygLBgQ+W1KOiAXXpG1pVY3KLqR96MHOe/N99T3BjyIyvpazo0fHEOno1AdZxh3lB7vtYaNkeQZavPNN+++//3vV6HVT4SYjhSM1kaKxnhz3pjmWGkbJULgE6WnH/JxkpRJ+cUoBv/e976X/g0md9Z3KSt6tzLggeQ5WM7nWnusXupGVyFvS7XQp3J+/CiGuEszE1CiNZV/JsijtVLsbg7CyD4T9dlmQOkEj7KhccA6PboelHNz+T0dirVOw0/7eLXRwnV9aI/jpMuhtOuRIacYUm7HQZzWDc20A7byW1u2jxJFzDhjtpRQlhm2suyF6gcKyrXxg2NQWJQqYvje2NZLuVwNwTAU1EYo6xzrIfVEGGmmQaD4NkpMw7RV6szlPcC0S9FZuMtzCH1ACzmiczHOLNL/1BOVJrIOJje0joI/WP8ZmFkrRt4sbVAbRdt86iB9zC5FYPqGcn38YBxKjLIoiEB+AsUIjMGlDJOo4YMsT1Si0OWgLTv5CZXqlBRL+StFWU9ysNNPP71O0XgPJfcsGBR2GDIoRcPwRa0TovSxjZQc+6KLLqrtZa2Lv8EDpcz4UTrcf9Wn416m9Zw0kQFRTASX9+G7t7BzV7mUgUSFlGnL4r3DDjv0fFaKMu1zTltJk/4MJvc0JsuJyVHX/ehHP+o/b0jfFyKDLFP+xhtv3H35y1+uW0WQiJ31a1DKjh+Mo7OEyFqHMu2nmdJcdmzUZeRRIOEJrY7ry4Xy2p0YdXGr3kNonQ9//R9S7lnQfni5U7eBf+ihh9Z3Rf1pVSKogWOK9ra5l5+zzRWYqtO3nI+q77L6yFE6Xe0TA0AroGsJ/YHrqDXYqiBtFiPVN3UYGv+VovBsMaTcLdxcpY9B2w8OhjJwgml5QJm2bht9k5+YfdwoglTjBJTGUSJga1SGMNrRqmIhg8xjvIIgB8fHDun/kHJPAy9rW7wBvzZqtsggQnFA/eLcOVYm/U+aPkzMPm4UQaplsrEbwYBCCUWgrFVaRHlLKR20GyeQp8jSZu8Vzq0ULYRyfjC5WyzUfgt12jamEadbCBy9bV9/J2YfN4qw86SlcJ2nPPmMXnBMSNdnKWkhaIsRp+vg7RxaSTAcHvotGpKjMm5wb8q9EJTBQ50MEPyWgnqRD/TbR3Ppf+u0lgETs48bRZj+DewI1iJCR3AKkyc0igKXA/VaRePdKm2lsFAf8R5K7mm4NksPq8JnumzabM9PzD5uMM6kv/c6VlfeQ2Ji9nFjdXWMIXkPiYnZx43V1TGG5D0kJmYfN1ZXxxiS95CYmH3cWF0dY0jeQ2Ji9nFjdXWMIXkPiYnZx43V1TGG5D0k1lhjjTX+D4kEc2/SqrUjAAAAAElFTkSuQmCC";
    this.captchaImg = this.sanitization.bypassSecurityTrustResourceUrl(
      'data:image/jpeg;base64,' + img
    );
    // meta.addTag()
    this.meta.updateTag({ name:'viewport',content:'width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no'});
  }
  ngOnInit():void{
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      captcha: ['0000', Validators.required],
      log: ['0000', Validators.required],
      origin:"skyexch.live"
    });
    
  }

  serverError: boolean = false;


  login(){
    console.log(this.showCaptcha,"showcaptcha");
    
    if (!this.showCaptcha) {
      this.loginForm.controls['captcha'].setValue('0000');
      this.loginForm.controls['log'].setValue('0000');
    }
    if (this.loginForm.valid) {
       console.log(this.loginForm.value,"login");
      if (!this.isInTransit) {
        this.isInTransit = true;
        if (!this.showCaptcha) {
          var body = { ...this.loginForm.value, origin: environment.origin };
        } else {
          var body = this.loginForm.value;
        }
        this.authService
          .login(body)
          .pipe(
            // delay(0),
            // finalize(() => (this.isInTransit = false))
          )
          .subscribe((res: any) => {
            this.userId=res.result[0].userId
            this.dataShareing.IDuser(this.userId)
            console.log(this.userId)
            if (res.errorCode === 0 && res.errorDescription==null) {
              // this.loadingService.setLoading(true);
              const salt = bcrypt.genSaltSync(10);
              let pass = bcrypt.hashSync(this.loginForm.value.password, salt);
              // console.log(pass, 'hashed password');
              localStorage.setItem('password', pass);
              this.tokenService.set(res.result[0].token);
              this.authService.setCurrentUser(res.result[0]);
              this.authService.setLoggedIn(true);
              let sharing: ISharing = {
                cricketFancySharing: res.result[0].cricketFancySharing,
                cricketSharing: res.result[0].cricketSharing,
                dogRaceSharing: res.result[0].dogRaceSharing,
                horseRaceSharing: res.result[0].horseRaceSharing,
                indianCasinoSharing: res.result[0].indianCasinoSharing,
                intCasinoSharing: res.result[0].intCasinoSharing,
                soccerGoalsSharing: res.result[0].soccerGoalsSharing,
                soccerSharing: res.result[0].soccerSharing,
                tennisSharing: res.result[0].tennisSharing,
              };
              this.usersService.setSharing(sharing);
              this.commonService.listHierarchy();
              this.commonService.loadfullHierarchy(this.userId);
              this.commonService.listAllHierarchy();
              this.commonService.updateBalance();
              setTimeout(() => {
                this.router.navigate(['/active-user']);
                // this.router.navigate([`/account`]);
                this.loadingService.setLoading(false);
              },
              (this.siteName == 'skyexch') ? 1000 : 0);
            } else {
              this.serverError = true;
              this.errorMsg = res.errorDescription;
              this.getCaptcha();
            }
             console.log(res,"rsponese");
          });
      }
    }else {
      //  console.log(this.loginForm);
      if (this.userName?.errors && this.userName.errors?.['required']) {
        this.errorMsg = 'Username is empty';
      } else if (this.password?.errors && this.password.errors?.['required']) {
        this.errorMsg = 'Password is empty';
      } 
      // this.errorMsg = this.loginForm.getError();
    }
  }

  getCaptcha() {
    if (!this.isCaptchaInTransit && this.showCaptcha) {
      this.isCaptchaInTransit = true;
      this.authService
        .getCaptcha()
        .pipe(
          // delay(300),
          finalize(() => (this.isCaptchaInTransit = false))
        )
        // .subscribe((res: { img: string; log: number }) => {
        //   this.captchaImg = this.sanitization.bypassSecurityTrustResourceUrl(
        //     'data:image/jpeg;base64,' + res.img
        //   );
        //   this.loginForm.get('log').setValue(res.log);
        // });
    }
  }
  get userName() {
    return this.loginForm.get('userName');
  }

  get password() {
    return this.loginForm.get('password');
  }




}
