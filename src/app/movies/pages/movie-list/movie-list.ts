import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { Movie } from '../../models/movie.interface';
import { List } from '../../../shared/components/lis-component/list';

@Component({
  selector: 'app-movie-list',
  imports: [List],
  templateUrl: './movie-list.html',
  styles: ``,
})
export class MovieList implements OnInit {
  ngOnInit(): void {
    this.onSearch();
  }
  movieService = inject(MovieService);

  discoverMovies: WritableSignal<Movie[]> = signal([]);

  onSearch() {
    this.movieService.getDiscoverMovies().subscribe((response) => {
      this.discoverMovies.set(response.results);
      console.log('MoviesListComponent: ', this.discoverMovies());
    });
  }
}
