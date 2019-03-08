import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerPersonComponent } from './scheduler-person/scheduler-person.component';
import { SchedulerTaskComponent } from './scheduler-task/scheduler-task.component';
import { SchedulerPersonDetailComponent } from './scheduler-person-detail/scheduler-person-detail.component';
import { TaskGanttComponent } from './task-gantt/task-gantt.component';
import { SchedulerProjectComponent } from './scheduler-project/scheduler-project.component';
import { SchedulerTaskDetailComponent } from './scheduler-task-detail/scheduler-task-detail.component';
import { LoginComponent } from './login/login.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'scheduler/person', component: SchedulerPersonComponent},
  {path: 'scheduler/person/:id', component: SchedulerPersonDetailComponent},
  {path: 'scheduler/task', component: SchedulerTaskComponent},
  {path: 'scheduler/task/:projectId', component: SchedulerTaskComponent},
  {path: 'scheduler/task/:projectId/:taskId', component: SchedulerTaskDetailComponent},
  {path: 'scheduler/project', component: SchedulerProjectComponent},
  {path: 'scheduler/gantt/:projectId', component: TaskGanttComponent},
  {path: 'user/profile', component: UserProfileComponent},
  { path: '', redirectTo: 'scheduler/project', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
