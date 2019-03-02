import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialsModule } from './materials/materials.module';
import { ComponentsModule } from './components/components.module';
import { TaskGanttComponent } from './task-gantt/task-gantt.component';
import { SchedulerTaskComponent } from './scheduler-task/scheduler-task.component';
import { SchedulerPersonComponent } from './scheduler-person/scheduler-person.component';
import { SchedulerPersonDetailComponent } from './scheduler-person-detail/scheduler-person-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskGanttComponent,
    SchedulerTaskComponent,
    SchedulerPersonComponent,
    SchedulerPersonDetailComponent
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
