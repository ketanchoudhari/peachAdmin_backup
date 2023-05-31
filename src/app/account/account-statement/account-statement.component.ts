import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/models/common.service';
import { CurrentUser } from 'src/app/shared/models/current-user';
import { BankingService } from '../banking/banking.service';
import { environment } from 'src/environments/environment';
import { ETransactionType } from 'src/app/shared/types/transactions-type';
import { LoadingService } from 'src/app/services/loading.service';
import { ExportService } from 'src/app/services/export-as.service';
import { GenericResponse } from 'src/app/shared/types/generic-response';
import { IUserLog } from '../models/user-log';
import { ShareDataService } from 'src/app/services/share-data.service';
import * as html2pdf from 'html2pdf.js'

  




@Component({
  selector: 'app-account-statement',
  templateUrl: './account-statement.component.html',
  styleUrls: ['./account-statement.component.css']
})
export class AccountStatementComponent {
  
  currentUser: CurrentUser;
  userLogs: any;
  listCount:number;
  transactionType = ETransactionType;
  p: number = 1;
  n: number = 10;
  timeFormat = environment.timeFormat;
  depositUpline: number;
  depositDownline: number;
  withdrawUpline: number;
  withdrawDownline: number;
  totalDepositDownline : any = 0;
  totalDepositUpline : any = 0;
  totalWithdrawUpline : any = 0;
  totalWithdrawDownline : any = 0;
  Update: any;
  selecttodate: Date;
  selectfromtime: Date;
  selecttotime: Date;
  tableLength:boolean=true;
  docButton:boolean=false;
  fromDate!: Date;
  toDate!: Date ;
  selectfromdate: Date ;

  myItems = [
    {id: 1, label: 'Option 1'},
    {id: 2, label: 'Option 2'},
    {id: 3, label: 'Option 3'},
    {id: 4, label: 'Option 4'},
    {id: 5, label: 'Option 5'}
  ];
  
  
  // fromDateOptions = {
  //   dateFormat: 'mm/dd/yyyy',
  //   minYear: 1900,
  //   maxYear: 2099,
  //   firstDayOfWeek: 'su'
  // };
  // toDateOptions = {
  //   dateFormat: 'mm/dd/yyyy',
  //   minYear: 1900,
  //   maxYear: 2099,
  //   firstDayOfWeek: 'su'
  // };
  constructor(
    private bankingService: BankingService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private commonService: CommonService,
    private exportService: ExportService,
    private shareService: ShareDataService
  ){
    // this.selectfromdate = new Date(
    //   new Date(new Date().setDate(new Date().getDate() - 30)).setHours(9, 0, 0)
    // );
    // this.selecttodate = new Date(
    //   new Date(new Date().setDate(new Date().getDate())).setHours(8, 59, 59)
    // );
    // this.selectfromtime = new Date(new Date().setHours(0, 0, 0));
    // this.selecttotime = new Date(new Date().setHours(23, 59, 0));
  }
  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;

    this.getaccount();

  }
  arraySettlement(text:any) {
    return text.description.includes('settlement'); // Check if any "eating" property is equal to food
  }

  getaccount(){
    this.loadingService.setLoading(true);
    this.commonService.apis$.subscribe((res) => {
      this.bankingService
        .getlog(this.currentUser.userId,this.p,this.n)
        .subscribe((res: GenericResponse<IUserLog[]>) => {
          if (res.errorCode === 0) {
            let Logcount = res.result[0];
            this.listCount = Logcount.count;
            this.userLogs = res.result.slice(1);
            this.totalDepositDownline = 0;
            this.totalDepositUpline = 0;
            this.totalWithdrawUpline = 0;
            this.totalWithdrawDownline = 0;
            this.userLogs.forEach((x:any) => {
              if (!this.arraySettlement(x)) {
              if (x.type == this.transactionType.DEPOSIT_UPLINE) {
                this.totalDepositUpline += x.amount;
              }
              if (x.type == this.transactionType.DEPOSIT_DOWNLINE) {
                this.totalDepositDownline += x.amount;
              }
              if (x.type == this.transactionType.WITHDRAW_UPLINE) {
                this.totalWithdrawUpline += x.amount;
              }
              if (x.type == this.transactionType.WITHDRAW_DOWNLINE) {
                this.totalWithdrawDownline += x.amount;
              }
            }
            if (x.type == this.transactionType.DEPOSIT_UPLINE || x.type == this.transactionType.WITHDRAW_UPLINE) {
              x.from = "Upline";
              x.withUname = "Upline";
            }
            });

            // let depositByUpline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "depositByUpline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);
            // let depositToDownline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "depositToDownline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);

            // let withdrawlByUpline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "withdrawlByUpline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);
            // let withdrawlFromDownline = this.userLogs.reduce((acc, c: any) => {
            //   if (c.type == "withdrawlFromDownline" && c.description != "settlement") {
            //     return (acc += +c.amount);
            //   } else {
            //     return acc;
            //   }
            // }, 0);

            // console.log(depositByUpline, depositToDownline);
            // console.log(withdrawlByUpline, withdrawlFromDownline);

          }
          this.loadingService.setLoading(false);
        });
    });
  }



  selectNoRows(numberOfRows:any) {
    this.p = 1;
    this.n = +numberOfRows.value;
    this.getaccount();
    
  }

  pageChanged(event:any){
    this.p=event;
    this.getaccount();
  }


  udt;
  edata = [];
  exportExcel() {
    this.udt = {
      data: [
        { A: 'Account Statement' }, // title
        {
          A: 'Date/Time',
          B: 'Deposite By Upline',
          C: 'Deposite By Downline',
          D: 'Withdraw By Upline',
          E: 'Withdraw By Downline',
          F: 'Balance',
          G: 'Remark',
          H: 'From/TO'
        }, // table header
      ],
      skipHeader: true,
    };
    this.userLogs.forEach((x) => {
      if (x.type == this.transactionType.DEPOSIT_UPLINE) {
        this.depositUpline = x.amount;
      }
      else {
        this.depositUpline = 0;
      }
      if (x.type == this.transactionType.DEPOSIT_DOWNLINE) {
        this.depositDownline = x.amount;
      }
      else {
        this.depositDownline = 0;
      }
      if (x.type == this.transactionType.WITHDRAW_UPLINE) {
        this.withdrawUpline = x.amount;
      }
      else {
        this.withdrawUpline = 0;
      }
      if (x.type == this.transactionType.WITHDRAW_DOWNLINE) {
        this.withdrawDownline = x.amount;
      }
      else {
        this.withdrawDownline = 0;
      }
      this.udt.data.push({
        A: x.dateTime,
        B: this.depositUpline,
        C: this.depositDownline,
        D: this.withdrawUpline,
        E: this.withdrawDownline,
        F: x.balance,
        G: x.description,
        H: 'From ' + x.from + ' To ' + x.to
      });
    });
    this.udt.data.push({
      A: 'Total',
      B: this.totalDepositUpline,
      C: this.totalDepositDownline,
      D: this.totalWithdrawUpline,
      E: this.totalWithdrawDownline
    });
    this.edata.push(this.udt);
    this.exportService.exportJsonToExcel(this.edata.slice(-1), 'Activity Statement_'+new Date().toDateString());
  }
  exportPdf() {
    var element = document.getElementById('example');
    console.log(this.exportPdf,"exe")
    var opt = {
      margin: 1,
      filename: 'Activity Statement_'+new Date().toDateString(),
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'landscape' }
    };
    html2pdf().from(element).set(opt).save();
  }
}
