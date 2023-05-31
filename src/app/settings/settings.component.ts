import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { User } from '../users/models/user.model';
import { Hierarchy } from '../services/types/hierarchy';
import { CurrentUser } from '../shared/models/current-user';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { IMarket } from '../shared/types/market';
import { IEvent } from '../shared/types/event';
import { UsersService } from '../users/users.service';
import { SettingsService } from './settings.service';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { GenericResponse } from '../shared/types/generic-response';
import { IUserList } from '../users/models/user-list';
import { environment } from 'src/environments/environment';
import { CommonService } from '../services/models/common.service';
import { ShareDataService } from '../services/share-data.service';
import { MmService } from '../management/mm/mm.service';
import { DataFormatService } from '../services/data-format.service';

export class SettingsWise {
  typeWise: string;
  userId: string;
  usersWise: string;
  sport: any;
  sportType: string;
  event: string;
  market: string;
  marketName: string;
  competition: string;

}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild('userWise') userWise: ElementRef;
  hierarchyList = Array<Hierarchy>();
  currentUser: CurrentUser;
  usersListMap: { userType: number; users: User[] } | {} = {};
  siteName = environment.siteName;

  settingForm: FormGroup;

  private _settingsWiseSubject = new BehaviorSubject<SettingsWise>(
    new SettingsWise()
  );
  private settingsWise$ = this._settingsWiseSubject.asObservable();

  showLimitSettings = true;
  showMarketSettings = true;
  showSessionSettings = true;

  showBookSettings: boolean = false;

  eventsList: IEvent[];
  marketList: IMarket[];
  competitionList:IEvent[];
  showSoccerBookSettings: boolean = false;
  showpretab: boolean = false;

  settingFormInitialVal;
  showPremiumSettings = false;
  

  

  sportsEventIds = [
    { name: 'Soccer', id: '1' },
    { name: 'Tennis', id: '2' },
    { name: 'Cricket', id: '4' },
    { name: 'Teenpatti/ X-Games', id: 'casino' },
    { name: 'Horse Racing', id: '7' },
    { name: 'Greyhound Racing', id: '4339' },
  ];

  constructor(
    private authService: AuthService,
    private common:CommonService,
    private usersService:UsersService,
    private settingsService:SettingsService,
    private auth:AuthService,
    private formBuilder:FormBuilder,
    private toastr : ToastrService,
    private MmService: MmService,
    private dataFormatService: DataFormatService,





  )
  {

  }
  ngOnInit(): void {
    this.settingForm = this.formBuilder.group({
      userId: ['0'],
      typeWise: ['default'],
      value: ['0'],
      sportId: ['0'],
      competitionName: ['0'],
    });

    this.addLimitControl();
    this.addSessionControl();
    this.addMarketControl();
    this.addBookmakingControl();

    this.settingFormInitialVal = this.settingForm.value;
    console.log(this.settingForm.value,"this.settingForm.value;");

    this.common.hierarchyList$.subscribe((list) => {
      this.hierarchyList = list;
      console.log(list,"hierarchyList");
    
    });
    this.common.apis$.subscribe((res) => {
    this.usersService
      .listUser(this.auth.currentUser.userId)
      .subscribe((res: GenericResponse<IUserList[]>) => {
        if (res.errorCode === 0) {
          res.result[0].users.forEach((user) => {
            if (user.userType in this.usersListMap) {
              console.log(this.usersListMap,"usertype")
              this.usersListMap[user.userType].push(user);
            } else {
              this.usersListMap[user.userType] = [user];
            }
          });
        }
      });
    });

    let getSettingsData = {
      typeWise: this.settingForm.get('typeWise').value,
      value: this.settingForm.get('value').value,
      userId: this.settingForm.get('userId').value,
      sportId: this.settingForm.get('sportId').value


    };
    this.common.apis$.subscribe((res) => {
      this.usersService
        .listUser(this.auth.currentUser.userId, undefined, 'active')
        .subscribe((res: GenericResponse<IUserList[]>) => {
          if (res.errorCode === 0) {
            res.result[0].users.forEach((user) => {
              if (user.userType in this.usersListMap) {
                this.usersListMap[user.userType].push(user);
              } else {
                this.usersListMap[user.userType] = [user];
              }
            });
          }
        });
      this.getSettings();

      // this.settingsService
      //   .listSetting(getSettingsData)
      //   .subscribe((res: GenericResponse<any>) => {
      //     if (res && res.errorCode === 0) {
      //       if (res.result.length) {
      //         res.result[0] = Object.entries(res.result[0]).reduce(
      //           (acc, [key, value]) => {
      //             if (value && typeof value == 'object') {
      //               value = Object.entries(value).reduce((a, [k, v]) => {
      //                 if (v) {
      //                   a[k] = v;
      //                 }
      //                 return a;
      //               }, {});
      //             }
      //             if (!!value) {
      //               acc[key] = value;
      //             }
      //             return acc;
      //           },
      //           {}
      //         );
      //         this.resetSettingInputs();
      //         this.settingForm.patchValue(res.result[0]);
      //       } else {
      //         this.resetSettingInputs();
      //       }
      //     } else {
      //       this.resetSettingInputs();
      //     }
      //   });

      this.MmService
        .activateListGame()
        .subscribe((res: GenericResponse<IEvent[]>) => {
          if (res.errorCode === 0 && res.result) {
            this.eventsList = res.result;
            this.eventsList = this.eventsList.filter((e) => e.markets);
            this.eventsList.forEach((event) => {
              event.markets.map((market) => {
                market.sportsName = event.sportsName;
              });
            });
            this.competitionList = this.dataFormatService.competitionWise(
              this.eventsList
            );
            // console.log(this.competitionList);

            this.marketList = this.dataFormatService.marketWise(
              this.eventsList
            );
          }
        });

      this.settingsService
        .listTeenpatti()
        // .subscribe((res: GenericResponse<ICasinoTable[]>) => {
        //   if (res.errorCode === 0) {
        //     this.casinoTablesList = res.result;
        //     this.casinoTablesList.forEach((table) => {
        //       let m: ICasinoMarket;
        //       table.markets?.forEach((market) => {
        //         m = {
        //           tableName: table.tableName,
        //           marketName: market.marketName,
        //           gameId: market.gameId,
        //         };
        //         this.casinoMarketsList.push(m);
        //       });
        //     });
        //   }
        // });
    });
    

   
    this.settingsWise$.subscribe((settingsWise) => {
      getSettingsData = {
        typeWise: this.settingForm.get('typeWise').value,
        value: this.settingForm.get('value').value,
        userId: this.settingForm.get('userId').value,
        sportId: this.settingForm.get('sportId').value,
      };
      this.common.apis$.subscribe((res) => {
      this.settingsService
        .listSetting(getSettingsData)
        .subscribe((res: GenericResponse<any>) => {
          if (res && res.errorCode === 0) {
            if (res.result.length) {
              res.result[0] = Object.entries(res.result[0]).reduce(
                (acc, [key, value]) => {
                  if (value && typeof value == 'object') {
                    value = Object.entries(value).reduce((a, [k, v]) => {
                      if (v) {
                        a[k] = v;
                      }
                      return a;
                    }, {});
                  }
                  if (!!value) {
                    acc[key] = value;
                  }
                  return acc;
                },
                {}
              );
              this.resetSettingInputs();
              this.settingForm.patchValue(res.result[0]);
            } else {
              this.resetSettingInputs();
            }
          } else {
            this.resetSettingInputs();
          }
        });
      });

      if(this.siteName == 'cricBuzzer'){
        if (
          settingsWise.sport &&
          settingsWise.sport !== '1' &&
          settingsWise.sport !== '-1' &&
          settingsWise.sportType === 'teenpatti' &&
          settingsWise.sport !== '0'
        ) {
          this.showSessionSettings = false;
          this.showSoccerBookSettings = false;
          this.settingForm.removeControl('sessionSetting');
          this.settingForm.removeControl('soccerBookSettings');
          this.settingForm.updateValueAndValidity();
        } else {
          this.showSessionSettings = true;
          this.showSoccerBookSettings = true;
          this.addSessionControl();
          this.addSoccerBookmakingControl();
          this.settingForm.updateValueAndValidity();
        }
        if (
          settingsWise.sport &&
          settingsWise.sport !== '4' &&
          settingsWise.sport !== '-1' &&
          settingsWise.sportType === 'teenpatti' &&
          settingsWise.sport !== '0'
        ) {
          this.showSessionSettings = false;
          this.showBookSettings = false;
          this.settingForm.removeControl('sessionSetting');
          this.settingForm.removeControl('bookSettings');
          this.settingForm.updateValueAndValidity();
        } else {
          this.showSessionSettings = true;
          this.showBookSettings = true;
          this.addSessionControl();
          this.addBookmakingControl();
          this.settingForm.updateValueAndValidity();
        }
      } else{
        if (
          settingsWise.sport &&
          settingsWise.sport !== '4' &&
          settingsWise.sport !== '-1' &&
          settingsWise.sportType === 'teenpatti' &&
          settingsWise.sport !== '0'
        ) {
          this.showSessionSettings = false;
          this.showBookSettings = false;
          this.settingForm.removeControl('sessionSetting');
          this.settingForm.removeControl('bookSettings');
          this.settingForm.updateValueAndValidity();
        } else {
          this.showSessionSettings = true;
          this.showBookSettings = true;
          this.addSessionControl();
          this.addBookmakingControl();
          this.settingForm.updateValueAndValidity();
        }
      }
      if (this.showpretab) {
        if (this.siteName == 'cricBuzzer' || this.siteName == 'lc247') {
          if (settingsWise.sport === '1' || settingsWise.sport === '2' || settingsWise.sport === '4') {
            this.showPremiumSettings = true;
            this.addPremiumControl();
            this.settingForm.updateValueAndValidity();
          } else {
            this.showPremiumSettings = false;
            this.settingForm.removeControl('premiumSetting');
            this.settingForm.updateValueAndValidity();
          }
        }
      }
      

      if (settingsWise.sport && settingsWise.typeWise === 'market') {
        if (settingsWise.sport !== '-1' && settingsWise.sport !== '-2') {
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .disable();
        } else if (settingsWise.sport === '-1') {
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .disable();
        } else if (settingsWise.sport === '-2') {
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .disable();
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .disable();
        } else {
          this.settingForm
            .get('limitSetting')
            .get('bookmakingCommission')
            .enable();
          this.settingForm
            .get('limitSetting')
            .get('matchOddsCommission')
            .enable();
        }
      } else {
        this.settingForm
          .get('limitSetting')
          .get('bookmakingCommission')
          .enable();
        this.settingForm
          .get('limitSetting')
          .get('matchOddsCommission')
          .enable();
      }

      if (settingsWise.sport == '7' || settingsWise.sport == '4339') {
        this.limitSetting.get('noMinutesBeforeInplay').enable();
      } else {
        this.limitSetting.get('noMinutesBeforeInplay').disable();
      }
    });
    // this.common.apis$.subscribe((res) => {
    // this.eventsService
    //   .activateListGame()
    //   .subscribe((res: GenericResponse<IEvent[]>) => {
    //     if (res.errorCode === 0 && res.result) {
    //       this.eventsList = res.result;
    //       this.eventsList = this.eventsList.filter((e) => e.markets);
    //       this.eventsList.forEach((event) => {
    //         event.markets.map((market) => {
    //           market.sportsName = event.sportsName;
    //         });
    //       });
    //       // this.marketList = this.dataFormatService.marketWise(this.eventsList);
    //     }
    //   });
    // });
    // this.common.apis$.subscribe((res) => {
    // this.teenPattiService
    //   .listTeenpatti()
    //   .subscribe((res: GenericResponse<ICasinoTable[]>) => {
    //     if (res.errorCode === 0) {
    //       this.casinoTablesList = res.result;
    //       this.casinoTablesList.forEach((table) => {
    //         let m: ICasinoMarket;
    //         table.markets?.forEach((market) => {
    //           m = {
    //             tableName: table.tableName,
    //             marketName: market.marketName,
    //             gameId: market.gameId,
    //           };
    //           this.casinoMarketsList.push(m);
    //         });
    //       });
    //     }
    //   });
    // });
  }

