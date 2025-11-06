import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { MovieResponse } from '../models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.tmdbUrl;
  private readonly apiKey = environment.tmdbApiKey;

  getDiscoverMovies(): Observable<MovieResponse> {
    return this.http.get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
      },
    });
  }
}
