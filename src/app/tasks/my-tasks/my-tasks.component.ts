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
  todayTasks:Task[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;

  constructor(public tasksService: TasksService,private authService: AuthService){}


  private tasksSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;;

  ngOnInit(){
    this.isLoading = true;
    this.tasksService.getTasks();

    this.userId = this.authService.getUserId();
    this.tasksSub = this.tasksService.getTasksUpdateListener().subscribe((tasks: Task[])=>{
      this.isLoading = false;
      this.tasks=tasks;
      const today = new Date();

      for(let task of this.tasks){
        var todayDate = new Date(task.plannedDate!);
        if(todayDate.getDate() == today.getDate()){
          console.log(today.getDay());
          console.log(today.getMonth());
          console.log(today.getFullYear());

          console.log(todayDate.getDay());
          console.log(todayDate.getMonth());
          console.log(todayDate.getFullYear());
          this.todayTasks.push(task);
        }
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
  ngOnDestroy(){
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


}
