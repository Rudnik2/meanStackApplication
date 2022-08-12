import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { GoalCreateComponent } from "./goal-create/goal-create.component";
import { GoalListComponent } from "./goal-list/goal-list.component";


@NgModule({
  declarations:[
    GoalCreateComponent,
    GoalListComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GoalsModule{}
