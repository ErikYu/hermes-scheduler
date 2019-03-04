import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { SchedulerProject } from '../models/scheduler-project.model';
import { Router } from '@angular/router';
import { SchedulerProjectDetailComponent } from '../scheduler-project-detail/scheduler-project-detail.component';
import {  ScheduleProjectService} from './schedule-project.service';

@Component({
  selector: 'app-scheduler-project',
  templateUrl: './scheduler-project.component.html',
  styleUrls: ['./scheduler-project.component.less'],
  providers: [ScheduleProjectService],
})
export class SchedulerProjectComponent implements OnInit {

  allProjects: SchedulerProject[] = [];

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _project: ScheduleProjectService,
  ) {}

  getData(e) {
    this._project.getAllProjects({
      page: e.pageIndex + 1,
      limit: e.pageSize,
      where: [],
    }).subscribe(res => {
      console.log(res.content);
      this.allProjects = res.content.datalist;
    });
  }

  private openDialog(project: SchedulerProject) {
    return this._dialog.open<SchedulerProjectDetailComponent, SchedulerProject>
    (SchedulerProjectDetailComponent, {width: '400px', data: project});
  }

  create() {
    const dialogRef = this.openDialog({id: 0, name: null});
    dialogRef.afterClosed().subscribe(result => {
      this.getData({pageSize: 10, pageIndex: 0});
    });
  }

  edit(project: SchedulerProject) {
    const dialogRef = this.openDialog(project);
    dialogRef.afterClosed().subscribe(result => {
      this.getData({pageSize: 10, pageIndex: 0});
    });
  }
  gantt(id: number) {
    this._router.navigate(['/scheduler/gantt', id]);
  }

  delete(id) {
    this._project.deleteProject(id).subscribe(res => {
      this.getData({pageSize: 10, pageIndex: 0});
    });
  }

  goTask(projectId: number) {
    this._router.navigate(['/scheduler/task', projectId]);
  }

  ngOnInit() {
    this.getData({pageSize: 10, pageIndex: 0});
  }

}
