import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MyTasksComponent } from "./my-tasks/my-tasks.component";
import { TaskCreateComponent } from "./task-create/task-create.component";
import { TaskListComponent } from "./task-list/task-list.component";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations:[
    TaskCreateComponent,
    MyTasksComponent,
    TaskListComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    InfiniteScrollModule,
    MatCheckboxModule
  ]
})
export class TaskModule{}
