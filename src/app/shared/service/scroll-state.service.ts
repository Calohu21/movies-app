import { DestroyRef, ElementRef, Injectable, signal } from '@angular/core';
import { fromEvent, map, Observable, throttleTime } from 'rxjs';
import { ScrollEvent } from '../../movies/models/scroll-event.interface';

@Injectable({
  providedIn: 'root',
})
export class ScrollStateService {
  private readonly SCROLL_THRESHOLD = 600;
  private readonly scrollPositions = signal<Map<string, number>>(new Map());

  observeScroll(
    elementRef: ElementRef<HTMLElement>,
    route: string,
    destroyRef: DestroyRef,
  ): Observable<ScrollEvent> {
    const element = elementRef.nativeElement;

    const scroll$ = fromEvent(element, 'scroll').pipe(
      throttleTime(100),
      map(() => {
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
        const scrollHeight = element.scrollHeight;

        this.saveScrollPosition(route, scrollTop);

        const isNearBottom = scrollTop + clientHeight + this.SCROLL_THRESHOLD >= scrollHeight;

        return {
          scrollTop,
          isNearBottom,
          route,
        };
      }),
    );

    destroyRef.onDestroy(() => {});

    return scroll$;
  }

  saveScrollPosition(route: string, position: number): void {
    const positions = this.scrollPositions();
    positions.set(route, position);
    this.scrollPositions.set(new Map(positions));
  }

  getScrollPosition(route: string): number {
    return this.scrollPositions().get(route) ?? 0;
  }

  clearScrollPosition(route: string): void {
    const positions = this.scrollPositions();
    positions.delete(route);
    this.scrollPositions.set(new Map(positions));
  }

  clearAllScrollPositions(): void {
    this.scrollPositions.set(new Map());
  }

  restoreScroll(elementRef: ElementRef<HTMLElement>, route: string): void {
    const element = elementRef.nativeElement;
    const savePosition = this.getScrollPosition(route);

    setTimeout(() => {
      if (element) {
        element.scrollTop = savePosition;
      }
    }, 0);
  }
}
