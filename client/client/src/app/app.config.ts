import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
     provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideHttpClient(withInterceptorsFromDi())

  ]
};



// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withInterceptorsFromDi())
//   ]
// };

// אם אתה משתמש ב-main.ts במקום:
// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { appConfig } from './app/app.config';
//
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));