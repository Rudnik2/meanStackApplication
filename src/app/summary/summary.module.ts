import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";

import { AngularMaterialModule } from "../angular-material.module";
import { SummaryComponent } from "./summary.component";



@NgModule({
  declarations:[
    SummaryComponent
  ],
  imports:[
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialog
  ]
})
export class SummaryModule{}
