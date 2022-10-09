import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { MyTasksComponent } from "./my-tasks/my-tasks.component";
import { TaskCreateComponent } from "./task-create/task-create.component";


@NgModule({
  declarations:[
    TaskCreateComponent,
    MyTasksComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TaskModule{}
