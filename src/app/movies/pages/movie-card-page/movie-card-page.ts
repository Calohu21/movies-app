import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MovieCard } from '../../../shared/components/movie-card/movie-card';
import { Movie } from '../../models/movie.interface';
import { MovieService } from '../../service/movie.service';

@Component({
  selector: 'app-movie-card-page',
  imports: [MovieCard],
  templateUrl: './movie-card-page.html',
  styles: ``,
})
export class MovieCardPage implements OnInit {
  ngOnInit(): void {
    this.getMovies();
  }
  movieService = inject(MovieService);

  Movies: WritableSignal<Movie[]> = signal([]);

  getMovies() {
    this.movieService.getDiscoverMovies().subscribe((response) => {
      this.Movies.set(response.results);
      console.log('MOVIES: ', this.Movies());
    });
  }
}
