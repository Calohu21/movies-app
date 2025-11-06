import { Component, input, InputSignal } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd-image.pipe';

@Component({
  selector: 'app-movie-card',
  imports: [TmbdImagePipe],
  templateUrl: './movie-card.html',
  styles: ``,
})
export class MovieCard {
  movies: InputSignal<Movie[]> = input.required();
}
