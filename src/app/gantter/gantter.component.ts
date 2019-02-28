import { Component, OnInit } from '@angular/core';
import '../../assets/lib/gantt/dhtmlxgantt.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_grouping.js';
import '../../assets/lib/gantt/locale/locale_cn.js';

declare const gantt: any;

@Component({
  selector: 'app-gantter',
  templateUrl: './gantter.component.html',
  styleUrls: ['./gantter.component.less']
})
export class GantterComponent implements OnInit {
  cap = {};
  WORK_DAY = 8;

  toggleGroups(input) {
    gantt.$groupMode = !gantt.$groupMode;
    if (gantt.$groupMode) {
      input.value = 'show gantt view';

      const groups = gantt.$resourcesStore.getItems().map((item) => {
        const group = gantt.copy(item);
        group.group_id = group.id;
        group.id = gantt.uid();
        return group;
      });

      gantt.groupBy({
        groups,
        relation_property: gantt.config.resource_property,
        group_id: 'group_id',
        group_text: 'text',
        delimiter: ', ',
        default_group_label: 'Not Assigned'
      });
    } else {
      input.value = 'show resource view';
      gantt.groupBy(false);
    }
  }

  shouldHighlightTask(task) {
    const store = gantt.$resourcesStore;
    const taskResource = task[gantt.config.resource_property];
    const selectedResource = store.getSelectedId();
    if (taskResource === selectedResource || store.isChildOf(taskResource, selectedResource)) {
      return true;
    }
  }

  getAllocatedValue(tasks, resource) {
    let result = 0;
    tasks.forEach((item) => {
      const assignments = gantt.getResourceAssignments(resource.id, item.id);
      assignments.forEach((assignment) => {
        result += Number(assignment.value);
      });
    });
    return result;
  }



