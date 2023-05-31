import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketanaylsisComponent } from './marketanaylsis.component';

describe('MarketanaylsisComponent', () => {
  let component: MarketanaylsisComponent;
  let fixture: ComponentFixture<MarketanaylsisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarketanaylsisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketanaylsisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
