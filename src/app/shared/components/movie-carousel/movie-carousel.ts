import { Component, inject, input, output } from '@angular/core';
import { CarouselConfig } from '../../../movies/models/carousel.interface';
import { Movie } from '../../../movies/models/movie.interface';
import { Router } from '@angular/router';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';

@Component({
  selector: 'app-movie-carousel',
  imports: [TmbdImagePipe],
  templateUrl: './movie-carousel.html',
  styles: ``,
})
export class MovieCarousel {
  config = input.required<CarouselConfig>();
  movies = input.required<Movie[]>();
  isLoading = input<boolean>(false);
  viewMore = output<CarouselConfig>();
  router = inject(Router);

  handleViewMore(): void {
    const conf = this.config();
    this.viewMore.emit(conf);
    this.navigateToGrid(conf);
  }

  private navigateToGrid(config: CarouselConfig): void {
    const queryParams: any = {};

    switch (config.endpoint) {
      case 'popular':
        queryParams.filter = 'popular';
        break;
      case 'top_rated':
        queryParams.filter = 'top_rated';
        break;
      case 'trending_day':
        queryParams.filter = 'trending';
        queryParams.window = 'day';
        break;
      case 'trending_week':
        queryParams.filter = 'trending';
        queryParams.window = 'week';
        break;
      case 'genre':
        queryParams.genre = config.genreId;
        break;
    }

    this.router.navigate(['/movies'], { queryParams });
  }

  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movie-detail', movieId]);
  }
}