  getCapacity(date, resource) {
    /* it is sample function your could to define your own function for get Capability of resources in day */
    // 1st level - resource groups
    // 2nd level - resources
    // 3rd level - assigned tasks
    if (resource.$level !== 1) {
      return -1;
    }

    const val = date.valueOf();
    if (!this.cap[val + resource.id]) {
      this.cap[val + resource.id] = [0, 1, 2, 3][Math.floor(Math.random() * 100) % 4];
    }
    return this.cap[val + resource.id] * this.WORK_DAY;
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

  initGantt() {
    gantt.templates.grid_row_class = (start, end, task) => {
      const css = [];
      if (gantt.hasChild(task.id)) {
        css.push('folder_row');
      }

      if (task.$virtual) {
        css.push('group_row');
      }

      if (this.shouldHighlightTask(task)) {
        css.push('highlighted_resource');
      }

      return css.join(' ');
    };

    gantt.templates.task_row_class = (start, end, task) => {
      if (this.shouldHighlightTask(task)) {
        return 'highlighted_resource';
      }
      return '';
    };

    gantt.templates.task_cell_class = (task, date) => {
      if (!gantt.isWorkTime({ date, task })) {
        return 'week_end';
      }
      return '';
    };

    gantt.templates.histogram_cell_class = (start_date, end_date, resource, tasks) => {
      if (resource.$level === 1) {
        if (this.getAllocatedValue(tasks, resource) > this.getCapacity(start_date, resource)) {
          return 'column_overload';
        }
      } else if (resource.$level === 2) {
        return 'resource_task_cell';
      }
    };

    gantt.templates.histogram_cell_label = (start_date, end_date, resource, tasks) => {
      if (tasks.length && resource.$level === 1) {
        return this.getAllocatedValue(tasks, resource) + '/' + this.getCapacity(start_date, resource);
      } else if (resource.$level === 0) {
        return '';
      } else if (resource.$level === 2) {
        if (gantt.isWorkTime({ date: start_date, task: gantt.getTask(resource.$task_id) })) {
          if (start_date.valueOf() < resource.end_date.valueOf() &&
            end_date.valueOf() > resource.start_date.valueOf()) {
            const assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
            return assignment.value;
          } else {
            return '&ndash;';
          }
        }
      }
      return '&ndash;';

    };
    gantt.templates.histogram_cell_allocated = (start_date, end_date, resource, tasks) => {
      return this.getAllocatedValue(tasks, resource);
    };

    gantt.templates.histogram_cell_capacity = (start_date, end_date, resource, tasks) => {
      if (!gantt.isWorkTime(start_date)) {
        return 0;
      }
      return this.getCapacity(start_date, resource);
    };
  }

  constructor() { }

  ngOnInit() {

    // let helper = {
    //   getArrayForTemplate: function(resourcesUsed, resourcesDefinition) {
    //     return resourcesUsed.map(function(entry) {
    //       let value = entry.value;
    //       let currentResource = helper.getItemById(resourcesDefinition, entry.id);
    //
    //       if (currentResource.options) {
    //         value = helper.getItemById(currentResource.options, entry.value).label;
    //       }
    //       return currentResource.label + ': ' + value + ' ' + currentResource.unit;
    //     });
    //   },
    //   getItemById: function(resources, id) {
    //     let result = resources.filter(function(option) {
    //       return option.key == id;
    //     });
    //
    //     return result[0];
    //   }
    // }

    const UNASSIGNED_ID = 5;
    // let WORK_DAY = 8;
    this.initGantt();



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

    gantt.locale.labels.section_owner = 'Owner';
    gantt.config.lightbox.sections = [
      { name: 'description', height: 38, map_to: 'text', type: 'textarea', focus: true },
      { name: 'owner', type: 'resources', map_to: 'owner', options: gantt.serverList('people'),
        default_value: this.WORK_DAY, unassigned_value: UNASSIGNED_ID },
      { name: 'time', type: 'duration', map_to: 'auto' }
    ];
    gantt.config.resource_render_empty_cells = true;



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
        {
          name: 'progress', label: 'Complete', align: 'center', template: (resource) => {
            const store = gantt.getDatastore(gantt.config.resource_store);
            let totalToDo = 0;
            let totalDone = 0;
            let completion = 0;

            if (resource.$level === 2) {
              completion = resource.progress * 100;
            } else {
              const assignments = this.getResourceAssignments(resource.id);
              assignments.forEach((assignment) => {
                const task = gantt.getTask(assignment.task_id);
                totalToDo += task.duration;
                totalDone += task.duration * (task.progress || 0);
              });

              if (totalToDo) {
                completion = (totalDone / totalToDo) * 100;
              }
            }


            return Math.floor(completion) + '%';
          }, resize: true
        },
        {
          name: 'workload', label: 'Workload', align: 'center', template: (resource) => {
            let totalDuration = 0;
            if (resource.$level === 2) {
              const assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
              totalDuration = resource.duration * assignment.value;
            } else {
              const assignments = this.getResourceAssignments(resource.id);
              assignments.forEach((assignment) => {
                const task = gantt.getTask(assignment.task_id);
                totalDuration += Number(assignment.value) * task.duration;
              });

            }


            return (totalDuration || 0) + 'h';

          }, resize: true
        },

        {
          name: 'capacity', label: 'Capacity', align: 'center', template: (resource) => {
            if (resource.$level === 2) {
              return resource.duration * this.WORK_DAY + 'h';
            }
            const store = gantt.getDatastore(gantt.config.resource_store);
            const n = (resource.$level === 0) ? store.getChildren(resource.id).length : 1;

            const state = gantt.getState();

            return gantt.calculateDuration(state.min_date, state.max_date) * n * this.WORK_DAY + 'h';
          }
        }

      ]
    };

    gantt.config.subscales = [
      { unit: 'month', step: 1, date: '%F, %Y' }
    ];

