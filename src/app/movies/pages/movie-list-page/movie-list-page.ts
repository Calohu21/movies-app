import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { Movie } from '../../models/movie.interface';
import { List } from '../../../shared/components/lis-component/list';

@Component({
  selector: 'app-movie-list',
  imports: [List],
  templateUrl: './movie-list-page.html',
  styles: ``,
})
export class MovieListPage implements OnInit {
  ngOnInit(): void {
    this.getMovies();
  }
  movieService = inject(MovieService);

  discoverMovies: WritableSignal<Movie[]> = signal([]);

  getMovies() {
    this.movieService.getDiscoverMovies().subscribe((response) => {
      this.discoverMovies.set(response.results);
    });
  }
}
