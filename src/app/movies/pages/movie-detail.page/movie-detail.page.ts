import { Component, inject, linkedSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../service/movie.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { CardDetail } from '../../../shared/components/card-detail/card-detail';

@Component({
  selector: 'app-movie-detail.page',
  imports: [CardDetail],
  templateUrl: './movie-detail.page.html',
  styles: ``,
})
export class MovieDetailPage {
  private movieService = inject(MovieService);
  private activatedRoute = inject(ActivatedRoute);

  private routeIdParam = this.activatedRoute.snapshot.paramMap.get('id') ?? '';

  selectMovieId = linkedSignal<number>(() => this.validatedMovieId(this.routeIdParam));

  validatedMovieId(param: string): number {
    const id = Number(param);
    return isNaN(id) || id <= 0 ? 0 : id;
  }

  movieResource = rxResource({
    params: () => this.selectMovieId(),
    stream: ({ params: movieId }) => {
      if (!movieId) return of(null);

      return this.movieService.getMovieDetails(movieId);
    },
  });
}
