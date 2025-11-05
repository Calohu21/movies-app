import { Component, inject, signal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
  styles: ``,
})
export class MovieList {
  movieService = inject(MovieService);

  upComingMovies = signal({});

  onSearch() {
    this.movieService.getUpComingMovies().subscribe((response) => {
      this.upComingMovies.set(response);
      console.log('MoviesListComponent: ', this.upComingMovies());
    });
  }
}
