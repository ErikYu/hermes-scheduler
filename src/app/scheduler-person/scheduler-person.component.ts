import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, PageEvent } from '@angular/material';
import { SchedulerPerson } from '../models/scheduler-person.model';
import { SchedulerPersonService } from './scheduler-person.service';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-scheduler-person',
  templateUrl: './scheduler-person.component.html',
  styleUrls: ['./scheduler-person.component.less'],
  providers: [SchedulerPersonService]
})
export class SchedulerPersonComponent implements OnInit {

  displayedColumns: string[] = ['id', 'name', 'code', 'job', 'actions'];
  dataSource = new MatTableDataSource<SchedulerPerson>([]);
  count = 0;

  private _pageEvent;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private _person: SchedulerPersonService,
    private _router: Router,
    private _dialog: MatDialog,
  ) {}

  getData(e) {
    this._pageEvent = e;
    this._person.getPeopleList({
      page: e.pageIndex + 1,
      limit: e.pageSize,
      where: []
    }).subscribe(res => {
      this.dataSource = new MatTableDataSource(res.content.datalist);
      this.count = res.content.count;
    });
  }

  create() {
    this._router.navigate(['/scheduler/person', 0]);
  }

  edit(id: number) {
    this._router.navigate(['/scheduler/person', id]);
  }

  delete(id: number) {
    this._person.deletePerson(id).subscribe(res => {
      this.getData(this._pageEvent);
    });
  }

  ngOnInit() {
    this.getData({pageSize: 10, pageIndex: 0});
  }

}