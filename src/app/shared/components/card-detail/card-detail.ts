import { Component, input } from '@angular/core';
import { DetailMovie } from '../../../movies/models/detail-movie.interface';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';

@Component({
  selector: 'app-card-detail',
  imports: [TmbdImagePipe],
  templateUrl: './card-detail.html',
  styles: ``,
})
export class CardDetail {
  movie = input<DetailMovie | null | undefined>(null);
  hasError = input<boolean>(false);
  isLoading = input<boolean>(false);
}