    gantt.config.auto_scheduling = true;
    gantt.config.auto_scheduling_strict = true;
    gantt.config.work_time = true;
    gantt.config.columns = [
      { name: 'text', tree: true, width: 200, resize: true },
      { name: 'start_date', align: 'center', width: 80, resize: true },
      {
        name: 'owner', align: 'center', width: 80, label: 'Owner', template: (task) => {
          if (task.type === gantt.config.types.project) {
            return '';
          }

          const store = gantt.getDatastore('resource');
          const assignments = task[gantt.config.resource_property];

          if (!assignments || !assignments.length) {
            return 'Unassigned';
          }

          if (assignments.length === 1) {
            return store.getItem(assignments[0].resource_id).text;
          }

          let result = '';
          assignments.forEach((assignment) => {
            const owner = store.getItem(assignment.resource_id);
            if (!owner) {
              return;
            }
            result += '<div class="owner-label" title="" + owner.text + "">' + owner.text.substr(0, 1) + '</div>';

          });

          return result;
        }, resize: true
      },
      { name: 'duration', width: 60, align: 'center', resize: true },
      { name: 'add', width: 44 }
    ];

    gantt.config.resource_store = 'resource';
    gantt.config.resource_property = 'owner';
    gantt.config.order_branch = true;
    gantt.config.open_tree_initially = true;
    gantt.config.scale_height = 50;
    gantt.config.layout = {
      css: 'gantt_container',
      rows: [
        {
          gravity: 2,
          cols: [
            { view: 'grid', group: 'grids', scrollY: 'scrollVer' },
            { resizer: true, width: 1 },
            { view: 'timeline', scrollX: 'scrollHor', scrollY: 'scrollVer' },
            { view: 'scrollbar', id: 'scrollVer', group: 'vertical' }
          ]
        },
        { resizer: true, width: 1, next: 'resources' },
        {
          height: 35,
          cols: [
            { html: '<label>Resource<select class="resource-select"></select>', css: 'resource-select-panel', group: 'grids' },
            { resizer: true, width: 1 },
            { html: '' }
          ]
        },

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

    gantt.$resourcesStore = gantt.createDatastore({
      name: gantt.config.resource_store,
      type: 'treeDatastore',
      fetchTasks: true,
      initItem: (item) => {
        item.parent = item.parent || gantt.config.root_id;
        item[gantt.config.resource_property] = item.parent;
        item.open = true;
        return item;
      }
    });

    gantt.$resourcesStore.attachEvent('onAfterSelect',  (id) => {
      gantt.refreshData();
    });

    gantt.init('gantt_here');

    gantt.attachEvent('onTaskLoading', (task) => {
      const ownerValue = task[gantt.config.resource_property];

      if (!task.$virtual && (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)) {
        task[gantt.config.resource_property] = [{ resource_id: 5, value: 0 }];
      }
      return true;
    });
    gantt.load('../../assets/lib/gantt/demo.json');

    gantt.$resourcesStore.attachEvent('onParse', () => {
      const people = [];

      gantt.$resourcesStore.eachItem((res) => {
        if (res.$level === 1) {
          const copy = gantt.copy(res);
          copy.key = res.id;
          copy.label = res.text;
          copy.unit = 'hours';
          people.push(copy);
        }
      });
      gantt.updateCollection('people', people);
    });

    gantt.$resourcesStore.parse([
      { id: 1, text: 'QA', parent: null },
      { id: 2, text: 'Development', parent: null },
      { id: 3, text: 'Sales', parent: null },
      { id: 4, text: 'Other', parent: null },
      { id: 5, text: 'Unassigned', parent: 4, default: true },
      { id: 6, text: 'John', parent: 1 },
      { id: 7, text: 'Mike', parent: 2 },
      { id: 8, text: 'Anna', parent: 2 },
      { id: 9, text: 'Bill', parent: 3 },
      { id: 10, text: 'Floe', parent: 3 }
    ]);

  }

}
