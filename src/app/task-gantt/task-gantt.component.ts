import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import '../../assets/lib/gantt/dhtmlxgantt.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_grouping.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_tooltip.js';
import '../../assets/lib/gantt/locale/locale_cn.js';

import { TaskGanttService, OwnerOption } from './task-gantt.service';

import { GanttData, Task } from '../models/task-gantt.model';

@Component({
  selector: 'app-task-gantt',
  templateUrl: './task-gantt.component.html',
  styleUrls: ['./task-gantt.component.less'],
  providers: [TaskGanttService],
})
export class TaskGanttComponent implements OnInit {

  grouped: boolean;
  data: GanttData;
  owners: OwnerOption[] = [];
  projectId: number;

  constructor(
    private _tastGantt: TaskGanttService,
    private _route: ActivatedRoute,
  ) { }

  @ViewChild('gantt_here') ganttContainer: ElementRef;

  showGroups() {
    if (!this.grouped) {
      gantt.groupBy({
        groups: this.owners,
        relation_property: 'owner',
        group_id: 'key',
        group_text: 'label'
      });
      this.grouped = true;
    } else {
      gantt.groupBy(false);
      this.grouped = false;
    }
  }

  saveData() {
    console.log(this.data);
    this.data.data = this.data.data.map(i => ({
      ...i,
      start_date: format(i.start_date, 'YYYY-MM-DD HH:mm:ss')
    }));
    this._tastGantt.saveTasks(this.projectId, this.data).subscribe(res => {
    });
  }

  ngOnInit() {
    gantt.config.work_time = true;
    gantt.templates.task_cell_class = (task, date) => {
      if (!gantt.isWorkTime(date)) {
        return 'week_end';
      }
      return '';
    };
    // gantt.config.round_dnd_dates = false;
    gantt.init(this.ganttContainer.nativeElement);
    gantt.config.date_scale = '%F, %Y';
    gantt.config.subscales = [
      { unit: 'day', step: 1, date: '%j' }
    ];
    // 这里的section_owner中的owner来自sections中的name
    gantt.locale.labels['section_owner'] = '人员';
    gantt.locale.labels['section_detail'] = '详情';

    gantt.templates.tooltip_text = (start, end, task: Task) => {
      const ownerNames = task.owner && task.owner.map(i => {
        return this.owners.find(j => j.key === +i.resource_id).label;
      }).toString();
      return `${task.text}</br>
              <b>开始日期:</b> ${format(task.start_date, 'YYYY-MM-DD HH:mm:ss')}<br/>
              <b>结束日期:</b> ${format(task.end_date, 'YYYY-MM-DD HH:mm:ss')}</br>
              <b>人员</b>: ${ownerNames || '未分配'}`;
    };
    // columns
    gantt.config.columns = [
      {name: 'text', tree: true, width: 200, resize: true},
      {name: 'start_date', align: 'center', width: 80, resize: true},
      {name: 'owner', align: 'center', width: 80, label: '人员', template: (task: Task) => {
          return task.owner && task.owner.map(i => {
            return this.owners.find(j => j.key === +i.resource_id).label;
          }).toString() || '未分配';
        }, resize: true},
      // {name: 'duration', width: 60, align: 'center', resize: true},
      {name: 'add', width: 44}
    ];



    this._tastGantt.getAllOwners().subscribe(res => {
      this.owners = res;
      // 双击detail页面
      gantt.config.lightbox.sections = [
        { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
        { name: 'detail', height: 38, map_to: 'detail', type: 'textarea', focus: false },
        { name: 'owner', type: 'resources', map_to: 'owner', options: this.owners, default_value: 8, unassigned_value: 0},
        { name: 'time', type: 'duration', map_to: 'auto' }
      ];
    });
    this.projectId = +this._route.snapshot.paramMap.get('projectId');
    this._tastGantt.getTasks(this.projectId).subscribe(res => {
      this.data = res.content.data;
      gantt.parse(this.data);
    });
  }

}
