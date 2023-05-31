import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiamondCasinoComponent } from './diamond-casino.component';

describe('DiamondCasinoComponent', () => {
  let component: DiamondCasinoComponent;
  let fixture: ComponentFixture<DiamondCasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiamondCasinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DiamondCasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
