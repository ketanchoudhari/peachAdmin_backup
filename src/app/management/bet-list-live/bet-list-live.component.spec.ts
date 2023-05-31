import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BetListLiveComponent } from './bet-list-live.component';

describe('BetListLiveComponent', () => {
  let component: BetListLiveComponent;
  let fixture: ComponentFixture<BetListLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BetListLiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BetListLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
