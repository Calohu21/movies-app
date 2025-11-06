import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, Observable, of, tap } from 'rxjs';
import { Movie, MovieResponse } from '../models/movie.interface';
import { GenreResponse } from '../models/genre.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.tmdbUrl;
  private readonly apiKey = environment.tmdbApiKey;

  private readonly genresCache = signal<GenreResponse | null>(null);
  public readonly genres = this.genresCache.asReadonly();

  private readonly movieRespCache = signal<MovieResponse | null>(null);
  public readonly movieResp = this.movieRespCache.asReadonly();

  private readonly moviesCache = signal<Movie[]>([]);
  public readonly movies = this.moviesCache.asReadonly();

  getDiscoverMovies(): Observable<Movie[]> {
    if (this.moviesCache().length > 0) {
      return of(this.moviesCache());
    }

    return this.http
      .get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .pipe(
        tap((response) => {
          this.movieRespCache.set(response);
          this.moviesCache.set(response.results);
        }),
        map((resp) => resp.results),
      );
  }

  getGenres() {
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
}
