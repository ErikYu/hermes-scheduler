import { Component, OnInit } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SchedulePersonDetailService } from './schedule-person-detail.service';

@Component({
  selector: 'app-scheduler-person-detail',
  templateUrl: './scheduler-person-detail.component.html',
  styleUrls: ['./scheduler-person-detail.component.less'],
  providers: [SchedulePersonDetailService]
})
export class SchedulerPersonDetailComponent implements OnInit {
  id: number;
  validateForm: FormGroup;
  allJobs = [
    {label: 'Empty', value: 0},
    {label: 'FE', value: 1},
    {label: 'BE', value: 2},
  ];

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _personDetail: SchedulePersonDetailService,
  ) { }

  private createForm() {
    if (this.id === 0) {
      this.validateForm = this._fb.group({
        name: [null, [Validators.required]],
        job: [null, [Validators.required]],
      });
    } else {
      // get
      this._personDetail.getPerson(this.id).subscribe(res => {
        this.validateForm = this._fb.group({
          name: [res.name, [Validators.required]],
          job: [res.job, [Validators.required]],
        });
      });
    }
  }

  back() {
    this._router.navigate(['/scheduler/person']);
  }

  save() {
    if (!this.validateForm.valid) {
      return;
    }
    if (this.id === 0) {
      this._personDetail.addPerson({data: this.validateForm.value}).subscribe(res => {
      });
    } else {
      this._personDetail.updatePerson(this.id, {data: this.validateForm.value}).subscribe(res => {
      });
    }

  }

  ngOnInit() {
    this.id = +this._route.snapshot.paramMap.get('id');
    this.createForm();
  }

}
