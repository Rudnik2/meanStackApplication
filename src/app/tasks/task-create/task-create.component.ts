import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepicker } from "@angular/material/datepicker";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Goal } from "../../goals/goal.model";
import { GoalsService } from "../../goals/goals.service";
import { Task } from "../task.model";
import { TasksService } from "../tasks.service";

import * as _moment from 'moment';

import {default as _rollupMoment,Moment} from 'moment';
import { AuthData } from "src/app/auth/auth-data.model";

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    YearLabel: 'MM/DD/YYYY',
    yearA11yLabel: 'MM/DD/YYYY',
  },
};

@Component({
  selector: 'app-task-create',
  templateUrl:'./task-create.component.html',
  styleUrls: ['./task-create.component.css']

})
export class TaskCreateComponent implements OnInit,OnDestroy{
  checked = true;
  goals:Goal[] = [];
  myGoals:Goal[] = [];
  userId!: string;
  userIsAuthenticated = false;
  private goalsSub: Subscription = new Subscription;

  enteredTitle = "";
  enteredContent = "";
  private mode = "create";
  isLoading = false;
  private authStatusSub!:Subscription;

  task: Task={
    id:null,
    title:null,
    content:null,
    plannedDate:null,
    creator:null
  };
  user: AuthData={
    Imie:null,
    Nazwisko:null,
    email:null,
    password:null,
  };

  private taskId: string|null=null;
  oldDate = new FormControl();
  oldTask = new Date();

  constructor(public tasksService: TasksService,public goalsService: GoalsService, public route: ActivatedRoute,private authService:AuthService){}


  ngOnInit() {

    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus=>{
      this.isLoading=false;
    });

    this.goals = this.goalsService.getGoals()!;
    this.userId = this.authService.getUserId();
    this.userIsAuthenticated = this.authService.getIsAuth();

    if(this.userIsAuthenticated){
      this.authService.getUser(this.authService.getUserId()).subscribe(userData=>{
        this.user.Imie = userData.Imie,
        this.user.Nazwisko = userData.Nazwisko,
        this.user.email = userData.email
      });
    }


    this.goalsSub = this.goalsService.getGoalsUpdateListener().subscribe((goals: Goal[])=>{
      this.isLoading = false;
      this.goals=goals;

      for(let goal of this.goals){
        if(this.userIsAuthenticated && this.userId == goal.creator){
          this.myGoals.push(goal);
        }
      }
    });

    this.route.paramMap.subscribe((paramMap: ParamMap)=>{
      if(paramMap.has("taskId")){
        this.mode= "edit";
        this.taskId = paramMap.get('taskId');
        this.isLoading=true;
        this.tasksService.getTask(this.taskId!).subscribe(taskData=>{
          this.isLoading=false;
          this.task = {
            id:taskData._id,
            title:taskData.title,
            content:taskData.content,
            plannedDate:taskData.plannedDate,
            creator:taskData.creator,
            isDone:taskData.isDone};

            this.oldTask = new Date(taskData.plannedDate!);
            this.oldDate.setValue(this.oldTask);

        });
      }else{
        this.mode="create";
        this.taskId=null;
      }
    });
  }
  ngOnDestroy(){
    this.authStatusSub.unsubscribe();
  }

  onSaveTask(form: NgForm){
    if(form.invalid){
      return;
    }
    this.isLoading=true;
    if(this.mode=="create"){
      this.tasksService.addTask(
        form.value.title,
        form.value.content,
        form.value.plannedDate,
        form.value.repeatable);
    }else {
      this.tasksService.updateTasks(
        this.taskId!,
        form.value.title,
        form.value.content,
        form.value.plannedDate,
        false,
        null,
        form.value.repeatable
        );
    }
      form.resetForm();
  }
}
