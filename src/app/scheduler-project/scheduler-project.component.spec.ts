import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerProjectComponent } from './scheduler-project.component';

describe('SchedulerProjectComponent', () => {
  let component: SchedulerProjectComponent;
  let fixture: ComponentFixture<SchedulerProjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerProjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
