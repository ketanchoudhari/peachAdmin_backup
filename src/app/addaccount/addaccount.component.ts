
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
// import { Hierarchy } from '../services/types/hierarchy';
// import { OnInit } from '@angular/core';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.css']
})
export class AddaccountComponent  {
  constructor(
    private route: ActivatedRoute,
    private auth:AuthService,
    private shareUserService: ShareUserService,
    public commonService: CommonService,
    private usersService: UsersService,
  ){

  }
  member: Hierarchy;
  memberMap: Map<number, Hierarchy>;
  selectedUid: number = 0;  
  currentUser?: CurrentUser;
  user: User;
  isClient: boolean = true;
  isWhitelabel: boolean = false;
  sharingMap: ISharing;
  ngOnInit(): void 
  {
    this.selectedUid = this.route.parent.snapshot.params['selectedUid'];
    this.currentUser = this.auth.currentUser;
    this.shareUserService.user$.subscribe((user) => {
      if (!!user) {
        this.user = user;
        // this.changePassForm.get('userId').setValue(user.userId);
        // this.changeExposureLimitForm.get('userId').setValue(this.useridnew);
        this.commonService.hierarchyMap$.subscribe((list) => {
          this.isClient = list.get(user.userType).name === 'client';
          this.isWhitelabel = list.get(user.userType).name === 'whitelabel';
        });
      }
    });
    this.usersService.sharing$.subscribe((sharing) => {
      this.sharingMap = sharing;
    });
  }
run(){
console.log(this.member,"member name")
}

}
