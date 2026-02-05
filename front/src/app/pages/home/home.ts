import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class Home implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  start() {
    this.router.navigate(['/login']);
  }
}
