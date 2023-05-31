import { Component } from '@angular/core';
import { Hierarchy } from '../shared/types/hierarchy';
// import { Hierarchy } from '../services/types/hierarchy';
// import { OnInit } from '@angular/core';

@Component({
  selector: 'app-addaccount',
  templateUrl: './addaccount.component.html',
  styleUrls: ['./addaccount.component.css']
})
export class AddaccountComponent  {
  constructor(){

  }
  member: Hierarchy[];
run(){
console.log(this.member,"member name")
}

}
