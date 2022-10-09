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

@Component({
  selector: 'app-task-create',
  templateUrl:'./task-create.component.html',
  styleUrls: ['./task-create.component.css']

})
export class TaskCreateComponent implements OnInit,OnDestroy{

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

  private taskId: string|null=null;


  constructor(public tasksService: TasksService,public goalsService: GoalsService, public route: ActivatedRoute,private authService:AuthService){}

  ngOnInit() {
    this.authStatusSub=this.authService.getAuthStatusListener().subscribe(authStatus=>{
      this.isLoading=false;
    });

    this.goals = this.goalsService.getGoals()!;
    this.userId = this.authService.getUserId();

    this.userIsAuthenticated = this.authService.getIsAuth();
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
            creator:taskData.creator};
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
        form.value.plannedDate);
    }else {
      this.tasksService.updateTasks(
        this.taskId!,
        form.value.title,
        form.value.content,
        form.value.plannedDate);
    }
      form.resetForm();
  }
}
