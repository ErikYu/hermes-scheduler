import { Component, OnInit } from '@angular/core';
import '../../assets/lib/gantt/dhtmlxgantt.js';
import '../../assets/lib/gantt/ext/dhtmlxgantt_grouping.js';

declare const gantt: any;

@Component({
  selector: 'app-gantter',
  templateUrl: './gantter.component.html',
  styleUrls: ['./gantter.component.less']
})
export class GantterComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    let helper = {
      getArrayForTemplate: function(resourcesUsed, resourcesDefinition) {
        return resourcesUsed.map(function(entry) {
          let value = entry.value;
          let currentResource = helper.getItemById(resourcesDefinition, entry.id);

          if (currentResource.options) {
            value = helper.getItemById(currentResource.options, entry.value).label;
          }
          return currentResource.label + ': ' + value + ' ' + currentResource.unit;
        });
      },
      getItemById: function(resources, id) {
        let result = resources.filter(function(option) {
          return option.key == id;
        });

        return result[0];
      }
    }

    let UNASSIGNED_ID = 5;
    let WORK_DAY = 8;
    function shouldHighlightTask(task) {
      let store = gantt.$resourcesStore;
      let taskResource = task[gantt.config.resource_property];
      let selectedResource = store.getSelectedId();
      if (taskResource == selectedResource || store.isChildOf(taskResource, selectedResource)) {
        return true;
      }
    }

    gantt.templates.grid_row_class = function(start, end, task) {
      let css = [];
      if (gantt.hasChild(task.id)) {
        css.push('folder_row');
      }

      if (task.$virtual) {
        css.push('group_row');
      }

      if (shouldHighlightTask(task)) {
        css.push('highlighted_resource');
      }

      return css.join(' ');
    };

    gantt.templates.task_row_class = function(start, end, task) {
      if (shouldHighlightTask(task)) {
        return 'highlighted_resource';
      }
      return '';
    };

    gantt.templates.task_cell_class = function(task, date) {
      if (!gantt.isWorkTime({ date: date, task: task })) {
        return 'week_end';
      }
      return '';
    };

    function getAllocatedValue(tasks, resource) {
      let result = 0;
      tasks.forEach(function(item) {
        let assignments = gantt.getResourceAssignments(resource.id, item.id);
        assignments.forEach(function (assignment) {
          result += Number(assignment.value);
        });
      });
      return result;
    }
    let cap = {};

    function getCapacity(date, resource) {
      /* it is sample function your could to define your own function for get Capability of resources in day */
      // 1st level - resource groups
      // 2nd level - resources
      // 3rd level - assigned tasks
      if (resource.$level !== 1) {
        return -1;
      }

      let val = date.valueOf();
      if (!cap[val + resource.id]) {
        cap[val + resource.id] = [0, 1, 2, 3][Math.floor(Math.random() * 100) % 4];
      }
      return cap[val + resource.id] * WORK_DAY;
    }

    gantt.templates.histogram_cell_class = function(start_date, end_date, resource, tasks) {
      if (resource.$level === 1) {
        if (getAllocatedValue(tasks, resource) > getCapacity(start_date, resource)) {
          return 'column_overload';
        }
      } else if (resource.$level === 2) {
        return 'resource_task_cell';
      }
    };

    gantt.templates.histogram_cell_label = function(start_date, end_date, resource, tasks) {
      if (tasks.length && resource.$level === 1) {
        return getAllocatedValue(tasks, resource) + '/' + getCapacity(start_date, resource);
      } else if (resource.$level === 0) {
        return '';
      } else if (resource.$level === 2) {
        if (gantt.isWorkTime({ date: start_date, task: gantt.getTask(resource.$task_id) })) {
          if (start_date.valueOf() < resource.end_date.valueOf() &&
            end_date.valueOf() > resource.start_date.valueOf()) {
            let assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
            return assignment.value;
          } else {
            return '&ndash;';
          }
        }
      }
      return '&ndash;';

    };
    gantt.templates.histogram_cell_allocated = function(start_date, end_date, resource, tasks) {
      return getAllocatedValue(tasks, resource);
    };

    gantt.templates.histogram_cell_capacity = function(start_date, end_date, resource, tasks) {
      if (!gantt.isWorkTime(start_date)) {
        return 0;
      }
      return getCapacity(start_date, resource);
    };

    function shouldHighlightResource(resource) {
      let selectedTaskId = gantt.getState().selected_task;
      if (gantt.isTaskExists(selectedTaskId)) {
        let selectedTask = gantt.getTask(selectedTaskId);
        let selectedResource = selectedTask[gantt.config.resource_property];

        if (resource.id == selectedResource) {
          return true;
        } else if (gantt.$resourcesStore.isChildOf(selectedResource, resource.id)) {
          return true;
        }
      }
      return false;
    }

    let resourceTemplates = {
      grid_row_class: function(start, end, resource) {
        let css = [];
        if (resource.$level === 0) {
          css.push('folder_row');
          css.push('group_row');
        }
        if (shouldHighlightResource(resource)) {
          css.push('highlighted_resource');
        }
        return css.join(' ');
      },
      task_row_class: function (start, end, resource) {
        let css = [];
        if (shouldHighlightResource(resource)) {
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
        default_value: WORK_DAY, unassigned_value: UNASSIGNED_ID },
      { name: 'time', type: 'duration', map_to: 'auto' }
    ];
    gantt.config.resource_render_empty_cells = true;

    function getResourceAssignments(resourceId) {
      let assignments;
      let store = gantt.getDatastore(gantt.config.resource_store);
      let resource = store.getItem(resourceId);

      if (resource.$level === 0) {
        assignments = [];
        store.getChildren(resourceId).forEach(function (childId) {
          assignments = assignments.concat(gantt.getResourceAssignments(childId));
        });
      } else if (resource.$level === 1) {
        assignments = gantt.getResourceAssignments(resourceId);
      } else {
        assignments = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id);
      }
      return assignments;
    }

    let resourceConfig = {
      scale_height: 30,
      row_height: 45,
      subscales: [],
      columns: [
        {
          name: 'name', label: 'Name', tree: true, width: 200, template: function (resource) {
            return resource.text;
          }, resize: true
        },
        {
          name: 'progress', label: 'Complete', align: 'center', template: function (resource) {
            let store = gantt.getDatastore(gantt.config.resource_store);
            let totalToDo = 0;
            let totalDone = 0;
            let completion = 0;

            if (resource.$level == 2) {
              completion = resource.progress * 100;
            } else {
              let assignments = getResourceAssignments(resource.id);
              assignments.forEach(function (assignment) {
                let task = gantt.getTask(assignment.task_id);
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
          name: 'workload', label: 'Workload', align: 'center', template: function (resource) {
            let totalDuration = 0;
            if (resource.$level == 2) {
              let assignment = gantt.getResourceAssignments(resource.$resource_id, resource.$task_id)[0];
              totalDuration = resource.duration * assignment.value;
            } else {
              let assignments = getResourceAssignments(resource.id);
              assignments.forEach(function (assignment) {
                let task = gantt.getTask(assignment.task_id);
                totalDuration += Number(assignment.value) * task.duration;
              });

            }


            return (totalDuration || 0) + 'h';

          }, resize: true
        },

        {
          name: 'capacity', label: 'Capacity', align: 'center', template: function (resource) {
            if (resource.$level == 2) {
              return resource.duration * WORK_DAY + 'h';
            }
            let store = gantt.getDatastore(gantt.config.resource_store);
            let n = (resource.$level === 0) ? store.getChildren(resource.id).length : 1

            let state = gantt.getState();

            return gantt.calculateDuration(state.min_date, state.max_date) * n * WORK_DAY + 'h';
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
        name: 'owner', align: 'center', width: 80, label: 'Owner', template: function (task) {
          if (task.type == gantt.config.types.project) {
            return '';
          }

          let store = gantt.getDatastore('resource');
          let assignments = task[gantt.config.resource_property];

          if (!assignments || !assignments.length) {
            return 'Unassigned';
          }

          if (assignments.length == 1) {
            return store.getItem(assignments[0].resource_id).text;
          }

          let result = '';
          assignments.forEach(function (assignment) {
            let owner = store.getItem(assignment.resource_id);
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
      initItem: function (item) {
        item.parent = item.parent || gantt.config.root_id;
        item[gantt.config.resource_property] = item.parent;
        item.open = true;
        return item;
      }
    });

    gantt.$resourcesStore.attachEvent('onAfterSelect', function (id) {
      gantt.refreshData();
    });

    gantt.init('gantt_here');

    gantt.attachEvent('onTaskLoading', function (task) {
      let ownerValue = task[gantt.config.resource_property];

      if (!task.$virtual && (!ownerValue || !Array.isArray(ownerValue) || !ownerValue.length)) {
        task[gantt.config.resource_property] = [{ resource_id: 5, value: 0 }];
      }
      return true;
    });
    gantt.load('../../assets/lib/gantt/demo.json');

    function toggleGroups(input) {
      gantt.$groupMode = !gantt.$groupMode;
      if (gantt.$groupMode) {
        input.value = 'show gantt view';

        let groups = gantt.$resourcesStore.getItems().map(function (item) {
          let group = gantt.copy(item);
          group.group_id = group.id;
          group.id = gantt.uid();
          return group;
        });

        gantt.groupBy({
          groups: groups,
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

    gantt.$resourcesStore.attachEvent('onParse', function () {
      let people = [];

      gantt.$resourcesStore.eachItem(function (res) {
        if (res.$level === 1) {
          let copy = gantt.copy(res);
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
