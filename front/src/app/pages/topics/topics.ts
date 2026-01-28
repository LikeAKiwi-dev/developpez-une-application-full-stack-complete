import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TopicService } from '../../services/topic.service';
import { Topic } from '../../models/topic.model';
import {finalize} from 'rxjs';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topics.html',
  styleUrl: './topics.scss',
})
export class TopicsComponent implements OnInit {
  topics: Topic[] = [];
  error = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(private topicService: TopicService) {}

  ngOnInit(): void {
    this.topicService.getAll()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((data: Topic[]) => this.topics = data);
  }
}
