import {
  afterNextRender,
  DestroyRef,
  Directive,
  ElementRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ScrollStateService } from '../service/scroll-state.service';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  private readonly scrollStateService = inject(ScrollStateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  private readonly isLoadingMore = signal(false);

  hasMorePages = input(true);
  loadMore = output();

  constructor() {
    afterNextRender(() => {
      const element = this.elementRef;
      const currentRoute = this.router.url;

      this.scrollStateService.restoreScroll(element, currentRoute);

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', this.handleScroll);
      });

      window.addEventListener('scroll', this.handleScroll);
    });
  }

  private handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;

    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 200;

    if (isNearBottom && !this.isLoadingMore() && this.hasMorePages()) {
      this.isLoadingMore.set(true);
      this.loadMore.emit();

      setTimeout(() => {
        this.isLoadingMore.set(false);
      }, 200);
    }
  };
}
