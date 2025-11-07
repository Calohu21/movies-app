import { Component, input, InputSignal, output } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';
import { GenreNamesPipe } from '../../pipes/genre.names.pipe';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-list',
  imports: [TmbdImagePipe, GenreNamesPipe, InfiniteScrollDirective],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  movies: InputSignal<Movie[]> = input.required();
  hasMorePages = input(true);
  loadMore = output();
}
