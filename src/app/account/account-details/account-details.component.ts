import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { ISharing } from 'src/app/shared/types/sharing';
import { MyAccountService } from '../my-account.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/users/users.service';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/services/models/common.service';
import { ShareDataService } from 'src/app/services/share-data.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { User } from 'src/app/users/models/user.model';
import { LoadingService } from 'src/app/services/loading.service';
import { ActivityLog } from '../models/activity-log.model';
import { ExportService } from 'src/app/services/export-as.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-details',
  templateUrl: './account-details.component.html',
  styleUrls: ['./account-details.component.css']
})
export class AccountDetailsComponent {
  timeFormat = environment.timeFormat;

  changePassModalOpen: boolean = false;
  changePassForm: FormGroup;
  currentUser: CurrentUser;
  currentUserProfile?: User;
  isClient: boolean;
  showPassword: boolean = false;
  exposureLimit:any;
  listCount:number;
  p: number = 1;
  n: number = 10;
  sharingMap: ISharing;
  Update: any;
  logList = Array<ActivityLog>();


  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private loadingService: LoadingService,
    private exportService: ExportService,

    private myAccountService: MyAccountService,
    private toastr: ToastrService,
    private router: Router,
    private usersService: UsersService,
    private commonService: CommonService,
    private shareService: ShareDataService
  ){
   
  }
  ngOnInit(): void {
    this.changePassForm = this.formBuilder.group(
      {
        userId: ['', Validators.required],
        newpassword: [
          null,
          Validators.compose([
            Validators.required,
            Validators.minLength(8),
            // PasswordStrengthValidator,
          ]),
        ],
        confirm: [null, Validators.required],
        password: [, Validators.required],
      },
      { validators: AccountDetailsComponent.confirm }
    );
    this.auth.currentUser$.subscribe((currentUser) => {
      if (!!currentUser) {
        this.currentUser = currentUser;
        // this.changePassForm.get('userId').setValue(currentUser.userId);  
        this.commonService.apis$.subscribe((res) => {
          this.usersService
            .getUser(currentUser.userId)
            .subscribe((res:any) => {
              if (res.errorCode === 0) {
                this.currentUserProfile = res.result[0];
              }
            });
        });
      }
    });
    
    this.commonService.hierarchyMap$.subscribe((list:any) => {
      if (!!list && list.get(this.currentUser.userType)) {
        this.isClient = list.get(this.currentUser.userType).name === 'client';
      }
    });
    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
    });
}
get c() {
  return this.changePassForm.get('confirm');
}
static confirm(formGroup: FormGroup) {
  const newpassword = formGroup.get('newpassword');
  const confirm = formGroup.get('confirm');

  return confirm?.dirty
    ? !!newpassword?.value && newpassword?.value !== confirm?.value
      ? { isNotMatching: true }
      : null
    : null;
}
get f() {
  return this.changePassForm;
}
changePass() {
  if (this.changePassForm.valid) {
    const { confirm, ...result } = this.changePassForm.value;
    this.myAccountService
      .changePassword(result)
      .subscribe((res:any) => {
         console.log(res);
        if (res.errorCode === 0) {
          this.toastr.success('Password changed successfully');
          this.changePassModalOpen = false;
          this.f.controls['newpassword'].reset();
          this.f.controls['password'].reset();
          this.f.controls['confirm'].reset();
          // this.router.navigateByUrl('/');
          this.router.navigate(['/login']);
        } else {
          this.toastr.error(res.errorDescription);
        }
      });
  } else {
    if (this.f.errors && this.f.errors['isNotMatching']) {
      this.toastr.error("Passwords don't match");
      return;
    }
    this.toastr.error('Invalid Input');
  }
}

selectNoRows(numberOfRows:any) {
  this.p = 1;
  this.n = +numberOfRows.value;
  this.getloginhistory();
  
}
pageChanged(event:any){
  this.p=event;
  this.getloginhistory();
}
getloginhistory(){
  this.loadingService.setLoading(true);
  this.commonService.apis$.subscribe((res) => {
    this.myAccountService
      .logActivity(this.p,this.n)
      .subscribe((res: any) => {
        if (res.errorCode === 0) {
          let Logcount = res.result[0];
          this.listCount = Logcount.count;
          this.logList = res.result.slice(1);
        }
        this.loadingService.setLoading(false);
      });
  });
}


udt:any;
edata: any;
exportExcel() {
  this.udt = {
    data: [
      { A: 'Activity Log' }, 
      {
        A: 'Login Date & Time',
        B: 'Login Status',
        C: 'IP Address',
        D: 'ISP',
        E: 'City/State/Country',
      }, 
    ],
    skipHeader: true,
  };
  this.logList.forEach((x) => {
    this.udt.data.push({
      A: x.loginTime,
      B: x.loginStatus,
      C: x.loginIp,
      D: x.ISP,
      E: x.origin
    });
  });
  this.edata.push(this.udt);
  this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Activity Log_'+new Date().toDateString());
}
exportCsv() {
  let col = ['loginTime', 'loginStatus', 'loginIp','ISP', 'origin'];
  this.exportService.exportToCsv(this.logList, 'Activity Log_'+new Date().toDateString(), col);
}
exportPdf() {
  var element = document.getElementById('table01');
  var opt = {
    margin: 1,
    filename: 'Activity Log_'+new Date().toDateString(),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
  };
  // html2pdf().from(element).set(opt).save();
}
}


