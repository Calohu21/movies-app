import { Routes } from '@angular/router';
import { MovieListPage } from './movies/pages/movie-list-page/movie-list-page';
import { MovieCard } from './shared/components/movie-card/movie-card';
import { MovieCardPage } from './movies/pages/movie-card-page/movie-card-page';

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
    path: 'movie-list',
    component: MovieListPage,
  },
  {
    path: '**',
    redirectTo: 'movie-list-card',
  },
];
