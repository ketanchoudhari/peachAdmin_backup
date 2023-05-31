import {
  Component,
  ElementRef,
  TemplateRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataShareService } from '../services/data-share.service';

import { UsersService } from '../users/users.service';
import { CommonService } from '../services/models/common.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BankingService } from '../services/banking.service';
import { GenericResponse } from '../shared/types/generic-response';
import { IUserList } from '../users/models/user-list';
import { Subject, Subscription, debounceTime, distinctUntilChanged, finalize } from 'rxjs';
import { CurrentUser } from '../services/types/current-user';
import { AuthService } from '../services/auth.service';
import { User } from '../users/models/user.model';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../users/user-list/sub/password-strength.validator';
import { ActivatedRoute, Route } from '@angular/router';
import { ShareUserService } from '../services/share-user.service';
import { ISharing } from '../shared/types/sharing';
import { UserSearchService } from '../services/user-search.service';




@Component({
  selector: 'app-active-users',
  templateUrl: './active-users.component.html',
  styleUrls: ['./active-users.component.css'],
})
export class ActiveUsersComponent implements OnInit {
  currentUser?: CurrentUser;
  isInTransit: boolean;
  subSink = new Subscription();
  showTotalBox: boolean = false;
  totalBalance: number;
  userList: any = [];
  modalRef!: BsModalRef;
  userid: number;
  result: any;
  user: User;
  statusUser?: User;
  changeStatusOpen: boolean = false;
  @ViewChild('modalDeposit') modalDeposit!: ElementRef;
  @ViewChild('closebutton') closebutton;
  depositShow: boolean = false;
  withdrawShow: boolean = false;
  limitShow: boolean = false;
  creditShow: boolean = false;
  statusShow: boolean = false;
  passwordShow: boolean = false;
  // userActive:boolean=false;
  selectedStatus: 0 | 1 | 2;
  statusForm: FormGroup;
  changePassForm: FormGroup;
  changePassModalOpen: boolean = false;
  transferForm: FormGroup;
  private baseUrl: string;
  trntype: number;
  validRow: number = 0;
  debounceClick;
  searchTerm$ = new Subject<string>();
  searchTerm: string = "";
  submitted: boolean;
  amountInput: number = 0;
  creditRefForm: FormGroup;
  useridnew: string;
  changeShareForm: FormGroup;
  changeExposureLimitForm: FormGroup;
  selectedUid: number = 0;
  currentUserProfile?: User;
  isClient: boolean = true;
  isWhitelabel: boolean = false;
  sharingMap: ISharing;
  searchField: FormControl;
  userType?: number = 0;
  userRegForm: FormGroup;
  selectedUser?: User;
  confirmDeleteModalOpen: boolean = false;
  minMaxSharing: number = 0;
  deleteUserForm: FormGroup;
  userRegDefaultValues = {};
  userName:any;
  subUserName:any=[];
  formsDefaultVal = {};
  titletext: string;
  isChecked:any=this.userList.userStatus;

