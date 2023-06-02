
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Hierarchy } from '../shared/types/hierarchy';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CurrentUser } from '../services/types/current-user';
import { ShareUserService } from '../services/share-user.service';
import { User } from '../users/models/user.model';
import { CommonService } from '../services/models/common.service';
import { UsersService } from '../users/users.service';
import { ISharing } from '../shared/types/sharing';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IUserList } from '../users/models/user-list';
import { LoadingService } from '../services/loading.service';
import { UserSearchService } from '../services/user-search.service';
import { CreateUser } from '../users/models/create-user.model';
import { finalize } from 'rxjs/internal/operators/finalize';
import { GenericResponse } from '../shared/types/generic-response';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { share } from 'rxjs/internal/operators/share';
import { PasswordStrengthValidator } from '../users/user-list/sub/password-strength.validator';
import { combineLatest } from 'rxjs';
// import { Hierarchy } from '../services/types/hierarchy';
// import { OnInit } from '@angular/core';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.css']
})
export class AddaccountComponent  {
  addMemberModalOpen: boolean = false;
  confirmDeleteModalOpen: boolean = false;
  creditRefModalOpen: boolean = false;
  changeStatusOpen: boolean = false;
  showAddMemberButton: boolean = true;
  isDifferentSharingOpen: boolean = false;
  isRegInTransit: boolean;
  isSearchPage: boolean = false;
  isInTransit: boolean;

  currentUser?: CurrentUser;
  userType?: number = 0;

  selectedUid: number = 0;
  selectedUser?: User;
  showisPrepaid: boolean = false;
  statusUser?: User;
  selectedStatus: 0 | 1 | 2;

  userRegForm: FormGroup;
  statusForm: FormGroup;
  userRegDefaultValues = {};

  userOriginList: IUserList;
  userList: IUserList;
  columns = [];
  isprepaidOpen: boolean = false;

  creditRefForm: FormGroup;
  creditRefUser: User;

  p: number = 1;

  memberMap: Map<number, Hierarchy>;

  currencyMap = [
    { id: 0, name: 'INR' },
    { id: 1, name: 'USD' },
    { id: 2, name: 'HKD' },
    { id: 3, name: 'PTS' },
    { id: 4, name: 'PBU' }
  ];

  selectedCurrency = this.currencyMap[0];

  member: Hierarchy;
  isClient: boolean = false;
  isWhitelabel: boolean = false;
  clientUserType: number;
  showDomainCheckbox: boolean = true;
  showCurrencyDropdown: boolean = false;

  minMaxSharing: number = 0;
  sharingMap: ISharing;

  showDomainInput: boolean=true;
  users$: Observable<any>;
  showDeleteButton: boolean;
  totalRow: any;
  showCurrency = environment?.showCurrency;
  isRollingCommChecked: any;
  
  constructor(
    private route: ActivatedRoute,
    private authService:AuthService,
    private loadingService: LoadingService,
    private shareUserService: ShareUserService,
    public commonService: CommonService,
    private usersService: UsersService,
    private userSearch: UserSearchService,
    private formBuilder: FormBuilder,
  ){

  }


  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    // console.log(this.currentUser);
    
    this.selectedUid = 0;
    this.userType = 0;
    this.initUserRegForm();

    this.addDefaultSharing();
    this.addRollingCommission();
    this.addAgentRollingCommission();


    this.addDefaultSharing();
    this.addRollingCommission();
    this.addAgentRollingCommission();

    this.userRegDefaultValues = this.userRegForm.value;

    this.statusForm = this.formBuilder.group({
      password: [, Validators.required],
    });




