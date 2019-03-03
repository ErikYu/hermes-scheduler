import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SchedulerTaskDetailService } from './scheduler-task-detail.service';
import { OptionsStore } from '../shared/options.store';

@Component({
  selector: 'app-scheduler-task-detail',
  templateUrl: './scheduler-task-detail.component.html',
  styleUrls: ['./scheduler-task-detail.component.less'],
  providers: [SchedulerTaskDetailService],
})
export class SchedulerTaskDetailComponent implements OnInit {
  validateForm: FormGroup;
  projectId: number;
  allJobs = [
    {label: 'Empty', value: 0},
    {label: 'FE', value: 1},
    {label: 'BE', value: 2},
  ];
  allPeople = [];
  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _taskDetail: SchedulerTaskDetailService,
    private _options: OptionsStore,
  ) { }

  createForm() {
    this.validateForm = this._fb.group({
      title: [null, [Validators.required]],
      content: [null],
      start_date: [null, [Validators.required]],
      duration: [null, [Validators.required]],
      project_id: [this.projectId],
      job_type: [null, [Validators.required]],
      person_id: [null],
      work_hour: [null]
    });
  }
  ngOnInit() {
    this.projectId = +this._route.snapshot.paramMap.get('projectId');
    this.createForm();
    this._options.allPerson().subscribe(res => {
      console.log(res);
      this.allPeople = res;
    });
  }
  save() {
    console.log(this.validateForm.value);
    if (this.validateForm.invalid) {
      return;
    }
    this._taskDetail.addSchedulerTask({data: this.validateForm.value}).subscribe(res => {});
  }
}
