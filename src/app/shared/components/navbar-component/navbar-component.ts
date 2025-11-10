import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { MovieService } from '../../../movies/service/movie.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive, ReactiveFormsModule],
  templateUrl: './navbar-component.html',
  styles: ``,
})
export class NavbarComponent implements OnInit, OnDestroy {
  movieService = inject(MovieService);
  private router = inject(Router);
  searchControl = new FormControl<string>('');
  genreControl = new FormControl<string>('');
  genres = this.movieService.genres;
  private destroy$ = new Subject<void>();

  currentRoute = signal<string>('');

  showGenreFilter = computed(() => this.currentRoute().startsWith('/movies'));

  ngOnInit(): void {
    this.currentRoute.set(this.router.url);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event) => {
        this.currentRoute.set((event as NavigationEnd).url);
      });

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
      if (value && value !== '') {
        this.router.navigate(['/movies'], { queryParams: { genre: value } });
      } else {
        this.router.navigate(['/movies']);
      }
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
