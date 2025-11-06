import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { MovieResponse } from '../models/movie.interface';
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

  getDiscoverMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
      },
    });
  }

  getGenres() {
    return this.http
      .get<GenreResponse>(`${this.apiUrl}/genre/movie/list`, {
        params: {
          api_key: this.apiKey,
        },
      })
      .pipe(
        tap((genres) => this.genresCache.set(genres)),
        tap((genre) => console.log(genre)),
      );
  }
}
