import { inject, Pipe, PipeTransform } from '@angular/core';
import { MovieService } from '../../movies/service/movie.service';

@Pipe({
  name: 'genreNames',
})
export class GenreNamesPipe implements PipeTransform {
  private movieService = inject(MovieService);

  transform(genresIds: number[]): string {
    const genres = this.movieService.genres();

    if (!genres || !genresIds) {
      return '';
    }

    const genreNames = genresIds
      .map((id) => {
        const genre = genres.genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter((name) => name !== null);
    return genreNames.join(', ');
  }
}
