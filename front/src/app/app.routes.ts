import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TopicsComponent } from './pages/topics/topics';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { PostCreateComponent } from './pages/post-create/post-create';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { RegisterComponent} from './pages/register/register'

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'topics', component: TopicsComponent },
  { path: 'feed', component: FeedComponent },
  { path: 'posts/new', component: PostCreateComponent },
  { path: 'posts/:id', component: PostDetailComponent },
  { path: '**', redirectTo: '' }
];
