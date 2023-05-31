import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/models/common.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-account-summery',
  templateUrl: './account-summery.component.html',
  styleUrls: ['./account-summery.component.css']
})
export class AccountSummeryComponent  implements OnInit {
  currentUser: CurrentUser;
  balance: number = 0;
  currencyCode: string;
  fixCurrency = environment?.currency;
  showCurrency=environment?.showCurrency;
  Update: any;
  constructor(
        private authService: AuthService,
    private commonService: CommonService,
    // private shareService: ShareDataService
  ){ }
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.commonService.balance$.subscribe((balance) => {
      console.log(balance,"balace");
      
      this.balance = balance;
    })
  }
}
