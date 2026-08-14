import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensajeError = 'Ocurrió un error inesperado.';

      if (error.status === 0) {
        mensajeError = 'Error de conexión: El servidor (API Gateway) no responde. Verifica que esté encendido.';
      } else {
        mensajeError = `El servidor devolvió el código ${error.status}: ${error.message}`;
      }

      console.error('[Interceptor HTTP]', mensajeError);

      return throwError(() => new Error(mensajeError));
    })
  );
};