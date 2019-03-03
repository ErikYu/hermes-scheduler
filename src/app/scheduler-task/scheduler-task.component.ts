import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Router, ActivatedRoute} from '@angular/router';
import {SchedulerTaskService} from './scheduler-task.service';
import {SchedulerTask} from '../models/scheduler-task.model';

@Component({
  selector: 'app-scheduler-task',
  templateUrl: './scheduler-task.component.html',
  styleUrls: ['./scheduler-task.component.less'],
  providers: [SchedulerTaskService],
})
export class SchedulerTaskComponent implements OnInit {
  displayedColumns: string[] = ['title', 'start_date', 'duration', 'actions'];
  dataSource = new MatTableDataSource<SchedulerTask>([]);
  count = 0;
  projectId: number;
  private _pageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _task: SchedulerTaskService,
  ) { }

  create() {
    this._router.navigate(['/scheduler/task', this.projectId, 0]);
  }

  getDatalist(e) {
    this._pageEvent = e;
    this._task.getTasks({
      page: e.pageIndex + 1,
      limit: e.pageSize,
      where: [['project_id', '=', this.projectId]]
    }).subscribe(res => {
      this.dataSource = new MatTableDataSource<SchedulerTask>(res.content.datalist);
      this.count = res.content.count;
    });
  }

  edit(id: number) {
    this._router.navigate(['/scheduler/task', this.projectId, id]);
  }

  delete(id: number) {
    // this._task.deletePerson(id).subscribe(res => {
    //   this.getDatalist(this._pageEvent);
    // });
  }

  ngOnInit() {
    this.projectId = +this._route.snapshot.paramMap.get('projectId');
    this.getDatalist({pageIndex: 0, pageSize: 10});
  }
}
