import { Component, inject, OnInit } from '@angular/core';
import { MovieCard } from '../../../shared/components/movie-card/movie-card';
import { MovieService } from '../../service/movie.service';

@Component({
  selector: 'app-movie-card-page',
  imports: [MovieCard],
  templateUrl: './movie-card-page.html',
  styles: ``,
})
export class MovieCardPage implements OnInit {
  ngOnInit(): void {
    if (this.movies().length === 0) {
      this.movieService.getDiscoverMovies().subscribe();
    }
  }
  movieService = inject(MovieService);

  movies = this.movieService.movies;
}
