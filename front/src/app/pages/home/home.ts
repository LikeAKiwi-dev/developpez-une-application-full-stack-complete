import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [MatButtonModule, RouterLink, NgOptimizedImage],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  start() {
    this.router.navigate(['/login']);
  }
}
