import { Component } from '@angular/core';

@Component({
  selector: 'app-mm',
  templateUrl: './mm.component.html',
  styleUrls: ['./mm.component.css']
})
export class MmComponent {
  selecttodate: Date;
  selectfromtime: Date;
  selecttotime: Date;
  time = { hour: 13, minute: 30 };   //for time selection
	meridian = true;                //for time selection
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

  tableLength:boolean=true;
  docButton:boolean=false;
  fromDate: Date | undefined;
  toDate: Date | undefined;
  selectfromdate: Date | undefined;
  // myItems = [
  //   {id: 1, label: 'Option 1'},
  //   {id: 2, label: 'Option 2'},
  //   {id: 3, label: 'Option 3'},
  //   {id: 4, label: 'Option 4'},
  //   {id: 5, label: 'Option 5'}
  // ];

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

  toggleMeridian() {
		this.meridian = !this.meridian;
	}

  myItems = [
    {id: 1, label: 'All'},
    {id: 2, label: 'Soccer'},
    {id: 3, label: 'Tennis'},
    {id: 4, label: 'Cricket'},
    {id: 5, label: 'Kabaddi'}
  ];

  subtable:boolean=false;
  isvalid(){
    this.subtable=!this.subtable;
  }
  subsubtable:boolean=false;
  isvalid1(){
this.subsubtable =! this.subsubtable;
  }

  insubtab:boolean=false;
  isvalid3(){
this.insubtab=!this.insubtab;
  }
  insubsubtab:boolean=false;
  isvalid4(){
this.insubsubtab=!this.insubsubtab;
  }

  upsubtable:boolean=false;
  isvalid5(){
this.upsubtable=!this.upsubtable;
  }
  upsubsubtab:boolean=false;
  isvalid6(){
this.upsubsubtab=!this.upsubsubtab;
  }
}
