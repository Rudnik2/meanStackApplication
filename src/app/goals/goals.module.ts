import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { GoalCreateComponent } from "./goal-create/goal-create.component";
import { GoalListComponent } from "./goal-list/goal-list.component";
import { MyGoalsComponent } from "./my-goals/my-goals.component";


@NgModule({
  declarations:[
    GoalCreateComponent,
    GoalListComponent,
    MyGoalsComponent
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
