import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material';
import { MaterialsModule } from './materials/materials.module';
import { ComponentsModule } from './components/components.module';
import { OptionsStore } from './shared/options.store';
import { NoopInterceptor } from './shared/interceptors';
import { LoginComponent } from './login/login.component';
import { TaskGanttComponent } from './task-gantt/task-gantt.component';
import { SchedulerTaskComponent } from './scheduler-task/scheduler-task.component';
import { SchedulerPersonComponent } from './scheduler-person/scheduler-person.component';
import { SchedulerPersonDetailComponent } from './scheduler-person-detail/scheduler-person-detail.component';
import { SchedulerProjectComponent } from './scheduler-project/scheduler-project.component';
import { SchedulerProjectDetailComponent } from './scheduler-project-detail/scheduler-project-detail.component';
import { SchedulerTaskDetailComponent } from './scheduler-task-detail/scheduler-task-detail.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TaskGanttComponent,
    SchedulerTaskComponent,
    SchedulerPersonComponent,
    SchedulerPersonDetailComponent,
    SchedulerProjectComponent,
    SchedulerProjectDetailComponent,
    SchedulerTaskDetailComponent,
    UserProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialsModule,
    ComponentsModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'zh-CN'},
    { provide: HTTP_INTERCEPTORS, useClass: NoopInterceptor, multi: true },
    OptionsStore,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    SchedulerProjectDetailComponent,
  ]
})
export class AppModule { }
