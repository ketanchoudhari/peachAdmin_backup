import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../users/user-list/sub/password-strength.validator';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { GenericResponse } from '../shared/types/generic-response';
import { CommonService } from '../services/models/common.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  changePassForm?: FormGroup;
  currentUserProfile?: User;
  submitted: boolean = false;
  isChangePassword: boolean = false;
  showDropDown:boolean=false;
  changePassModalOpen: boolean = false;
  IDuser: any;
  Cuser: any;




  constructor(
    private formBuilder: FormBuilder,
    private router:Router,
    private authService:AuthService,
    private commonService: CommonService,
    private usersService: UsersService,

  ){

  }
  ngOnInit(): void { 
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
      { validators: ChangePasswordComponent.confirm }
    );

    this.authService.currentUser$.subscribe((currentUser) => {
      if (!!currentUser) {
        this.Cuser = currentUser;
        this.changePassForm.get('userId').setValue(currentUser.userId);
        this.commonService.apis$.subscribe((res:any) => {
          this.usersService.getUser(currentUser.userId).subscribe((res: GenericResponse<User[]>) => {
              if (res.errorCode === 0) {
                this.currentUserProfile = res.result[0];
              }
            });
        });
      }
    });
    // this.IdUser=this.currentUser.results[0].userId;
    console.log("currentuer",this.authService.currentUser)
    this.IDuser=this.authService.currentUser
  }
  get c() {
    return this.changePassForm.get('confirm');
  }

  static confirm(formGroup: FormGroup) {
    const newpassword = formGroup.get('newpassword');
    const confirm = formGroup.get('confirm');

    return confirm?.dirty
      ? !!newpassword?.value && newpassword.value !== confirm.value
        ? { isNotMatching: true }
        : null
      : null;
  }
  get f() {
    return this.changePassForm;
  }
  changePass() {
    console.log("chagepass button")
    if (this.changePassForm.valid) {
      const { confirm, ...result } = this.changePassForm.value;
      this.authService.changePassword(result).subscribe((res: any) =>{
         console.log("change password api", res);
          if (res.errorCode === 0) {
            // this.toastr.success('Password changed successfully');
            console.log("password changed successfull")
            this.changePassModalOpen = false;
            this.f.controls['newpassword'].reset();
            this.f.controls['password'].reset();
            this.f.controls['confirm'].reset();
            this.router.navigateByUrl('/login');
          } else {
            // this.toastr.error(res.errorDescription);
          }
        });
      }
  }

}
