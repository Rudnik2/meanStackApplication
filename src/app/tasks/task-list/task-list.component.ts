import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth-data.model';
import { AuthService } from 'src/app/auth/auth.service';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  users: AuthData[] = [];
  pager = {};

  task: Task = {
    id: null,
    title: null,
    content: null,
    plannedDate: null,
    creator: null,
    creatorName: null,
    isDone: false,
    taskComplitionDate: null,
  };
  todayTasks: Task[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  today: Date;
  taskDate: Date;
  page = 1;

  constructor(
    public tasksService: TasksService,
    private authService: AuthService
  ) {}

  private tasksSub: Subscription = new Subscription();
  private authStatusSub: Subscription = new Subscription();

  ngOnInit() {
    this.isLoading = true;
    this.tasksService.getTasks();

    this.userId = this.authService.getUserId();
    this.tasksService
      .getTasksScroll(this.page, this.authService.getUserId())
      .subscribe((x) => {
        this.isLoading = false;
        this.pager = x.pager;
        this.tasks = x.pageOfItems;
        console.log(this.tasks);

        this.authService.getUsers();
        this.userId = this.authService.getUserId();

        this.authStatusSub = this.authService
          .getUsersUpdateListener()
          .subscribe((users: AuthData[]) => {
            this.users = users;

            for (let task of this.tasks) {
              for (let user of this.users) {
                if (task.creator == user.id) {
                  console.log(user.Imie);
                  task.creatorName = user.Imie;
                }
              }
            }
          });
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onDelete(taskId: string) {
    this.tasksService.deleteTask(taskId);
  }

  completeTask(taskId: string) {
    this.tasksService.getTask(taskId).subscribe((taskData) => {
      (this.task.id = taskData._id),
        (this.task.title = taskData.title),
        (this.task.content = taskData.content),
        (this.task.plannedDate = taskData.plannedDate),
        (this.task.repeatable = taskData.repeatable);

      const now = new Date();
      this.tasksService.updateTasks(
        this.task.id,
        this.task.title,
        this.task.content,
        this.task.plannedDate,
        true,
        now,
        this.task.repeatable
      );
    });
  }

  ngOnDestroy() {
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
  onScroll(): void {
    this.tasksService
      .getTasksScroll(++this.page, this.authService.getUserId())
      .subscribe((x) => {
        if (this.tasks.length != x.pager.totalItems) {
          this.authService.getUsers();
          this.userId = this.authService.getUserId();

          this.authStatusSub = this.authService
            .getUsersUpdateListener()
            .subscribe((users: AuthData[]) => {
              this.users = users;

              for (let task of x.pageOfItems) {
                this.taskDate = new Date(task.plannedDate!);
                task.plannedDate = this.taskDate;
                for (let user of this.users) {
                  if (task.creator == user.id) {
                    task.creatorImage = user.imagePath;
                    task.creatorName = user.Imie;
                  }
                }
              }
            });
          this.tasks.push(...x.pageOfItems);
        }
      });
  }
}
