import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Movie } from '../models/movie.interface';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private http = inject(HttpClient);

  getUpComingMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${environment.tmdbUrl}/movie/upcoming`, {
      params: {
        api_key: `${environment.tmdbApiKey}`,
      },
    });
  }
}
