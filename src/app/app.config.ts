import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';
import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
  components: {
    button: {
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{primary.400}',
              hoverBackground: '{primary.500}',
              borderColor: '{primary.400}',
            },
          },
        },
      },
    },
    menu: {
      list: {
        padding: '0.5rem 0.9rem',
      },
      item: {
        padding: '1rem 0',
        gap: '.8rem',
        focusBackground: 'none',
      },
    },
  },
  semantic: {
    primary: {
      50: '#f0f9f2',
      100: '#dcefde',
      200: '#bbdfc1',
      300: '#8dc89b',
      400: '#68b07b',
      500: '#3b8e53',
      600: '#2a7141',
      700: '#225a35',
      800: '#1d482c',
      900: '#183c25',
      950: '#0d2115',
    },
    secundary: {
      50: '#f4f3fa',
      100: '#eceaf5',
      200: '#dcd9ec',
      300: '#c7c1e0',
      400: '#b3a7d2',
      500: '#a291c3',
      600: '#9279b2',
      700: '#7e679b',
      800: '#67557e',
      900: '#554966',
      950: '#292331',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options: {
          darkModeSelector: '.my-app-dark',
        },
      },
    }),
  ],
};
