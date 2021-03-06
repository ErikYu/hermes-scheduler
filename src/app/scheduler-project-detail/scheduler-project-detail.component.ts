import {Component, Inject, Input, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {format, parse} from 'date-fns';
import { SchedulerProject } from '../models/scheduler-project.model';
import { SchedulerProjectDetailService } from './scheduler-project-detail.service';
import { OptionsStore } from '../shared/options.store';

@Component({
  selector: 'app-scheduler-project-detail',
  templateUrl: './scheduler-project-detail.component.html',
  styleUrls: ['./scheduler-project-detail.component.less'],
  providers: [SchedulerProjectDetailService]
})
export class SchedulerProjectDetailComponent implements OnInit {
  validateForm: FormGroup;
  allPerson = [];
  constructor(
    private _fb: FormBuilder,
    private _projectDetail: SchedulerProjectDetailService,
    private _dialogRef: MatDialogRef<SchedulerProjectDetailComponent>,
    @Inject(MAT_DIALOG_DATA) private _data: SchedulerProject,
    private _options: OptionsStore,
  ) { }

  createForm() {
    console.log(this._data);
    this.validateForm = this._fb.group({
      name: [this._data.name, [Validators.required, Validators.maxLength(20)]],
      sub_name: [this._data.sub_name, [Validators.maxLength(20)]],
      description: [this._data.description, [Validators.maxLength(100)]],
      deadline: [this._data.deadline ? parse(this._data.deadline) : null],
      person_rels: [this._data.person_rels]
    });
  }

  save() {
    if (this.validateForm.invalid) {
      return;
    }
    const data = this.validateForm.value;
    data['deadline'] = format(data['deadline'], 'YYYY-MM-DD HH:mm:ss');
    if (this._data.id === 0) {
      this._projectDetail.addProject({data}).subscribe(res => {
        this.discard();
      });
    } else {
      this._projectDetail.updateProject(this._data.id, {data}).subscribe(res => {
        this.discard();
      });
    }
  }

  discard() {
    this._dialogRef.close();
  }

  ngOnInit() {
    this.createForm();
    this._options.allPerson().subscribe(res => this.allPerson = res);
  }

}
