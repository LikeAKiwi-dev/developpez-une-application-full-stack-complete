import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { TopicsComponent } from './pages/topics/topics';
import { LoginComponent } from './pages/login/login';
import { FeedComponent } from './pages/feed/feed';
import { PostCreateComponent } from './pages/post-create/post-create';
import { PostDetailComponent } from './pages/post-detail/post-detail';
import { RegisterComponent} from './pages/register/register'
import { AuthGuard } from './guards/auth-guard';
import { GuestGuard } from './guards/guest-guard';
import { MeComponent } from './pages/me/me';



export const routes: Routes = [
  { path: '',
    component: Home,
    canActivate: [GuestGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'topics',
    component: TopicsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'feed',
    component: FeedComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/new',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'posts/:id',
    component: PostDetailComponent,
    canActivate: [AuthGuard]
  },
  { path: 'me',
    component: MeComponent,
    canActivate: [AuthGuard]
  },

  { path: '**', redirectTo: '' }
];
