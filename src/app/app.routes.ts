import { Routes } from '@angular/router';
import { MovieHomePage } from './movies/pages/movie-home-page/movie-home-page';
import { MovieCardPage } from './movies/pages/movie-card-page/movie-card-page';
import { MovieDetailPage } from './movies/pages/movie-detail.page/movie-detail.page';

export const routes: Routes = [
  {
    path: '',
    component: MovieCardPage,
  },
  {
    path: 'movie-list-card',
    component: MovieCardPage,
  },
  {
    path: 'movie-home',
    component: MovieHomePage,
  },
  {
    path: 'movie-detail/:id',
    component: MovieDetailPage,
  },
  {
    path: '**',
    redirectTo: 'movie-list-card',
  },
];
