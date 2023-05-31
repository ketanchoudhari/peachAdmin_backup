import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-all-casino',
  templateUrl: './all-casino.component.html',
  styleUrls: ['./all-casino.component.css']
})
export class AllCasinoComponent implements OnInit{
  selecttodate: Date;
  selectfromtime: Date;
  selecttotime: Date;
  constructor(){
    this.selectfromdate = new Date(
      new Date(new Date().setDate(new Date().getDate() - 30)).setHours(9, 0, 0)
    );
    this.selecttodate = new Date(
      new Date(new Date().setDate(new Date().getDate())).setHours(8, 59, 59)
    );
    this.selectfromtime = new Date(new Date().setHours(0, 0, 0));
    this.selecttotime = new Date(new Date().setHours(23, 59, 0));
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  tableLength:boolean=true;
  docButton:boolean=false;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  selectfromdate: Date | undefined;
  myItems = [
    {id: 1, label: 'Option 1'},
    {id: 2, label: 'Option 2'},
    {id: 3, label: 'Option 3'},
    {id: 4, label: 'Option 4'},
    {id: 5, label: 'Option 5'}
  ];
  
  fromDateOptions = {
    dateFormat: 'mm/dd/yyyy',
    minYear: 1900,
    maxYear: 2099,
    firstDayOfWeek: 'su'
  };
  toDateOptions = {
    dateFormat: 'mm/dd/yyyy',
    minYear: 1900,
    maxYear: 2099,
    firstDayOfWeek: 'su'
  };
  
}