    this.creditRefForm = this.formBuilder.group({
      password: [, Validators.required],
      users: this.formBuilder.array([
        this.formBuilder.group({
          userId: [, Validators.required],
          txnType: [3],
          amount: [, Validators.required],
        }),
      ]),
    });
    combineLatest([
      this.route.params,
      this.commonService.hierarchyMap$,
    ]).subscribe(([params]) => {
      this.userType = +params['userType'];
      this.selectedUid = +params['selectedUid'];
      console.log(this.userType,this.commonService.whitelabelUserType);
      
      if (!!this.memberMap) {
        this.member = this.memberMap?.get(this.userType);
      }
      if (!!this.member) {
        this.isClient = this.member.name === 'client';
        this.isWhitelabel = this.member.name === 'whitelabel';
      }
      if (!this.selectedUid) {
        this.selectedUid = this.currentUser.userId;
      }

      if(this.currentUser?.prepaid){
        this.isprepaidOpen = true;
      }else{
        this.isprepaidOpen = false;
      }

      if(this.currentUser?.captcha){
        this.Allowedcaptcha = true;
      }else{
        this.Allowedcaptcha = false;
      }

      if (this.isWhitelabel) {
        this.userRegForm?.get('domain').setValidators([Validators.required]);
      } else {
        this.userRegForm?.get('domain').setErrors(null);
        this.userRegForm?.get('domain').clearValidators();
      }

      if (this.isClient) {
        // this.userRegForm?.get('sharePercent').setValidators([])
        if (this.userRegForm?.get('sharePercent')) {
          this.userRegForm?.get('sharePercent').setValue(0);
        }
      }

      if (
        (this.currentUser?.userType == this.commonService.vrnlUserType ||
          (this.currentUser?.userType ==
            this.commonService.whitelabelUserType &&
            this.currentUser.domainAllocation)) &&
        this.userType < this.commonService.subAdminUserType
      ) {
        this.showDomainCheckbox = true;
      } else {
        this.showDomainCheckbox = true;
      }

      if (
        this.currentUser?.userType == this.commonService.vrnlUserType ||
        (this.currentUser?.domainAllocation &&
          this.userType <= this.commonService.subAdminUserType)
      ) {
        this.showDomainInput = true;
      } else {
        this.showDomainInput = true;
      }

      if (
        this.currentUser.userType == this.commonService.vrnlUserType &&
        this.userType == this.commonService.whitelabelUserType
      ) {
        this.showCurrencyDropdown = true;
      } else {
        this.showCurrencyDropdown = false;
      }

      if (
        this.currentUser.userType == this.commonService.vrnlUserType ||
        this.currentUser?.userType == this.commonService.whitelabelUserType
      ) {
        this.showDeleteButton = true;
      } else {
        this.showDeleteButton = false;
      }

      if (
        this.userType == this.commonService.whitelabelUserType
      ) {
        this.showisPrepaid = true;
      } else {
        this.showisPrepaid = false;
      }

      if (this.selectedUid === this.currentUser.userId) {
        this.listUsers(this.currentUser.userId, this.userType);
        if (this.userType == this.commonService.whitelabelUserType) {
          this.addBetstakesettings();
        }
      } else {
        this.listUsers(this.selectedUid);
      }
    });

    this.commonService.hierarchyMap$.subscribe((list) => {
      if (!!list) {
        this.memberMap = list;
        this.member = this.memberMap.get(this.userType);

        this.clientUserType = this.commonService.clientUserType;

        if (!!this.memberMap) {
          this.member = this.memberMap.get(this.userType);
        }
        if (!!this.member) {
          this.isClient = this.member.name === 'client';
          this.isWhitelabel = this.member.name === 'whitelabel';
        }

        if (this.isWhitelabel) {
          this.userRegForm?.get('domain').setValidators([Validators.required]);
        } else {
          this.userRegForm?.get('domain').setErrors(null);
          this.userRegForm?.get('domain').clearValidators();
        }
        if (this.isClient) {
          // this.userRegForm?.get('sharePercent').setValidators([])
          if (this.userRegForm?.get('sharePercent')) {
            this.userRegForm?.get('sharePercent').setValue(0);
          }
        }
      }
    });

