import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataShareService {
private userId =new BehaviorSubject<number>(0);
public userID = this.userId.asObservable();
  constructor() { }
  IDuser(userID:number){
    this.userId.next(userID)
  }
}