getSettings() {
  let getSettingsData:any = {
    typeWise: this.settingForm.get('typeWise').value,
    value: this.settingForm.get('value').value,
    userId: this.settingForm.get('userId').value,
  };
  this.settingsService
    .listSetting(getSettingsData)
    .subscribe((res: GenericResponse<any>) => {
      if (res && res.errorCode === 0) {
        if (res.result.length) {
          res.result[0] = Object.entries(res.result[0]).reduce(
            (acc, [key, value]) => {
              if (!!value) {
                Object.entries(value).reduce((a, [k, v]) => {
                  if (!!v) {
                    a[k] = v;
                  }
                  return a;
                }, {});
              }
              if (!!value) {
                acc[key] = value;
              }
              return acc;
            },
            {}
          );
          this.resetSettingInputs();
          this.settingForm.patchValue(res.result[0]);
        }
        else {
          this.resetSettingInputs();
        }
      }
      else {
        this.resetSettingInputs();
      }
    });
}
addLimitControl() {
  let limitSetting = this.formBuilder.group({
    exposureLimit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    betDelay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    bookmakingCommission: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    matchOddsCommission: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    noMinutesBeforeInplay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
  });
  this.settingForm.addControl('limitSetting', limitSetting);
}
get limitSetting() {
  return this.settingForm.get('limitSetting');
}
get premiumSetting() {
  return this.settingForm.get('premiumSetting');
}

