import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Task } from "../tasks/task.model";
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import { Router } from "@angular/router";
import {environment} from "../../environments/environment.prod";

const BACKEND_URL = environment.apiUrl+"/tasks/";

@Injectable({providedIn: 'root'})
export class TasksService{
  private tasks: Task[]=[];
  private tasksUpdated = new Subject<Task[]>();



  constructor(private http: HttpClient,private router: Router){}

  getTasks(){
    this.http.get<{message:string,tasks:any}>(BACKEND_URL).pipe(map((taskData)=>{
        return taskData.tasks.map((task: {
                 _id: any;
                 title: any;
                 content:any;
                 plannedDate:any;
                 creator: any})=>{
          return {
              id: task._id,
              title: task.title,
              content: task.content,
              plannedDate: task.plannedDate,
              creator: task.creator
          };
        });
    })).subscribe((transformedTasks)=>{
      this.tasks = transformedTasks;
      this.tasksUpdated.next([...this.tasks]);
    });
  }
  getTasksUpdateListener(){
    return this.tasksUpdated.asObservable();
  }
  getTask(id:string){
    return this.http.get<{
      _id:string,
      title:string,
      content:string,
      plannedDate:Date,
      creator:string}>(BACKEND_URL+id);
  }

  addTask(
     title: string,
     content: string,
     plannedDate:Date
     ){

    const task: Task = {
      id:null,
      title:title,
      content:content,
      plannedDate:plannedDate,
      creator:null};

    this.http.post<{message: string, taskId: string}>(BACKEND_URL,task).subscribe((responseData)=>{
      const id = responseData.taskId;
      task.id = id;
      this.tasks.push(task);
      this.tasksUpdated.next([...this.tasks]);
      this.router.navigate(["/"]);
    });
  }

  updateTasks(
    id:string,
    title:string,
    content:string,
    plannedDate:Date){
    const task: Task = {
      id:id,
      title:title,
      content:content,
      plannedDate:plannedDate,
      creator:null};

    this.http.put(BACKEND_URL+id,task).subscribe(response=>{
      const updatedTasks = [...this.tasks];
      const oldTaskIndex = updatedTasks.findIndex(p=>p.id === task.id);
      updatedTasks[oldTaskIndex]=task;
      this.tasks=updatedTasks;
      this.tasksUpdated.next([...this.tasks]);
      this.router.navigate(["/"]);
    });
  }

  deleteTask(taskId:string){
    this.http.delete(BACKEND_URL+taskId).subscribe(()=>{
      const updatedTasks = this.tasks.filter(task=>task.id !== taskId);
      this.tasks = updatedTasks;
      this.tasksUpdated.next([...this.tasks]);
    });
  }

}
