import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerPersonComponent } from './scheduler-person.component';

describe('SchedulerPersonComponent', () => {
  let component: SchedulerPersonComponent;
  let fixture: ComponentFixture<SchedulerPersonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerPersonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerPersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
