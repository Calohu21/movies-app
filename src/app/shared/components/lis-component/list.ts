import { Component, input, InputSignal } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';
import { GenreNamesPipe } from '../../pipes/genre.names.pipe';

@Component({
  selector: 'app-list',
  imports: [TmbdImagePipe, GenreNamesPipe],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  discoverMovies: InputSignal<Movie[]> = input.required();
}
