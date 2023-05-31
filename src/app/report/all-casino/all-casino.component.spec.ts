import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCasinoComponent } from './all-casino.component';

describe('AllCasinoComponent', () => {
  let component: AllCasinoComponent;
  let fixture: ComponentFixture<AllCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCasinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
