import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieService } from '../../../movies/service/movie.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar-component.html',
  styles: ``,
})
export class NavbarComponent implements OnInit, OnDestroy {
  movieService = inject(MovieService);
  searchControl = new FormControl<string>('');
  genreControl = new FormControl<string>('');
  genres = this.movieService.genres;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((query) => {
        if (query && query.trim().length >= 2) {
          this.movieService.searchMovies(query.trim()).subscribe();
        } else if (!query || query.trim().length === 0) {
          this.movieService.clearSearch();
        }
      });

    this.genreControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      const genreId = value && value !== '' ? parseInt(value, 10) : null;
      this.movieService.setGenreFilter(genreId);
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    this.movieService.clearSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
