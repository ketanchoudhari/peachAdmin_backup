import { Component } from '@angular/core';

@Component({
  selector: 'app-bet-list-live',
  templateUrl: './bet-list-live.component.html',
  styleUrls: ['./bet-list-live.component.css']
})
export class BetListLiveComponent {
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
  myItems = [
    {id: 1, label: 'Option 1'},
    {id: 2, label: 'Option 2'},
    {id: 3, label: 'Option 3'},
    {id: 4, label: 'Option 4'},
    {id: 5, label: 'Option 5'}
  ];
  sportsItems=[
    {id: 1, label: 'All'},
    {id: 2, label: 'Soccer'},
    {id: 3, label: 'Tennis'},
    {id: 4, label: 'Cricket'},
    {id: 6, label: 'Live Casino'},
    {id: 7, label: 'Horse Racing'},
    {id: 8, label: 'X-Games'},
    {id: 9, label: 'Greyhound Racing'},
    {id: 10, label: 'Kabaddi'},
    {id: 11, label: 'Election'},
    {id: 12, label: 'Basketball'},
    {id: 13, label: 'Volleyball'},
    {id: 14, label: 'Snooker'},
    {id: 15, label: 'Motor Sport'},
    {id: 16, label: 'Ice Hockey'},
    {id: 17, label: 'Golf'},
    {id: 18, label: 'Esports'},
    {id: 19, label: 'Darts'},
    {id: 20, label: 'Cycling'},
    {id: 21, label: 'Boxing'},
    {id: 22, label: 'American Football'},
    {id: 23, label: 'Gaelic Games'},
    {id: 24, label: 'Handball'},
    {id: 25, label: 'Rugby League'},
    {id: 26, label: 'Rugby Union'},
    {id: 27, label: 'Australian Rules'},
    {id: 28, label: 'Politics'},
    {id: 29, label: 'Kabaddi'},
    {id: 30, label: 'Winter Sports'},
    {id: 31, label: 'Mixed Martial Arts'},



  ]
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

}
