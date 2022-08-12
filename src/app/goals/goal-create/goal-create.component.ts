import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Goal } from "../goal.model";
import { GoalsService } from "../goals.service";


import * as _moment from 'moment';

import {default as _rollupMoment,Moment} from 'moment';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    YearLabel: 'YYYY',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-goal-create',
  templateUrl:'./goal-create.component.html',
  styleUrls: ['./goal-create.component.css'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],

})
export class GoalCreateComponent implements OnInit,OnDestroy{
  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  isLoading = false;
  private authStatusSub!:Subscription;

  goal: Goal={
    id:null,
    title:null,
    Poziom3:null,
    Poziom3Date:null,

    Poziom2:null,
    Poziom2Date:null,

    Poziom1:null,
    Poziom1Date:null,

    creator:null
  };

  private goalId: string|null=null;
  datePoziom3 = new FormControl();
  datePoziom2 = new FormControl();
  datePoziom1 = new FormControl();

  constructor(public goalsService: GoalsService, public route: ActivatedRoute,private authService:AuthService){}

  setYearPoziom3(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.datePoziom3 = new FormControl(moment());
    const ctrlValue = this.datePoziom3.value!;
    ctrlValue.year(normalizedYear.year());
    this.datePoziom3.setValue(ctrlValue);
    datepicker.close();
  }

  setYearPoziom2(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.datePoziom2 = new FormControl(moment());
    const ctrlValue = this.datePoziom2.value!;
    ctrlValue.year(normalizedYear.year());
    this.datePoziom2.setValue(ctrlValue);
    datepicker.close();
  }
  setYearPoziom1(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    this.datePoziom1 = new FormControl(moment());
    const ctrlValue = this.datePoziom1.value!;
    ctrlValue.year(normalizedYear.year());
    this.datePoziom1.setValue(ctrlValue);
    datepicker.close();
  }


  ngOnInit() {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus=>{
      this.isLoading=false;
    });
    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("goalId")){
        this.mode= "edit";
        this.goalId = paramMap.get('goalId');
        this.isLoading=true;
        this.goalsService.getGoal(this.goalId!).subscribe(goalData=>{
          this.isLoading=false;
          this.goal = {
            id:goalData._id,
            title:goalData.title,

            Poziom3:goalData.Poziom3,
            Poziom3Date:goalData.Poziom3Date,

            Poziom2:goalData.Poziom2,
            Poziom2Date:goalData.Poziom2Date,

            Poziom1:goalData.Poziom1,
            Poziom1Date:goalData.Poziom1Date,

            Inspiration:goalData.Inspiration,
            reasonWhy:goalData.reasonWhy,
            Failure:goalData.Failure,

            creator:goalData.creator};

          //year -> moment date type
          this.datePoziom3 = new FormControl(moment());
          let ctrlValue = this.datePoziom3.value!;
          ctrlValue.year(goalData.Poziom3Date);
          this.datePoziom3.setValue(ctrlValue);

          this.datePoziom2 = new FormControl(moment());
          ctrlValue = this.datePoziom2.value!;
          ctrlValue.year(goalData.Poziom2Date);
          this.datePoziom2.setValue(ctrlValue);

          this.datePoziom1 = new FormControl(moment());
          ctrlValue = this.datePoziom1.value!;
          ctrlValue.year(goalData.Poziom1Date);
          this.datePoziom1.setValue(ctrlValue);


        });
      }else{
        this.mode="create";
        this.goalId=null;
      }
    });
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }
  onSaveGoal(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode=="create"){
      this.goalsService.addGoal(
        form.value.title,
        form.value.Poziom3,
        form.value.poziom3Date.year(),
        form.value.Poziom2,
        form.value.poziom2Date.year(),
        form.value.Poziom1,
        form.value.poziom1Date.year(),
        form.value.Inspiration,
        form.value.reasonWhy,
        form.value.Failure);
    }else {
      this.goalsService.updateGoals(
        this.goalId!,
        form.value.title,
        form.value.Poziom3,
        form.value.poziom3Date.year(),
        form.value.Poziom2,
        form.value.poziom2Date.year(),
        form.value.Poziom1,
        form.value.poziom1Date.year(),
        form.value.Inspiration,
        form.value.reasonWhy,
        form.value.Failure);
    }
      form.resetForm();
  }
}
