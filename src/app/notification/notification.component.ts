import { animate, state, style, transition, trigger } from "@angular/animations";
import { Component, Inject, Injectable, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector:'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
@Injectable({providedIn: 'root'})
export class NotificationComponent{
  constructor(
    public dialogRef: MatDialogRef<NotificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {content:string},
  ) {}
}