get marketSetting() {
  return this.settingForm.get('marketSetting');
}

get sessionSetting() {
  return this.settingForm.get('sessionSetting');
}

get bookSetting() {
  return this.settingForm.get('bookSetting');
}
addPremiumControl() {
  let premiumFormGroup = this.formBuilder.group({
    betDelay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    minStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxProfit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),

  });
  this.settingForm.addControl('premiumSetting', premiumFormGroup);
}

addSessionControl() {
  let sessionFormGroup = this.formBuilder.group({
    minStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxProfit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxLoss: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    commission: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    perRateMaxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    fancyBonus: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    betDelay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
  });
  this.settingForm.addControl('sessionSetting', sessionFormGroup);
}

addMarketControl() {
  let marketFormGroup = this.formBuilder.group({
    betMinRate: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    betMaxRate: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    minStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxProfit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxLoss: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    volMultiplier: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    marketBeforeInplayLimit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
  });
  this.settingForm.addControl('marketSetting', marketFormGroup);
}

addBookmakingControl() {
  let bookFormGroup = this.formBuilder.group({
    betDelay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    minStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxProfit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxLoss: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    perRateMaxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
  });
  this.settingForm.addControl('bookSettings', bookFormGroup);
}
addSoccerBookmakingControl() {
  let soccerbookFormGroup = this.formBuilder.group({
    betDelay: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    minStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxProfit: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    maxLoss: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
    perRateMaxStake: this.formBuilder.group({
      value: [],
      inherited: [false],
    }),
  });
  this.settingForm.addControl('soccerBookSettings', soccerbookFormGroup);
}



