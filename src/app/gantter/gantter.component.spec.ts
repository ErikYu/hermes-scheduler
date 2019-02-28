import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GantterComponent } from './gantter.component';

describe('GantterComponent', () => {
  let component: GantterComponent;
  let fixture: ComponentFixture<GantterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GantterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GantterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
