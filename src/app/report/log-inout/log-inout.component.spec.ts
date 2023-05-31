import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogInoutComponent } from './log-inout.component';

describe('LogInoutComponent', () => {
  let component: LogInoutComponent;
  let fixture: ComponentFixture<LogInoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogInoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogInoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
