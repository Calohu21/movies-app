import { Component, inject, OnInit } from '@angular/core';
import { MovieCard } from '../../../shared/components/card/movie-card';
import { MovieService } from '../../service/movie.service';

@Component({
  selector: 'app-movie-card-page',
  imports: [MovieCard],
  templateUrl: './movie-card-page.html',
  styles: ``,
})
export class MovieCardPage implements OnInit {
  private movieService = inject(MovieService);
  movies = this.movieService.displayMovies;
  hasMorePages = this.movieService.hasMorePages;
  isSearchActive = this.movieService.isSearchActive;

  ngOnInit(): void {
    if (this.movies().length === 0 && !this.isSearchActive()) {
      this.movieService.getDiscoverMovies().subscribe();
    }
  }

  onLoadMore(): void {
    if (this.isSearchActive()) {
      this.movieService.loadNextSearchPage().subscribe();
    } else {
      this.movieService.loadNextPage().subscribe();
    }
  }
}
