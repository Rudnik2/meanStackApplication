import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { TasksService } from '../tasks/tasks.service';
import { AuthService } from '../auth/auth.service';
import { Task } from '../tasks/task.model';
import { Router } from "@angular/router";

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['calendar.component.css'],
  templateUrl: 'calendar.component.html',
})
export class CalendarComponent implements OnInit,OnDestroy{
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  task:Task={
    id: null,
    title: null,
    content:null,
    plannedDate:null,
    creator:null,
    isDone:false,
    taskComplitionDate:null
  };

  viewDate: Date = new Date();

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.editEvent(event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.deleteEvent(event);

      },
    },
    {
      label: '<i class="fas fa-fw fa-award"></i>',
      a11yLabel: 'Complete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.completeEvent(event);
      },
    },
  ];

  refresh = new Subject<void>();
  activeDayIsOpen: boolean = false;
  events: CalendarEvent[]=[];
  tasks:Task[] = [];
  todayTasks:Task[] = [];
  isLoading = false;
  userIsAuthenticated = false;
  userId!: string;
  myTasks: Task[] = [];
  date = new Date();


  constructor(private modal: NgbModal,public tasksService: TasksService, private authService: AuthService,private router: Router) {}

  private tasksSub: Subscription = new Subscription;
  private authStatusSub: Subscription = new Subscription;

  ngOnInit(){
    this.isLoading = true;
    this.tasksService.getTasks();

    this.userId = this.authService.getUserId();
    this.tasksSub = this.tasksService.getTasksUpdateListener().subscribe((tasks: Task[])=>{
      this.isLoading = false;
      this.tasks=tasks;

      for(let task of this.tasks){
        if(this.userIsAuthenticated && this.userId==task.creator&&task.isDone!=true){
          this.myTasks.push(task);
        }
      }

      for(let task of this.myTasks){
        this.date = new Date(task.plannedDate!);
        this.events.push({
          id:task.id!,
          start:this.date,
          title:task.content!,
          color: { ...colors.red },
          actions: this.actions,
          allDay:true
        });
      }
      this.refresh.next();
    });
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuthenticated=>{
       this.userIsAuthenticated = isAuthenticated;
       this.userId = this.authService.getUserId();
    });
  }

  ngOnDestroy(){
    this.tasksSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.tasksService.deleteTask(eventToDelete.id!);
    this.events = this.events.filter((event) => event !== eventToDelete);
    //this.activeDayIsOpen = false;
    this.ngOnDestroy();
  }
  completeEvent(eventToComplete: CalendarEvent) {

    this.tasksService.getTask(eventToComplete.id!).subscribe(taskData=>{
      this.task.id = taskData._id,
      this.task.title = taskData.title,
      this.task.content = taskData.content,
      this.task.plannedDate = taskData.plannedDate
      this.task.repeatable = taskData.repeatable

      const now = new Date();
      this.tasksService.updateTasks(this.task.id,this.task.title,this.task.content,this.task.plannedDate,true,now,this.task.repeatable);
    });
    this.events = this.events.filter((event) => event !== eventToComplete);
      this.ngOnDestroy();
  }
  editEvent(eventToEdit: CalendarEvent) {
    this.router.navigate(["/task/edit/",eventToEdit.id]);
  }
  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