resetSettingInputs() {
  this.settingForm
    .get('limitSetting')
    .reset(this.settingFormInitialVal.limitSetting);
  if (this.settingForm.get('marketSetting')) {
    this.settingForm
      .get('marketSetting')
      .reset(this.settingFormInitialVal.marketSetting);
  }
  if (this.settingForm.get('sessionSetting')) {
    this.settingForm
      .get('sessionSetting')
      .reset(this.settingFormInitialVal.sessionSetting);
  }
  if (this.settingForm.get('bookSettings')) {
    this.settingForm
      .get('bookSettings')
      .reset(this.settingFormInitialVal.bookSettings);
  }
  if (this.settingForm.get('premiumSetting')) {
    this.settingForm
      .get('premiumSetting')
      .reset(this.settingFormInitialVal.premiumSetting);
  }
}

submit() {
  console.log(this.settingForm.value);
  if (this.settingForm.valid) {
    this.settingsService
      .setSetting(this.settingForm.value)
      .subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode === 0) {
          this.toastr.success(res.errorDescription);
          this.getSettings();
          this.toastr.success('Settings Saved');
          // history.back();
        } else {
          this.toastr.error(res.errorDescription);
          this.getSettings();
        }
      });
  } else {
    this.toastr.error('Invalid Input');
  }
}

