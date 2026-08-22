import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const mensajeError =
        error.status === 0
          ? 'Error de conexión: El servidor (API Gateway) no responde. Verifica que esté encendido.'
          : `El servidor devolvió el código ${error.status}: ${error.message}`;

      console.error('[Interceptor HTTP]', mensajeError);

      return throwError(() => new Error(mensajeError));
    }),
  );
};
