import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerTaskComponent } from './scheduler-task.component';

describe('SchedulerTaskComponent', () => {
  let component: SchedulerTaskComponent;
  let fixture: ComponentFixture<SchedulerTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
