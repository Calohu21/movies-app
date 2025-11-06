import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MovieService } from '../../../movies/service/movie.service';

@Component({
  selector: 'app-navbar-component',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-component.html',
  styles: ``,
})
export class NavbarComponent {
  movieService = inject(MovieService);
}
