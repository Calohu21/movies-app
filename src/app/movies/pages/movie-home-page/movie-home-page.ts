import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { MovieCarousel } from '../../../shared/components/movie-carousel/movie-carousel';
import { Movie } from '../../models/movie.interface';
import { forkJoin } from 'rxjs';
import { CarouselConfig } from '../../models/carousel.interface';

@Component({
  selector: 'app-movie-home-page',
  imports: [MovieCarousel],
  templateUrl: './movie-home-page.html',
  styles: ``,
})
export class MovieHomePage implements OnInit {
  private movieService = inject(MovieService);

  carousels: CarouselConfig[] = [
    { id: 'popular', title: 'Películas Populares', endpoint: 'popular' },
    { id: 'top_rated', title: 'Mejor Valoradas', endpoint: 'top_rated' },
    { id: 'trending_week', title: 'Tendencias de la Semana', endpoint: 'trending_week' },
    { id: 'trending_day', title: 'Tendencias de Hoy', endpoint: 'trending_day' },
    { id: 'action', title: 'Acción', endpoint: 'genre', genreId: 28 },
    { id: 'comedy', title: 'Comedia', endpoint: 'genre', genreId: 35 },
    { id: 'drama', title: 'Drama', endpoint: 'genre', genreId: 18 },
    { id: 'scifi', title: 'Ciencia Ficción', endpoint: 'genre', genreId: 878 },
    { id: 'horror', title: 'Terror', endpoint: 'genre', genreId: 27 },
    { id: 'romance', title: 'Romance', endpoint: 'genre', genreId: 10749 },
  ];

  carouselMovies = signal<Map<string, Movie[]>>(new Map());

  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAllCarousels();
  }

  private loadAllCarousels(): void {
    this.isLoading.set(true);

    const requests = this.carousels.map((config) => {
      return this.MoviesForCarousel(config);
    });

    forkJoin(requests).subscribe({
      next: (results) => {
        const moviesMap = new Map<string, Movie[]>();
        this.carousels.forEach((config, index) => {
          moviesMap.set(config.id, results[index]);
        });

        this.carouselMovies.set(moviesMap);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar carruseles:', error);
        this.isLoading.set(false);
      },
    });
  }

  private MoviesForCarousel(config: CarouselConfig) {
    switch (config.endpoint) {
      case 'popular':
        return this.movieService.getPopularMovies(1);
      case 'top_rated':
        return this.movieService.getTopRatedMovies(1);
      case 'trending_day':
        return this.movieService.getTrendingDay(1);
      case 'trending_week':
        return this.movieService.getTrendingWeek(1);
      case 'genre':
        return this.movieService.getMoviesByGenre(config.genreId!, 1);
      default:
        return this.movieService.getPopularMovies(1);
    }
  }

  getMoviesForCarousel(carouselId: string): Movie[] {
    return this.carouselMovies().get(carouselId) || [];
  }

  onViewMore(config: CarouselConfig): void {
    console.log('Ver más:', config.title);
  }
}
