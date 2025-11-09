import { Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { List } from '../../../shared/components/list/list';

@Component({
  selector: 'app-movie-list',
  imports: [List],
  templateUrl: './movie-list-page.html',
  styles: ``,
})
export class MovieListPage implements OnInit {
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
