import {Component, OnDestroy, OnInit} from '@angular/core';


@Component({
  selector: 'app-main-page',
  styleUrls: ['main-page.component.css'],
  templateUrl: 'main-page.component.html',
})
export class MainPageComponent implements OnInit,OnDestroy{

  isLoading = true;

  ngOnInit(){
    this.isLoading = false;
  }

  ngOnDestroy(){
  }
}
