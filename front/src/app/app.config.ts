import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import {provideHttpClient, withInterceptors} from '@angular/common/http';

import { MatButtonModule } from '@angular/material/button';
import { routes } from './app.routes';
import {apiCredentialsInterceptor} from './interceptors/api-credentials.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([apiCredentialsInterceptor])),
    importProvidersFrom(MatButtonModule),
  ],
};
