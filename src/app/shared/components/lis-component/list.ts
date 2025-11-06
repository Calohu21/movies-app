import { Component, input, InputSignal } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd-image.pipe';

@Component({
  selector: 'app-list',
  imports: [TmbdImagePipe],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  discoverMovies: InputSignal<Movie[]> = input.required();
}
