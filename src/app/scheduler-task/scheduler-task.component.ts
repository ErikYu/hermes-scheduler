import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatTableDataSource} from '@angular/material';
import {Router, ActivatedRoute} from '@angular/router';
import {Task} from '../models/task-gantt.model';

@Component({
  selector: 'app-scheduler-task',
  templateUrl: './scheduler-task.component.html',
  styleUrls: ['./scheduler-task.component.less']
})
export class SchedulerTaskComponent implements OnInit {
  displayedColumns: string[] = ['text', 'start_date', 'duration'];
  dataSource = new MatTableDataSource<Task>([]);
  count = 0;
  projectId: number;
  private _pageEvent;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
  ) { }

  create() {
    this._router.navigate(['/scheduler/task', this.projectId, 0]);
  }

  getDatalist() {

  }

  ngOnInit() {
    this.projectId = +this._route.snapshot.paramMap.get('projectId');
  }
}