    this.userSearch.searchTerm$.subscribe((term) => {
      if (this.userOriginList) {
        if (term !== '') {
          this.userList.users = this.userOriginList.users.filter((e) => {
            return e.userName.toLowerCase().includes(term.toLowerCase());
          });
        } else {
          this.userList.users = this.userOriginList.users;
        }
      }
    });

    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
      this.minMaxSharing =
        100 - Math.max(...(<number[]>Object.values(sharing)));
      if (this.userRegForm && this.userRegForm.get('sharePercent')) {
        this.userRegForm.get('sharePercent').setValue(0);
        this.userRegForm
          .get('sharePercent')
          .setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(this.minMaxSharing),
          ]);
        this.userRegForm.updateValueAndValidity();
      }
    });

    // this.activeTheme = this.themeService.getActiveTheme();
  }
  register() {
    console.log("add account");
    if (this.userRegForm.valid) {
      let user = <CreateUser>this.userRegForm.value;
      user.userType = this.userType;
      if(this.userRegForm.value.currency !== ""){
        user.currencyCode = this.userRegForm.value.currency.name;
        user.currencyId = this.userRegForm.value.currency.id;
      }else{
        user.currencyCode="INR";
        user.currencyId=0;
      }
      user.stakeSetting = this.stakeformatted();
      user.captcha = this.Allowedcaptcha ? 1 : 0;
      user.prepaid = this.isprepaidOpen ? 1 : 0;
      user.allowDomainAllocation = user.allowDomainAllocation ? 1 : 0;
      user.allowRollingCommission = user.allowRollingCommission ? 1 : 0;
      if (!this.isDifferentSharingOpen) {
        // user.sharePercent = (user.sharePercent?user.sharePercent: 0) + (this.minMaxSharing);

        user.cricketSharing =
          user.sharePercent + this.sharingMap.cricketSharing;

        user.cricketFancySharing =
          user.sharePercent + this.sharingMap.cricketFancySharing;

        user.dogRaceSharing =
          user.sharePercent + this.sharingMap.dogRaceSharing;

        user.horseRaceSharing =
          user.sharePercent + this.sharingMap.horseRaceSharing;

        user.indianCasinoSharing =
          user.sharePercent + this.sharingMap.indianCasinoSharing;

        user.intCasinoSharing =
          user.sharePercent + this.sharingMap.intCasinoSharing;

        user.soccerSharing = user.sharePercent + this.sharingMap.soccerSharing;

        user.soccerGoalsSharing =
          user.sharePercent + this.sharingMap.soccerGoalsSharing;

        user.tennisSharing = user.sharePercent + this.sharingMap.tennisSharing;

        delete user.sharePercent;
      } else {
        user.cricketSharing =
          (user.cricketSharing ? user.cricketSharing : 0) +
          this.sharingMap.cricketSharing;

        user.cricketFancySharing =
          (user.cricketFancySharing ? user.cricketFancySharing : 0) +
          this.sharingMap.cricketFancySharing;

        user.dogRaceSharing =
          (user.dogRaceSharing ? user.dogRaceSharing : 0) +
          this.sharingMap.dogRaceSharing;

        user.horseRaceSharing =
          (user.horseRaceSharing ? user.horseRaceSharing : 0) +
          this.sharingMap.horseRaceSharing;

        user.indianCasinoSharing =
          (user.indianCasinoSharing ? user.indianCasinoSharing : 0) +
          this.sharingMap.indianCasinoSharing;

        user.intCasinoSharing =
          (user.intCasinoSharing ? user.intCasinoSharing : 0) +
          this.sharingMap.intCasinoSharing;

        user.soccerSharing =
          (user.soccerSharing ? user.soccerSharing : 0) +
          this.sharingMap.soccerSharing;

        user.soccerGoalsSharing =
          (user.soccerGoalsSharing ? user.soccerGoalsSharing : 0) +
          this.sharingMap.soccerGoalsSharing;

        user.tennisSharing =
          (user.tennisSharing ? user.tennisSharing : 0) +
          this.sharingMap.tennisSharing;
      }
      if (!this.isRegInTransit) {
        this.isRegInTransit = true;
        console.log(user);
        
        this.usersService
          .registration(user)
          .pipe(finalize(() => (this.isRegInTransit = false)))
          .subscribe((res: GenericResponse<any>) => {
            if (res && res.errorCode === 0) {
              this.addMemberModalOpen = false;
              // this.toastr.success('User Created');
              this.listUsers(this.selectedUid, this.userType);
              this.commonService.updateBalance();
              this.userRegForm.reset(this.userRegDefaultValues);
            } else {
              this.addMemberModalOpen = false;
              // this.toastr.error(res.errorDescription);
            }
          });
      }
    } else {
      // this.toastr.error('Invalid Input');
    }
  }

  showSharing(bool){
    this.isprepaidOpen = bool.checked;
  }

  addBetstakesettings(){
    this.userRegForm.addControl('stake1',this.formBuilder.control("5"));
    this.userRegForm.addControl('stake2',this.formBuilder.control("10"));
    this.userRegForm.addControl('stake3',this.formBuilder.control("50"));
    this.userRegForm.addControl('stake4',this.formBuilder.control("100"));
    this.userRegForm.addControl('stake5',this.formBuilder.control("500"));
    this.userRegForm.addControl('stake6',this.formBuilder.control("1000"));
    this.userRegForm.addControl('stake7',this.formBuilder.control("5000"));
    this.userRegForm.addControl('stake8',this.formBuilder.control("10000"));
    this.userRegForm.addControl('stake9',this.formBuilder.control("50000"));
    this.userRegForm.addControl('stake10',this.formBuilder.control("100000"));
  }


  toggleAllowRollingComm(isRollingComm) {
    this.isRollingCommChecked = isRollingComm.value;
  }

  listUsers(selectedUid: number, userType?) {
    if (this.userType == this.commonService.whitelabelUserType) {
      this.addBetstakesettings();
    }
    let user = {
      downlineBalance: 0,
      exposure: 0,
      availableBalance: 0,
      playerBalance: 0,
      refPL: 0,
    };
    this.route.queryParams.subscribe((params) => {
      if (params['user'] != 'search') {
        this.isSearchPage = false;
        this.loadingService.setLoading(true);
        if (!this.isInTransit) {
          this.isInTransit = true;
          this.usersService
            .listUser(selectedUid, userType)
            .pipe(finalize(() => (this.isInTransit = false)))
            .subscribe((res: GenericResponse<IUserList[]>) => {
              if (res.errorCode === 0) {
                res.result[0].users = res.result[0].users.reverse();
                this.userOriginList = res.result[0];
                this.userList = Object.assign({}, this.userOriginList);
                this.totalRow = this.userList.users.reduce((acc, c) => {
                  acc.downlineBalance += c.downlineBalance;
                  acc.exposure += c.exposure;
                  acc.availableBalance += c.availableBalance;
                  acc.playerBalance += c.playerBalance;
                  acc.refPL += c.refPL;
                  return acc;
                }, user);
              }
              this.loadingService.setLoading(false);
            });
        }
      } else {
        this.isSearchPage = true;
        this.users$ = this.userSearch.searchTerm$.pipe(
          debounceTime(500),
          distinctUntilChanged(),
          switchMap((term: string) => this.userSearch.searchUserApi(term)),
          share()
        );

        this.users$.subscribe((res) => {
          // console.log(res);
          this.userList = Object.assign({}, res.result[0]);
          console.log(this.userList, 'response of search user api');
        });
      }
    });
  }


  showstakesetting:boolean = false;
  showstakevalues(bool){
    this.showstakesetting=bool.checked;
  }


  initUserRegForm() {
    this.userRegForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          PasswordStrengthValidator,
        ]),
      ],
      currency: [{value: "", disabled: false}],
      domain: [''],
      fullName: [''],
      creditRef: [0],
      allowDomainAllocation: [0],
      prepaid: [0],
      showstake:[0],
      captcha:[true],
      allowRollingCommission: [0],
      parentId: [this.currentUser.userId]
      // sharePercent: [0, [Validators.required, Validators.max(100)]],
    });
  }

  showDifferentSharing(value: any) {
    let isChecked = value.checked;
    console.log(isChecked);

    this.isDifferentSharingOpen = isChecked;
    if (isChecked) {
      this.addDifferentSharing();
      this.removeDefaultSharing();
    } else {
      this.addDefaultSharing();
      this.removeDifferentSharing();
    }
  }

  isRollingCommission: boolean = false;
  showRollingCommission(bool: any) {
    let isBool = bool.checked;
    this.isRollingCommission = isBool;
    if (isBool) {
      this.addRollingCommission();
    } else {
      this.removeRollingCommission();
    }
  }

  isAgentRollingCommission: boolean = false;
  showAgentRollingCommission(bool: any) {
    let isBool = bool.checked;
    this.isAgentRollingCommission = isBool;
    if (isBool) {
      this.addAgentRollingCommission();
    } else {
      this.removeAgentRollingCommission();
    }
  }

  addDifferentSharing() {
    this.userRegForm.addControl(
      'cricketSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.cricketSharing),
      ])
    );
    this.userRegForm.addControl(
      'cricketFancySharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.cricketFancySharing),
      ])
    );
    this.userRegForm.addControl(
      'soccerSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.soccerSharing),
      ])
    );
    this.userRegForm.addControl(
      'soccerGoalsSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.soccerGoalsSharing),
      ])
    );
    this.userRegForm.addControl(
      'tennisSharing',
      this.formBuilder.control({ value: 0, disabled: true })
    );
    this.userRegForm.addControl(
      'bmCommission',
      this.formBuilder.control({ value: 0, disabled: true })
    );
    // this.regForm.get('bmCommission').setValue(this.sharingMap.bmCommission);
    this.userRegForm.addControl(
      'indianCasinoSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.indianCasinoSharing),
      ])
    );
    this.userRegForm.addControl(
      'horseRaceSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.horseRaceSharing),
      ])
    );
    this.userRegForm.addControl(
      'dogRaceSharing',
      this.formBuilder.control(0, [
        Validators.min(0),
        Validators.max(100 - this.sharingMap.dogRaceSharing),
      ])
    );
    this.userRegForm.updateValueAndValidity();
  }

  get regForm() {
    return this.userRegForm;
  }


  addRollingCommission() {
    let rollingComm = this.formBuilder.group({});
    let currentUserRollingComm = this.currentUser?.rollingCommission;
    rollingComm.addControl(
      'fancy',
      this.formBuilder.control(currentUserRollingComm?.fancy, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'casino',
      this.formBuilder.control(currentUserRollingComm?.casino, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'exchange',
      this.formBuilder.control(currentUserRollingComm?.exchange, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'bookMaker',
      this.formBuilder.control(currentUserRollingComm?.bookMaker, [
        Validators.min(0),
        Validators.max(100),
      ])
    );
    this.userRegForm.addControl('rollingCommission', rollingComm);
  }

  initRollingCommissionVal = {
    fancy: 0,
    casino: 0,
    exchange: 0,
    bookMaker: 0,
  };
  removeRollingCommission() {
    // this.userRegForm.removeControl('rollingCommission');
    this.userRegForm
      .get('rollingCommission')
      .setValue(this.initRollingCommissionVal);
  }

  removeAgentRollingCommission() {
    // this.userRegForm.removeControl('agentRollingCommission');
    this.userRegForm
      .get('agentRollingCommission')
      .setValue(this.initRollingCommissionVal);
  }

  stakeformatted(){
    if(this.userRegForm.value.stake1){
      var stakes = [this.userRegForm.value.stake1,
        this.userRegForm.value.stake2,
        this.userRegForm.value.stake3,
        this.userRegForm.value.stake4,
        this.userRegForm.value.stake5,
        this.userRegForm.value.stake6,
        this.userRegForm.value.stake7,
        this.userRegForm.value.stake8,
        this.userRegForm.value.stake9,
        this.userRegForm.value.stake10]
    }else{
      var stakes =[];
    }
    
    return stakes.toString();
  }


  addAgentRollingCommission() {
    let rollingComm = this.formBuilder.group({});
    let currentUserAgentRollingComm = this.currentUser?.agentRollingCommission;
    rollingComm.addControl(
      'fancy',
      this.formBuilder.control(currentUserAgentRollingComm?.fancy, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'casino',
      this.formBuilder.control(currentUserAgentRollingComm?.casino, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'exchange',
      this.formBuilder.control(currentUserAgentRollingComm?.exchange, [
        Validators.min(0),
        Validators.max(100),
      ])
    );

    rollingComm.addControl(
      'bookMaker',
      this.formBuilder.control(currentUserAgentRollingComm?.bookMaker, [
        Validators.min(0),
        Validators.max(100),
      ])
    );
    this.userRegForm.addControl('agentRollingCommission', rollingComm);
  }

  removeDifferentSharing() {
    this.userRegForm.removeControl('cricketSharing');
    this.userRegForm.removeControl('cricketFancySharing');
    this.userRegForm.removeControl('soccerSharing');
    this.userRegForm.removeControl('soccerGoalsSharing');
    this.userRegForm.removeControl('bmCommission');
    this.userRegForm.removeControl('indianCasinoSharing');
    this.userRegForm.removeControl('horseRaceSharing');
    this.userRegForm.removeControl('dogRaceSharing');
    this.userRegForm.removeControl('tennisSharing');
    this.userRegForm.updateValueAndValidity();
  }


  Allowedcaptcha:boolean = true;
  checkcaptcha(bool){
    this.Allowedcaptcha = bool.value;
  }
  
  addDefaultSharing() {
    this.userRegForm.addControl(
      'sharePercent',
      new FormControl(0, [
        Validators.required,
        Validators.min(0),
        Validators.max(this.minMaxSharing),
      ])
    );
    this.userRegForm.updateValueAndValidity();
  }

  removeDefaultSharing() {
    this.userRegForm.removeControl('sharePercent');
    this.userRegForm.updateValueAndValidity();
  }

  trackBy(index, item: User) {
    return item.userId;
  }
run(){
  console.log("addaccount component")
}
}
