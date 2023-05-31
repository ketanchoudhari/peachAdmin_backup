import { Component } from '@angular/core';
import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bet-list',
  templateUrl: './bet-list.component.html',
  styleUrls: ['./bet-list.component.css']
})
export class BetListComponent {
  selectedsSortList:any;  //drop down list
  selecttodate: Date;
  selectfromtime: Date;
  selecttotime: Date;
  selectedTime: NgbTimeStruct; //a
  selectedDate: NgbDateStruct; //a
  time = { hour: 13, minute: 30 };   //for time selection
	meridian = true;                //for time selection
  filteredEventList: any = [];   //temperory variable for pagination
  p: number = 1;  //for pagination
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
    // >>>>>>>>>>>>>>>>>DatePicker FromDate and ToDate
  getFromDateAndTime() {
    return `${this.selectfromdate.getFullYear()}-${
      this.selectfromdate.getMonth() + 1
    }-${this.selectfromdate.getDate()} ${this.selectfromdate.getHours()}:${this.selectfromdate.getMinutes()}:${this.selectfromdate.getSeconds()}`;
  }

  getToDateAndTime() {
    return `${this.selecttodate.getFullYear()}-${
      this.selecttodate.getMonth() + 1
    }-${this.selecttodate.getDate()} ${this.selecttodate.getHours()}:${this.selecttodate.getMinutes()}:${this.selecttodate.getSeconds()}`;
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
  // >>>>>>>>>>>>>>>>>>>>>list of sport DropDown array
  sportFilterList = [
    { id: 1, fillname: 'soccer', name: 'Soccer' },
    { id: 2, fillname: 'tennis', name: 'Tennis' },
    { id: 4, fillname: 'cricket', name: 'Cricket' },
    // { id: 41, name: 'Cricket Exchange' },
    // { id: -2,fillname:'fancy', name: 'Cricket Fancy' },
    // { id: -1012,fillname:'virtual', name: 'Virtual Cricket' },
    { id: 'teenpatti', fillname: 'teenpatti', name: 'Live Casino' },
    { id: 'x', fillname: 'premium', name: 'Premium' },
    // { id: 74, name: 'Races' },
    { id: 7, fillname: 'horseracing', name: 'Horse Racing' },
    { id: 4339, fillname: 'greyhound', name: 'Greyhound Racing' },
    { id: 'x', fillname: 'x-games', name: 'X-Games' },
    { id: 42, fillname: 'kabaddi', name: 'Kabaddi' },
    { id: 43, fillname: 'election', name: 'Election' },
    { id: 43, fillname: 'Basketball', name: 'Basketball' },
    { id: 43, fillname: 'Volleyball', name: 'Volleyball' },
    { id: 43, fillname: 'Snooker', name: 'Snooker' },
    { id: 43, fillname: 'Motor Sport', name: 'Motor Sport' },
    { id: 43, fillname: 'Ice Hockey', name: 'Ice Hockey' },
    { id: 43, fillname: 'Golf', name: 'Golf' },
    { id: 43, fillname: 'Esports', name: 'Esports' },
    { id: 43, fillname: 'Darts', name: 'Darts' },
    { id: 43, fillname: 'Cycling', name: 'Cycling' },
    { id: 43, fillname: 'Boxing', name: 'Boxing' },
    { id: 43, fillname: 'American Football', name: 'American Football' },
    { id: 43, fillname: 'Gaelic Games', name: 'Gaelic Games' },
    { id: 43, fillname: 'Handball', name: 'Handball' },
    { id: 43, fillname: 'Rugby League', name: 'Rugby League' },
    { id: 43, fillname: 'Rugby Union', name: 'Rugby Union' },
    { id: 43, fillname: 'Australian Rules', name: 'Australian Rules' },
    { id: 43, fillname: 'Politics', name: 'Politics' },
    { id: 43, fillname: 'Kabaddi', name: 'Kabaddi' },
    { id: 43, fillname: 'Winter Sports', name: 'Winter Sports' },
    { id: 43, fillname: 'Mixed Martial Arts', name: 'Mixed Martial Arts' },
  ];
 
  toggleMeridian() {
		this.meridian = !this.meridian;
	}
}
