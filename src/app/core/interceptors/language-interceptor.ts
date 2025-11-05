import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes(environment.tmdbUrl)) {
    const modifiedReq = req.clone({
      setParams: {
        language: 'es-ES',
      },
    });

    return next(modifiedReq);
  }

  return next(req);
};
