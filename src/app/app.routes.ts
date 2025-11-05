import { Routes } from '@angular/router';
import { MovieList } from './movies/pages/movie-list/movie-list';

export const routes: Routes = [
  {
    path: '',
    component: MovieList,
  },
  {
    path: 'movie-list',
    component: MovieList,
  },
];
