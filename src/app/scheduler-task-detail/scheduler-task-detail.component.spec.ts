import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerTaskDetailComponent } from './scheduler-task-detail.component';

describe('SchedulerTaskDetailComponent', () => {
  let component: SchedulerTaskDetailComponent;
  let fixture: ComponentFixture<SchedulerTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
