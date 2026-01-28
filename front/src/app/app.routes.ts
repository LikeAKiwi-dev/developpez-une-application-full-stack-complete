import { Routes } from '@angular/router';
import {Home} from './pages/home/home';
import {TopicsComponent} from './pages/topics/topics';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'topics', component: TopicsComponent },
  { path: '**', redirectTo: '' }
];
