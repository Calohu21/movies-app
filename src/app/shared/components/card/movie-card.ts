import { Component, input, InputSignal, output } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-movie-card',
  imports: [TmbdImagePipe, InfiniteScrollDirective, RouterLink],
  templateUrl: './movie-card.html',
  styles: ``,
})
export class MovieCard {
  movies: InputSignal<Movie[]> = input.required();
  loadMore = output();
  hasMorePages = input(true);
}
