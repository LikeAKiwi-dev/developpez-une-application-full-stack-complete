import { HttpInterceptorFn } from '@angular/common/http';

export const apiCredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // Code provisoire en attendant de crée ola securité coté back avec JWT
  const cloned = req.clone({ withCredentials: true });
  return next(cloned);
};
