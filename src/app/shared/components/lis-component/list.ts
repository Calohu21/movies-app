import { Component, input, InputSignal } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';

@Component({
  selector: 'app-list',
  imports: [],
  templateUrl: './list.html',
  styles: ``,
})
export class List {
  discoverMovies: InputSignal<Movie[]> = input.required();
}
