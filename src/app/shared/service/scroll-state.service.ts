import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScrollStateService {
  private readonly SCROLL_THRESHOLD = 300;
  private readonly scrollPositions = signal<Map<string, number>>(new Map());

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
  }
}