setUsersWise(event: Event, id?: string) {
  // if (+this.settingForm.get('value').value === 0) {
  this.settingForm.get('userId').setValue(0);
  // }

  (<HTMLInputElement>event.target).value = '';
  this.userWise.nativeElement.value = '';
  if ((<HTMLInputElement>event.target).checked) {
    let elements = <HTMLCollectionOf<HTMLElement>>(
      document.getElementsByClassName('user-wise')
    );
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      element.style.display = 'none';
    }
    if (id) {
      // document.getElementById(id).style.display = 'block';
      document.getElementById(id + 'Input').style.display = 'block';
    }
  }

  this.settingForm.get('userId').setValue(0);
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.usersWise = (<HTMLInputElement>event.target).value;
  settingWise.userId = '0';
  this._settingsWiseSubject.next(settingWise);
}

setTypeWise(typeWise) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.sport = '0';
  settingWise.competition = '0';
  settingWise.event = '0';
  settingWise.market = '0';
  this.settingForm.get('value').setValue('0');
  this.settingForm.get('sportId').setValue('0');
  this.settingForm.get('competitionName').setValue('0');
  settingWise.typeWise = typeWise.value;
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();
  // console.log(settingWise);
}
selectCompetition(competition: string, sport: string) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.competition = competition;
  sport ? (settingWise.sportType = sport) : (settingWise.sportType = '');
  let selectedCompetition = this.competitionList.find(
    (comp) => comp.competitionId == +settingWise.competition
  );

  if (selectedCompetition) {
    // console.log(selectedCompetition);
    settingWise.sport = selectedCompetition.sportId;
    this.settingForm.get('sportId').setValue(selectedCompetition.sportId);
    this.settingForm.get('competitionName').setValue(selectedCompetition.competitionName);
  } else {
    settingWise.sport = null;
  }
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();
}


selectSport(sportId: string, sport: string) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.sport = sportId;
  sport ? (settingWise.sportType = sport) : (settingWise.sportType = '');
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();

}

selectEvent(eventId: string) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.event = eventId;
  console.log(eventId, typeof eventId);
  let event = this.eventsList.find(
    (event) => event.eventId === +settingWise.event
  );
  if (event) {
    settingWise.sport = event.eventTypeId;
  } else {
    settingWise.sport = null;
  }
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();
}

selectMarket(gameId: string, sport: string) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.market = gameId;
  let market = this.marketList.find((market) => market.gameId === +gameId);

  if (market) {
    settingWise.sport = market.eventTypeId;
    console.log(this.marketList,"market")

  } else {
    // settingWise.sport = this.casinoMarketsList.find(
    //   (market) => market.gameId === gameId
    // ).tableName;
    // settingWise.sportType = 'teenpatti';
  }
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();

}

selectUser(userId: string) {
  let settingWise = this._settingsWiseSubject.getValue();
  settingWise.userId = userId;
  this._settingsWiseSubject.next(settingWise);
  this.getSettings();

}
}
