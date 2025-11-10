import { Routes } from '@angular/router';
import { MovieHomePage } from './movies/pages/movie-home-page/movie-home-page';
import { MovieGridPage } from './movies/pages/movie-grid-page/movie-grid-page';
import { MovieDetailPage } from './movies/pages/movie-detail.page/movie-detail.page';

export const routes: Routes = [
  {
    path: '',
    component: MovieHomePage,
  },
  {
    path: 'movies',
    component: MovieGridPage,
  },
  {
    path: 'movie-detail/:id',
    component: MovieDetailPage,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
