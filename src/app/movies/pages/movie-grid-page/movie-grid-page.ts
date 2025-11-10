import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MovieCard } from '../../../shared/components/card/movie-card';
import { MovieService } from '../../service/movie.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-movie-grid-page',
  imports: [MovieCard],
  templateUrl: './movie-grid-page.html',
  styles: ``,
})
export class MovieGridPage implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  filter = signal<string | null>(null);
  window = signal<string | null>(null);
  genreId = signal<number | null>(null);

  movies = this.movieService.displayMovies;
  hasMorePages = this.movieService.hasMorePages;
  isSearchActive = this.movieService.isSearchActive;

  pageTitle = computed(() => {
    const filterType = this.filter();
    const genreIdValue = this.genreId();

    if (this.isSearchActive()) {
      return 'Resultados de búsqueda';
    }

    if (filterType === 'popular') {
      return 'Películas Populares';
    }

    if (filterType === 'top_rated') {
      return 'Mejor Valoradas';
    }

    if (filterType === 'trending') {
      const windowType = this.window();
      return windowType === 'day' ? 'Tendencias de Hoy' : 'Tendencias de la Semana';
    }

    if (genreIdValue) {
      const genres = this.movieService.genres()?.genres || [];
      const genre = genres.find((g) => g.id === genreIdValue);
      return genre ? `Películas de ${genre.name}` : 'Películas';
    }

    return 'Todas las Películas';
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.filter.set(params['filter'] || null);
      this.window.set(params['window'] || null);
      const genreParam = params['genre'];
      this.genreId.set(genreParam ? parseInt(genreParam, 10) : null);
      this.loadMovies();
    });
  }

  private loadMovies(): void {
    const filterType = this.filter();
    const windowType = this.window();
    const genreIdValue = this.genreId();

    if (this.isSearchActive()) {
      return;
    }

    if (filterType === 'popular') {
      this.movieService.getPopularMovies(1).subscribe();
    } else if (filterType === 'top_rated') {
      this.movieService.getTopRatedMovies(1).subscribe();
    } else if (filterType === 'trending') {
      const time = windowType === 'day' ? 'day' : 'week';
      this.movieService.getTrendingMovies(time, 1).subscribe();
    } else if (genreIdValue) {
      this.movieService.setGenreFilter(genreIdValue);
      this.movieService.getDiscoverMovies(1).subscribe();
    } else {
      this.movieService.getDiscoverMovies(1).subscribe();
    }
  }

  onLoadMore(): void {
    const filterType = this.filter();
    const windowType = this.window();

    if (this.isSearchActive()) {
      this.movieService.loadNextSearchPage().subscribe();
      return;
    }

    if (filterType === 'popular') {
    } else if (filterType === 'top_rated') {
    } else if (filterType === 'trending') {
    } else {
      this.movieService.loadNextPage().subscribe();
    }
  }
}
