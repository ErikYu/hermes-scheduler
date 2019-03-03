import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerProjectDetailComponent } from './scheduler-project-detail.component';

describe('SchedulerProjectDetailComponent', () => {
  let component: SchedulerProjectDetailComponent;
  let fixture: ComponentFixture<SchedulerProjectDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerProjectDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerProjectDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
