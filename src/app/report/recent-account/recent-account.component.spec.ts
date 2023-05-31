import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentAccountComponent } from './recent-account.component';

describe('RecentAccountComponent', () => {
  let component: RecentAccountComponent;
  let fixture: ComponentFixture<RecentAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
