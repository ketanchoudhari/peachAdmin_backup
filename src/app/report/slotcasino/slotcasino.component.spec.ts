import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlotcasinoComponent } from './slotcasino.component';

describe('SlotcasinoComponent', () => {
  let component: SlotcasinoComponent;
  let fixture: ComponentFixture<SlotcasinoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlotcasinoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlotcasinoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
