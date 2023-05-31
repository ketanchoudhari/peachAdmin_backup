import { Component } from '@angular/core';
import { Hierarchy } from '../services/types/hierarchy';
import { CommonService } from '../services/models/common.service';
import { CurrentUser } from '../shared/models/current-user';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  heirarchyList?: Hierarchy[];
  public sidebarShow: boolean = false;

  public isCollapsed = true;
  currentUser: CurrentUser;
  dropdownMenu: any=[];
  balance: number = 0;


  isBalanceLoader = false
  currencyCode: string | undefined;



  constructor(
    // private compIntraction: CompIntractionService,
    private router: Router,
    private authService: AuthService,
    // private toastr: ToastrService,
    public commonService: CommonService,
    private token : TokenService

  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser;
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
      }
    });
    this.commonService.balance$.subscribe((balance) => {
      this.balance = balance;
    });
    this.dropdownMenu = [
      { routingLink: "teenpatti/teenpatti-twenty",gtype:"teen20", tableId: "-11",tableName: "TP2020",},
      { routingLink: "teenpatti/oneday",gtype:"teen", tableId: "-12", tableName: "TP1Day" },
      { routingLink: "teenpatti/tpopen",gtype:"teen8",tableId: "-14", tableName: "TPOpen" },
      { routingLink: "teenpatti/lucky7-a",gtype:"lucky7", tableId: "-10", tableName: "Lucky7A"},
      { routingLink: "teenpatti/lucky7-b",gtype:"lucky7eu", tableId: "-10",  tableName: "Lucky7B"},
      { routingLink: "teenpatti/thirty-two-card-a",gtype:"card32", tableId: "-24",  tableName: "32Cards" },
      { routingLink: "teenpatti/thirty-two-card-b",gtype:"card32eu", tableId: "-25",  tableName: "32CardsB" },
      // { routingLink: "teenpatti/baccarate",gtype:"baccarat", tableId: "-9",  tableName: "Baccarat" },
      { routingLink: "teenpatti/threecardjud",gtype:"3cardj", tableId: "-23",tableName: "3CardsJud" },
      { routingLink: "teenpatti/aaa",gtype:"aaa", tableId: "-26",  tableName: "AAA"},
      { routingLink: "teenpatti/bollywood",gtype:"btable",tableId: "-27",tableName: "Bollywood"},
      { routingLink: "teenpatti/poker2020",gtype:"poker20", tableId: "-20",  tableName: "Poker2020"},
      { routingLink: "teenpatti/poker1day",gtype:"poker",tableId: "-19",  tableName: "Poker1Day" },
      { routingLink: "teenpatti/poker6p",gtype:"poker6", tableId: "-18",   tableName: "Poker6P" },
      { routingLink: "teenpatti/dt2020",gtype:"dt20", tableId: "-6", tableName: "DT2020" },
      { routingLink: "teenpatti/dt1day",gtype:"dt6", tableId: "-7",  tableName: "DT1Day" },
      { routingLink: "teenpatti/dtl2020",gtype:"dtl20", tableId: "-8", tableName: "DTL2020"},
    ];
    this.currentUser = this.authService.currentUser;
    // console.log("user name", this.currentUser.userName)
    this.authService.currentUser$.subscribe((user) => {
      if (user) {
        this.currentUser = user;
        // this.currencyCode = environment.currency
        //   ? this.currentUser?.currencyCode
        //   : environment.currency;
        this.currencyCode = this.currentUser?.currencyCode;
      }
    });
  }
  



 


  // clickme() {
  //   alert("Please Select a user");
  //   return false;
  // }
  logout(){
    this.token.delete();
    this.router.navigateByUrl('/login');
  }
}

