import { Component,OnDestroy,OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/auth/auth.service";
import { Task } from "../task.model";
import { TasksService } from "../tasks.service";


@Component({
  selector:'app-my-tasks',
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.css']
})

export class MyTasksComponent implements OnInit,OnDestroy{

  tasks:Task[] = [];

  task:Task={
    id: null,
    title: null,
    content:null,
    plannedDate:null,
    creator:null,
    isDone:false,
    taskComplitionDate:null
  };
  todayTasks:Task[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  today: Date;
  taskDate: Date;

  constructor(public tasksService: TasksService,private authService: AuthService){}


  private tasksSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  ngOnInit(){
    this.isLoading = true;
    this.tasksService.getTasks();

    this.userId = this.authService.getUserId();
    this.tasksSub = this.tasksService.getTasksUpdateListener().subscribe((tasks: Task[])=>{
      this.isLoading = false;
      this.tasks=tasks;
      this.today = new Date();
      for(let task of this.tasks){
        this.taskDate = new Date(task.plannedDate!);
        task.plannedDate = this.taskDate;
      }
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUserId();
    });
  }

  onDelete(taskId: string){
    this.tasksService.deleteTask(taskId);
  }

  completeTask(taskId: string){

    this.tasksService.getTask(taskId).subscribe(taskData=>{
      this.task.id = taskData._id,
      this.task.title = taskData.title,
      this.task.content = taskData.content,
      this.task.plannedDate = taskData.plannedDate
      this.task.repeatable = taskData.repeatable

      const now = new Date();
      this.tasksService.updateTasks(this.task.id,this.task.title,this.task.content,this.task.plannedDate,true,now,this.task.repeatable);
    });
  }

  ngOnDestroy(){
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