  // userPassword: any;
  constructor(
    private modalService: BsModalService,
    private bankingService: BankingService,
    private userService: UsersService,
    private commonServices: CommonService,
    private httpClient: HttpClient,
    private auth: AuthService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private shareUserService: ShareUserService,
    private userSearch: UserSearchService,
  ) {
    this.useridnew = localStorage.getItem('user')
  }
  ngOnInit(): void {
 
    setTimeout(() => {
      this.formsDefaultVal = this.transferForm.value;
    });
    this.commonServices.apis$.subscribe((res) => {
      if (!environment.isProduction) {
        this.baseUrl = res.devAdminIp;
      } else {
        this.baseUrl = res.adminReport;
      }
      setTimeout(() => {
        this.userlist(this.userid);
      }, 1000);

    });

    this.userid = this.auth.currentUser.userId;
    this.userName = this.auth.currentUser.userName;
    this.commonServices.listAllHierarchy();

    this.statusForm = this.formBuilder.group({
      password: [, Validators.required],

    });
    this.creditRefForm = this.formBuilder.group({
      password: [, Validators.required],

      userId: [this.useridnew, Validators.required],
      txnType: [3],
      amount: [, Validators.required],

    });
    this.transferForm = this.formBuilder.group({
      password: [, Validators.required],
      userId: [this.useridnew, Validators.required],
      txnType: [1],
      amount: [, Validators.required],
      key: [],
      mainUserId: [this.currentUser.userId],
      remark: []
    });

    this.changePassForm = this.formBuilder.group(
      {
        userId: [, Validators.required],
        newpassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            PasswordStrengthValidator,
          ]),
        ],
        confirm: [null, Validators.required],
        password: [, Validators.required],
      },
      { validators: ActiveUsersComponent.confirm }
    );
    this.changeShareForm = this.formBuilder.group({
      userId: [, Validators.required],
      sharePercent: [],
      cricketSharing: [],
      cricketFancySharing: [],
      soccerSharing: [],
      soccerGoalsSharing: [],
      tennisSharing: [],
      indianCasinoSharing: [],
    });

    this.changeExposureLimitForm = this.formBuilder.group({
      userId: [, Validators.required],
      exposureLimit: [, Validators.required],
      password: [, Validators.required],
    });
    this.selectedUid = this.route.parent.snapshot.params['userid'];
    this.auth.currentUser$.subscribe((currentUser) => {
      if (!!currentUser) {
        this.currentUser = currentUser;
        this.changePassForm.get('userId').setValue(this.useridnew);
        this.changeExposureLimitForm.get('userId').setValue(this.useridnew);
        this.commonServices.apis$.subscribe((res) => {
          // this.listUser(false);
          this.userService
            .getUser(currentUser.userId)
            .subscribe((res: GenericResponse<User[]>) => {
              if (res.errorCode === 0) {
                this.currentUserProfile = res.result[0];
              }
            });

        });
      }
    });

    
    this.selectedUid = this.route.parent.snapshot.params['userid'];
    this.currentUser = this.auth.currentUser;
    this.shareUserService.user$.subscribe((user) => {
      if (!!user) {
        this.user = user;
        // this.changePassForm.get('userId').setValue(user.userId);
        // this.changeExposureLimitForm.get('userId').setValue(this.useridnew);
        this.commonServices.hierarchyMap$.subscribe((list) => {
          this.isClient = list.get(user.userType).name === 'client';
          this.isWhitelabel = list.get(user.userType).name === 'whitelabel';
        });
      }
    });

    this.userService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
    });

    this.currentUser = this.auth.currentUser;
    this.searchField = new FormControl();
    this.searchField.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.userSearch.searchUserApi(term);
      });
    // console.log(this.currentUser);

    this.selectedUid = 0;
    this.userType = 0;
    this.initUserRegForm();

    this.addDefaultSharing();
    this.addRollingCommission();
    this.addAgentRollingCommission();
    this.initDeleteUserForm();

    this.userRegDefaultValues = this.userRegForm.value;

  }

  onInputChange(event: any) {
    this.amountInput = event.target.value;
  }
  public onSave() {
    this.closebutton.nativeElement.click();
  }

  getuserid(u) {
    this.userid = u;
    localStorage.setItem('user', this.userid.toString());
    console.log("", this.userid)

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
      currency: [{ value: "", disabled: false }],
      domain: [''],
      fullName: [''],
      creditRef: [0],
      allowDomainAllocation: [0],
      prepaid: [0],
      allowRollingCommission: [0],
      parentId: [this.currentUser.userId],
      // sharePercent: [0, [Validators.required, Validators.max(100)]],
    });
  }

  confirmDelete(user) {
    this.selectedUser = user;
    this.confirmDeleteModalOpen = true;
    // });
  }
  initDeleteUserForm() {
    this.deleteUserForm = this.formBuilder.group({
      password: ['', Validators.required],
    });
  }


  userlist(userid: number) {

    this.userService.listsUsers(userid).subscribe((res: any) => {
      console.log("real list user", res.result[0])
      this.userList = res.result[0].users;
      this.subUserName=this.userList.userName;
      console.log(this.userList,"subusername")
      this.userList.forEach((element) => {
        element.totalBalance = parseFloat(element.availableBalance + element.downlineBalance).toFixed(2);
      });
      this.userList.forEach((element) => {
        element.refPL = (element.creditRef - element.availableBalance - element.exposure - element.downlineBalance).toFixed(2);
        if (element.refPL !== 0) {
          element.refPL = (element.refPL * -1)
        }
      });
      console.log("new userlist", this.userList.length)

    })
  }
  openChangeStatusModal(user: User) {
    this.statusUser = user;
    this.changeStatusOpen = true;
  }
  selectStatus(event: Event, status: 0 | 1 | 2) {
    if (this.statusUser.userStatus !== status) {
      (<HTMLButtonElement>event.target).classList.add('open');
      this.selectedStatus = status;
      console.log(this.selectedStatus);

    }
  }
  changeStatus() {
    console.log("changeStatus function ", this.selectedStatus)
    if (this.statusForm.valid && this.selectedStatus !== null) {
      let changeStatus = this.statusForm.value;
      console.log("changeStatus", this.statusForm.value)
      changeStatus.userStatus = this.selectedStatus;
      this.userService
        .updateStatus(this.statusUser.userId, changeStatus)
        .subscribe((res: GenericResponse<any>) => {
          console.log("update status resp ", res);
          if (res && res.errorCode === 0) {
            this.changeStatusOpen = false;
            // this.toastr.success('Changed status successfully');
            this.onSave();
            this.userlist(this.statusUser.userId);
            this.selectedStatus = null;
            this.statusForm.reset();
          } else {
            // this.toastr.error(res.errorDescription);
          }
        });
    } else {
      //  console.log(this.statusForm);

      // this.toastr.error('Invalid Input');
    }
  }

  changePass() {
    if (this.changePassForm.invalid) {
      return;
    }
    if (this.changePassForm) {
      const { confirm, ...result } = this.changePassForm.value;
      this.userService
        .changePassword(result)
        .subscribe((res: GenericResponse<any>) => {
          console.log(res);
          if (res?.errorCode === 0) {
            // this.toastr.success('Password changed successfully');
            this.changePassModalOpen = false;
            this.f.controls['newpassword'].reset();
            this.f.controls['password'].reset();
            this.f.controls['confirm'].reset();
            this.onSave();
            // this.router.navigateByUrl('/login');
            // $('#password').modal('hide');
          } else {
            console.log("some error")
            // this.toastr.error(res.errorDescription);
          }
        });
    } else {
      if (this.f.errors && this.f.errors['isNotMatching']) {
        // this.toastr.error("Passwords don't match");
        return;
      }
      // this.toastr.error('Invalid Input');
    }
  }
  static confirm(formGroup: FormGroup) {
    const newpassword = formGroup.get('newpassword');
    const confirm = formGroup.get('confirm');

    return confirm.dirty
      ? !!newpassword.value && newpassword.value !== confirm.value
        ? { isNotMatching: true }
        : null
      : null;
  }

  get f() {
    return this.changePassForm;
  }
  senddeposite() {
    if (this.transferForm.invalid) {
      console.log("senddeposite")
      // this.toastr.error("Invalid Input");
      return;

    }


  }
  transfer() {
    console.log("transfer func")
    let data = {
      password: this.transferForm.value.password,
      
      users: ([{
        userId: this.userid,
        txnType: this.trntype,
        amount: this.transferForm.value.amount,
        key: 0,
        mainUserId: this.currentUser.userId,
        remark: this.transferForm.value.remark

      }]),

    }
console.log("form data ",  this.transferForm.value)
    this.bankingService.transfer(data)
      .subscribe((res: GenericResponse<any>) => {
        if (res && res.errorCode === 0) {

          res.result.forEach((user) => {
            if (user.result === 'SUCCESS') {
              this.userlist(this.userid);

              // this.toastr.success('Transaction Successful');
              this.transferForm.reset();
              this.onSave();
            } else {
              // this.toastr.error(`User: ${user.userName}; ${user.result}`);
            }
          });
          this.commonServices.updateBalance();
          this.validRow = 0;
          this.searchTerm = "";
        } else {
          // this.toastr.error(res.errorDescription);
        }
        this.submitted = false;
      });


  }
  selectTxType(user: User, type, u) {
    setTimeout(() => {
      user.selectDW = type;
      this.userid = u;
      this.trntype = type;
      if (this.trntype == 1) {
        this.titletext = "Deposite"
      }
      else {
        this.titletext = "Withdrwal"
      }
      localStorage.setItem('user', this.userid.toString());
      console.log("", this.userid)
    });
  }
  get usersArrayy() {
    return this.transferForm.get('users') as FormArray;
  }
  timeouttransfer() {
    this.submitted = true;
    setTimeout(() => {
      this.transfer();
    }, 5000);
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
  toggelDeposit() {
    this.depositShow = !this.depositShow;
  }
  userDipo(userName){
    this.subUserName=userName;
  }

  //  openModal() {
  //   const modal = this.modalDeposit.nativeElement;
  //   (modal).modal('show');
  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }
  isCheckboxChecked(userStatus): boolean {
    
    if (userStatus==1) {
      return true;
  }
  return false;
    
  }
}
