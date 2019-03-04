import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SchedulerTaskDetailService } from './scheduler-task-detail.service';
import { OptionsStore } from '../shared/options.store';
import {format, parse} from 'date-fns';

@Component({
  selector: 'app-scheduler-task-detail',
  templateUrl: './scheduler-task-detail.component.html',
  styleUrls: ['./scheduler-task-detail.component.less'],
  providers: [SchedulerTaskDetailService],
})
export class SchedulerTaskDetailComponent implements OnInit {
  validateForm: FormGroup;
  projectId: number;
  taskId: number;
  allJobs = [
    {label: 'Empty', value: 0},
    {label: 'FE', value: 1},
    {label: 'BE', value: 2},
  ];
  allPeople = [];
  allTasks = [];
  constructor(
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _taskDetail: SchedulerTaskDetailService,
    private _options: OptionsStore,
  ) { }

  createForm() {
    if (this.taskId === 0) {
      this.validateForm = this._fb.group({
        title: [null, [Validators.required]],
        content: [null],
        start_date: [null, [Validators.required]],
        duration: [null, [Validators.required]],
        project_id: [this.projectId],
        job_type: [null, [Validators.required]],
        person_id: [null],
        work_hour: [null],
        depend_id: [null],
      });
    } else {
      this._taskDetail.getSchedulerTask(this.taskId).subscribe(res => {
        this.validateForm = this._fb.group({
          title: [res.title, [Validators.required]],
          content: [res.content],
          start_date: [parse(res.start_date), [Validators.required]],
          duration: [res.duration, [Validators.required]],
          project_id: [this.projectId],
          job_type: [res.job_type, [Validators.required]],
          person_id: [res.person_id],
          work_hour: [res.work_hour],
          depend_id: [res.depend_id],
        });
      });
    }
  }
  ngOnInit() {
    this.projectId = +this._route.snapshot.paramMap.get('projectId');
    this.taskId = +this._route.snapshot.paramMap.get('taskId');
    this.createForm();
    this._options.allPerson().subscribe(res => this.allPeople = res);
    this._options.allTaskInProject(this.projectId, this.taskId).subscribe(res => this.allTasks = res);
  }
  save() {
    if (this.validateForm.invalid) {
      return;
    }
    const data = this.validateForm.value;
    data['start_date'] = format(data['start_date'], 'YYYY-MM-DD HH:mm:ss');
    if (this.taskId === 0) {
      this._taskDetail.addSchedulerTask({data}).subscribe(res => {});
    } else {
      this._taskDetail.updateSchedulerTask(this.taskId, {data}).subscribe(res => {});
    }
  }
  back() {
    this._router.navigate(['/scheduler/task', this.projectId]);
  }
}
