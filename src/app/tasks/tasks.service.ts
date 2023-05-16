import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../tasks/task.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.prod';

const BACKEND_URL = environment.apiUrl + '/tasks';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private tasks: Task[] = [];
  private tasksUpdated = new Subject<Task[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getTasks() {
    this.http
      .get<{ message: string; tasks: any }>(BACKEND_URL + '/')
      .pipe(
        map((taskData) => {
          return taskData.tasks.map(
            (task: {
              _id: any;
              title: any;
              content: any;
              plannedDate: any;
              creator: any;
              isDone: any;
              taskComplitionDate: any;
              repeatable: any;
            }) => {
              return {
                id: task._id,
                title: task.title,
                content: task.content,
                plannedDate: task.plannedDate,
                creator: task.creator,
                isDone: task.isDone,
                taskComplitionDate: task.taskComplitionDate,
                repeatable: task.repeatable,
              };
            }
          );
        })
      )
      .subscribe((transformedTasks) => {
        this.tasks = transformedTasks;
        this.tasksUpdated.next([...this.tasks]);
      });
  }
  getTasksUpdateListener() {
    return this.tasksUpdated.asObservable();
  }
  getTask(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      plannedDate: Date;
      creator: string;
      isDone: boolean;
      taskComplitionDate: Date;
      repeatable: boolean;
    }>(BACKEND_URL + '/' + id);
  }

  addTask(
    title: string,
    content: string,
    plannedDate: Date,
    repeatable: boolean
  ) {
    const task: Task = {
      id: null,
      title: title,
      content: content,
      plannedDate: plannedDate,
      creator: null,
      isDone: false,
      taskComplitionDate: null,
      repeatable: repeatable,
    };

    this.http
      .post<{ message: string; taskId: string }>(BACKEND_URL + '/', task)
      .subscribe((responseData) => {
        const id = responseData.taskId;
        task.id = id;
        this.tasks.push(task);
        this.tasksUpdated.next([...this.tasks]);
        this.router.navigate(['/profile/todayTasks']);
      });
  }

  updateTasks(
    id: string,
    title: string,
    content: string,
    plannedDate: Date,
    isDone: boolean,
    taskComplitionDate: Date | null,
    repeatable: boolean
  ) {
    const task: Task = {
      id: id,
      title: title,
      content: content,
      plannedDate: plannedDate,
      creator: null,
      isDone: isDone,
      taskComplitionDate: taskComplitionDate,
      repeatable: repeatable,
    };

    this.http.put(BACKEND_URL + '/' + id, task).subscribe((response) => {
      const updatedTasks = [...this.tasks];
      const oldTaskIndex = updatedTasks.findIndex((p) => p.id === task.id);
      updatedTasks[oldTaskIndex] = task;
      this.tasks = updatedTasks;
      this.tasksUpdated.next([...this.tasks]);
    });
  }

  deleteTask(taskId: string) {
    this.http.delete(BACKEND_URL + '/' + taskId).subscribe(() => {
      const updatedTasks = this.tasks.filter((task) => task.id !== taskId);
      this.tasks = updatedTasks;
      this.tasksUpdated.next([...this.tasks]);
    });
  }

  getTasksScroll(page: number, id: string): Observable<any> {
    return this.http.get(
      BACKEND_URL + '/scroll/' + id + `?page=${page}`
    ) as Observable<any>;
  }
}
