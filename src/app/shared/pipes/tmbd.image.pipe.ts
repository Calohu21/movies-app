import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tmdbImage',
})
export class TmbdImagePipe implements PipeTransform {
  private readonly baseUrl = 'https://image.tmdb.org/t/p/';

  transform(posterPath: string | null, size: string = 'w500'): string {
    if (!posterPath) {
      return 'assets/placeholder-movie.png';
    }
    return `${this.baseUrl}${size}${posterPath}`;
  }
}
