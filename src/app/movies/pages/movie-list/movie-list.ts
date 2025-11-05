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

  discoverMovies: WritableSignal<Movie[]> = signal([]);

  onSearch() {
    this.movieService.getDiscoverMovies().subscribe((response) => {
      this.discoverMovies.set(response.results);
      console.log('MoviesListComponent: ', this.discoverMovies());
    });
  }
}
