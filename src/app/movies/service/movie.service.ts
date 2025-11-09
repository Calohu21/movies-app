import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie.interface';
import { GenreResponse } from '../models/genre.interface';
import { DetailMovie } from '../models/detail-movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.tmdbUrl;
  private readonly apiKey = environment.tmdbApiKey;

  private readonly genresCache = signal<GenreResponse | null>(null);
  public readonly genres = this.genresCache.asReadonly();

  private readonly moviesCacheByPage = signal<Map<number, Movie[]>>(new Map());

  private readonly currentPageCache = signal<number>(1);
  public readonly currentPage = this.currentPageCache.asReadonly();

  private readonly totalPagesCache = signal<number>(0);
  public readonly totalPages = this.totalPagesCache.asReadonly();

  private readonly movieDetailCache = signal<Map<number, DetailMovie>>(new Map());
  public readonly movieDetail = this.movieDetailCache.asReadonly();

  private readonly searchQueryCache = signal<string>('');
  public readonly searchQuery = this.searchQueryCache.asReadonly();

  private readonly searchResultsByPage = signal<Map<number, Movie[]>>(new Map());

  private readonly searchCurrentPageCache = signal<number>(1);
  private readonly searchTotalPagesCache = signal<number>(0);

  private readonly isSearchModeCache = signal<boolean>(false);
  public readonly isSearchActive = this.isSearchModeCache.asReadonly();

  public readonly hasMorePages = computed(() => {
    if (this.isSearchModeCache()) {
      return this.searchCurrentPageCache() < this.searchTotalPagesCache();
    }
    return this.currentPageCache() < this.totalPagesCache();
  });

  public readonly allMovies = computed(() => {
    const cache = this.moviesCacheByPage();
    const movies: Movie[] = [];
    const seenIds = new Set<number>();
    const sortedPages = Array.from(cache.keys()).sort((a, b) => a - b);

    for (const page of sortedPages) {
      const pageMovies = cache.get(page) || [];

      for (const movie of pageMovies) {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          movies.push(movie);
        }
      }
    }
    return movies;
  });

  private readonly allSearchResults = computed(() => {
    const cache = this.searchResultsByPage();
    const movies: Movie[] = [];
    const seenIds = new Set<number>();
    const sortedPages = Array.from(cache.keys()).sort((a, b) => a - b);

    for (const page of sortedPages) {
      const pageMovies = cache.get(page) || [];

      for (const movie of pageMovies) {
        if (!seenIds.has(movie.id)) {
          seenIds.add(movie.id);
          movies.push(movie);
        }
      }
    }
    return movies;
  });

  public readonly displayMovies = computed(() => {
    if (this.isSearchModeCache()) {
      return this.allSearchResults();
    }
    return this.allMovies();
  });

  getDiscoverMovies(page: number = 1): Observable<Movie[]> {
    const cache = this.moviesCacheByPage();
    if (cache.has(page)) {
      return of(cache.get(page)!);
    }

    return this.http
      .get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
          page: page.toString(),
        },
      })
      .pipe(
        tap((resp) => {
          const newCache = new Map(cache);
          newCache.set(page, resp.results);
          this.moviesCacheByPage.set(newCache);
          this.totalPagesCache.set(resp.total_pages);

          if (page > this.currentPageCache()) {
            this.currentPageCache.set(page);
          }
        }),
        map((resp) => resp.results),
      );
  }

  getMovieDetails(movieId: number): Observable<DetailMovie> {
    const cache = this.movieDetailCache();
    if (cache.has(movieId)) {
      return of(cache.get(movieId)!);
    }

    return this.http
      .get<DetailMovie>(`${this.apiUrl}/movie/${movieId}`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .pipe(
        tap((movieDetail) => {
          const newCache = new Map(cache);
          newCache.set(movieId, movieDetail);
          this.movieDetailCache.set(newCache);
        }),
      );
  }

  loadNextPage(): Observable<Movie[]> {
    const nextPage = this.currentPageCache() + 1;

    if (this.totalPagesCache() > 0 && nextPage > this.totalPagesCache()) {
      return of([]);
    }

    return this.getDiscoverMovies(nextPage);
  }

  getGenres(): Observable<GenreResponse> {
    const cached = this.genresCache();
    if (cached !== null) {
      return of(cached);
    }

    return this.http
      .get<GenreResponse>(`${this.apiUrl}/genre/movie/list`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .pipe(tap((genres) => this.genresCache.set(genres)));
  }

  searchMovies(query: string, page: number = 1): Observable<Movie[]> {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      this.clearSearch();
      return of([]);
    }

    return this.http
      .get<MovieResponse>(`${this.apiUrl}/search/movie`, {
        params: {
          api_key: this.apiKey,
          query: trimmedQuery,
          page: page.toString(),
        },
      })
      .pipe(
        tap((resp) => {
          // Update search query and mode
          this.searchQueryCache.set(trimmedQuery);
          this.isSearchModeCache.set(true);

          // Update search results cache
          const newCache = new Map(this.searchResultsByPage());
          newCache.set(page, resp.results);
          this.searchResultsByPage.set(newCache);

          // Update pagination
          this.searchTotalPagesCache.set(resp.total_pages);
          if (page > this.searchCurrentPageCache()) {
            this.searchCurrentPageCache.set(page);
          }
        }),
        map((resp) => resp.results),
      );
  }

  loadNextSearchPage(): Observable<Movie[]> {
    const nextPage = this.searchCurrentPageCache() + 1;

    if (this.searchTotalPagesCache() > 0 && nextPage > this.searchTotalPagesCache()) {
      return of([]);
    }

    const query = this.searchQueryCache();
    return this.searchMovies(query, nextPage);
  }

  clearSearch(): void {
    this.searchQueryCache.set('');
    this.searchResultsByPage.set(new Map());
    this.searchCurrentPageCache.set(1);
    this.searchTotalPagesCache.set(0);
    this.isSearchModeCache.set(false);
  }
}
