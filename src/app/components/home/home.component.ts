import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  router;

	static get parameters() {
		return [ Router ];
  }
  constructor(router) {
    this.router = router;
  }

  ngOnInit() {
  }

}
