import { Component, inject, signal, WritableSignal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { Movie } from '../../models/movie.interface';

@Component({
  selector: 'app-movie-list',
  imports: [],
  templateUrl: './movie-list.html',
  styles: ``,
})
export class MovieList {
  movieService = inject(MovieService);

  upComingMovies: WritableSignal<Movie[]> = signal([]);

  onSearch() {
    this.movieService.getUpComingMovies().subscribe((response) => {
      this.upComingMovies.set(response);
      console.log('MoviesListComponent: ', this.upComingMovies());
    });
  }
}
