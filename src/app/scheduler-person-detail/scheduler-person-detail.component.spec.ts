import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulerPersonDetailComponent } from './scheduler-person-detail.component';

describe('SchedulerPersonDetailComponent', () => {
  let component: SchedulerPersonDetailComponent;
  let fixture: ComponentFixture<SchedulerPersonDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchedulerPersonDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerPersonDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
