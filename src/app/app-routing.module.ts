import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerPersonComponent } from './scheduler-person/scheduler-person.component';
import { SchedulerTaskComponent } from './scheduler-task/scheduler-task.component';
import { SchedulerPersonDetailComponent } from './scheduler-person-detail/scheduler-person-detail.component';
import { TaskGanttComponent } from './task-gantt/task-gantt.component';
import { SchedulerProjectComponent } from './scheduler-project/scheduler-project.component';
import { SchedulerTaskDetailComponent } from './scheduler-task-detail/scheduler-task-detail.component';


const routes: Routes = [
  {path: 'scheduler/person', component: SchedulerPersonComponent},
  {path: 'scheduler/person/:id', component: SchedulerPersonDetailComponent},
  {path: 'scheduler/task', component: SchedulerTaskComponent},
  {path: 'scheduler/task/:projectId', component: SchedulerTaskComponent},
  {path: 'scheduler/task/:projectId/:taskId', component: SchedulerTaskDetailComponent},
  {path: 'scheduler/project', component: SchedulerProjectComponent},
  {path: 'scheduler/gantt', component: TaskGanttComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
