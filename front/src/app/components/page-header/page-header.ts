import {Component, Input} from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'page-header',
  imports: [],
  templateUrl: './page-header.html',
  styleUrl: './page-header.scss',
})
export class PageHeaderComponent {
  @Input() title: string = "";
  @Input() btnBack: boolean = true;

  constructor(
    private location: Location
  ) {}

  protected goBack() {
    this.location.back();
  }
}
