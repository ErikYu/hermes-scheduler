import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import '../../assets/lib/gantt/dhtmlxgantt.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_grouping.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_tooltip.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_fullscreen.js';
import '../../assets/lib/gantt/locale/locale_cn.js';

import { TaskGanttService, OwnerOption } from './task-gantt.service';

import { GanttData, Task } from '../models/task-gantt.model';

declare var gantt: any;

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
    this.data.data = this.data.data.map(i => ({
      ...i,
      start_date: format(i.start_date, 'YYYY-MM-DD HH:mm:ss')
    }));
    this._tastGantt.saveTasks(this.projectId, this.data).subscribe(res => {
    });
  }

  expand() {
    gantt.expand();
  }

  getAllocatedValue(tasks, resource) {
    let result = 0;
    tasks.forEach((item) => {
      const assignments = gantt.getResourceAssignments(resource.id, item.id);
      assignments.forEach((assignment) => {
        result += +(Number(assignment.value) / item.duration).toFixed(1);
      });
    });
    return result;
  }

  getResourceAssignments(resourceId) {
    let assignments;
    const store = gantt.getDatastore(gantt.config.resource_store);
    const resource = store.getItem(resourceId);

    if (resource.$level === 0) {
      assignments = [];
      store.getChildren(resourceId).forEach((childId) => {
        assignments = assignments.concat(gantt.getResourceAssignments(childId));
      });
    } else if (resource.$level === 1) {
      assignments = gantt.getResourceAssignments(resourceId);
    } else {
      assignments = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id);
    }
    return assignments;
  }

  shouldHighlightResource(resource) {
    const selectedTaskId = gantt.getState().selected_task;
    if (gantt.isTaskExists(selectedTaskId)) {
      const selectedTask = gantt.getTask(selectedTaskId);
      const selectedResource = selectedTask[gantt.config.resource_property];

      if (resource.id === selectedResource) {
        return true;
      } else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
        return true;
      }
    }
    return false;
  }

  another() {
    gantt.config.auto_scheduling = true;
    gantt.config.auto_scheduling_strict = true;
    gantt.config.resource_render_empty_cells = true;
    gantt.config.resource_store = 'resource';
    gantt.$resourcesStore = gantt.createDatastore({
      name: gantt.config.resource_store,
      type: 'treeDatastore',
      fetchTasks: true,
      initItem: (item) => {
        // item.parent = item.parent || gantt.config.root_id;
        // item[gantt.config.resource_property] = item.parent;
        // item.open = true;
        return item;
      }
    });



    gantt.templates.histogram_cell_class = (start_date, end_date, resource, tasks) => {
      if (this.getAllocatedValue(tasks, resource) > 8) {
        return 'column_overload';
      }
    };

    gantt.templates.histogram_cell_label = (start_date, end_date, resource, tasks) => {
      if (tasks.length) {
        return this.getAllocatedValue(tasks, resource) + '/8';
        // return this.getAllocatedValue(tasks, resource) + '/8' + this.getCapacity(start_date, resource);
      }
      //   return '';
      // } else if (resource.$level === 2) {
      //   if (gantt.isWorkTime({date: start_date, task: gantt.getTask(resource.$task_id)})) {
      //     if (start_date.valueOf() < resource.end_date.valueOf() &&
      //       end_date.valueOf() > resource.start_date.valueOf()) {
      //       const assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
      //       return assignment.value;
      //     } else {
      //       return '&ndash;';
      //     }
      //   }
      // }
      return '&ndash;';

    };
    gantt.templates.histogram_cell_allocated = (start_date, end_date, resource, tasks) => {
      return this.getAllocatedValue(tasks, resource);
    };

    gantt.templates.histogram_cell_capacity = (start_date, end_date, resource, tasks) => {
      if (!gantt.isWorkTime(start_date)) {
        return 0;
      }
      return 8;
    };

    const resourceConfig = {
      scale_height: 30,
      row_height: 45,
      subscales: [],
      columns: [
        {
          name: 'name', label: 'Name', tree: true, width: 200, template: (resource) => {
            return resource.text;
          }, resize: true
        },
        // {
        //   name: 'progress', label: 'Complete', align: 'center', template: (resource) => {
        //     const store = gantt.getDatastore(gantt.config.resource_store);
        //     let totalToDo = 0;
        //     let totalDone = 0;
        //     let completion = 0;
        //     if (resource.$level == 2) {
        //       completion = resource.progress * 100;
        //     } else {
        //       const assignments = this.getResourceAssignments(resource.id);
        //       assignments.forEach((assignment) => {
        //         const task = gantt.getTask(assignment.task_id);
        //         totalToDo += task.duration;
        //         totalDone += task.duration * (task.progress || 0);
        //       });
        //
        //       if (totalToDo) {
        //         completion = (totalDone / totalToDo) * 100;
        //       }
        //     }
        //
        //
        //     return Math.floor(completion) + '%';
        //   }, resize: true
        // },
        // {
        //   name: 'workload', label: 'Workload', align: 'center', template: (resource) => {
        //     let totalDuration = 0;
        //     if (resource.$level == 2) {
        //       const assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
        //       totalDuration = resource.duration * assignment.value;
        //     } else {
        //       const assignments = this.getResourceAssignments(resource.id);
        //       assignments.forEach((assignment) => {
        //         const task = gantt.getTask(assignment.task_id);
        //         totalDuration += Number(assignment.value) * task.duration;
        //       });
        //
        //     }
        //
        //
        //     return (totalDuration || 0) + 'h';
        //
        //   }, resize: true
        // },

        // {
        //   name: 'capacity', label: 'Capacity', align: 'center', template: (resource) => {
        //     if (resource.$level == 2) {
        //       return resource.duration * WORK_DAY + 'h';
        //     }
        //     const store = gantt.getDatastore(gantt.config.resource_store);
        //     const n = (resource.$level === 0) ? store.getChildren(resource.id).length : 1;
        //
        //     const state = gantt.getState();
        //
        //     return gantt.calculateDuration({start_date: state.min_date, end_date: state.max_date}) * n * WORK_DAY + 'h';
        //   }
        // }

      ]
    };
    const resourceTemplates = {
      grid_row_class: (start, end, resource) => {
        const css = [];
        if (resource.$level === 0) {
          css.push('folder_row');
          css.push('group_row');
        }
        if (this.shouldHighlightResource(resource)) {
          css.push('highlighted_resource');
        }
        return css.join(' ');
      },
      task_row_class: (start, end, resource) => {
        const css = [];
        if (this.shouldHighlightResource(resource)) {
          css.push('highlighted_resource');
        }
        if (resource.$level === 0) {
          css.push('group_row');
        }

        return css.join(' ');
      }
    };

    gantt.config.layout = {
      css: 'gantt_container',
      rows: [
        {
          gravity: 2,
          cols: [
            {view: 'grid', group: 'grids', scrollY: 'scrollVer'},
            {resizer: true, width: 1},
            {view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer'},
            {view: 'scrollbar', id: 'scrollVer', group: 'vertical'}
          ]
        },
        { resizer: true, width: 1, next: 'resources'},
        // {
        //   height: 35,
        //   cols: [
        //     { html: '<label>Resource<select class=\'resource-select\'></select>', css : 'resource-select-panel', group: 'grids'},
        //     { resizer: true, width: 1},
        //     { html: ''}
        //   ]
        // },
        {
          gravity: 1,
          id: 'resources',
          config: resourceConfig,
          templates: resourceTemplates,
          cols: [
            { view: 'resourceGrid', group: 'grids', scrollY: 'resourceVScroll' },
            { resizer: true, width: 1 },
            { view: 'resourceHistogram', capacity: 24, scrollX: 'scrollHor', scrollY: 'resourceVScroll' },
            { view: 'scrollbar', id: 'resourceVScroll', group: 'vertical' }
          ]
        },
        { view: 'scrollbar', id: 'scrollHor' }
      ]
    };

  }

  ngOnInit() {

    this.another();
    gantt.config.resource_property = 'owner';
    gantt.config.work_time = true;
    gantt.templates.task_cell_class = (task, date) => {
      if (!gantt.isWorkTime(date)) {
        return 'week_end';
      }
      return '';
    };
    // gantt.config.round_dnd_dates = false;
    gantt.init(this.ganttContainer.nativeElement);
    gantt.config.date_scale = '%m-%d';
    // gantt.config.subscales = [
    //   { unit: 'day', step: 1, date: '%j' }
    // ];
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

      gantt.$resourcesStore.parse(res.map(i => ({
        id: i.key,
        text: i.label,
        parent: null
      })));

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
