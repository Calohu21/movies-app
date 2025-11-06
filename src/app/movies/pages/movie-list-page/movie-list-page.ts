import { Component, inject, OnInit } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { List } from '../../../shared/components/lis-component/list';

@Component({
  selector: 'app-movie-list',
  imports: [List],
  templateUrl: './movie-list-page.html',
  styles: ``,
})
export class MovieListPage implements OnInit {
  private movieService = inject(MovieService);

  ngOnInit(): void {
    if (this.movies().length === 0) {
      this.movieService.getDiscoverMovies().subscribe();
    }
  }
  movies = this.movieService.movies;
}
