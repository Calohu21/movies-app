import { Directive, input, output } from '@angular/core';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective {
  hasMorePages = input(true);
  loadMore = output();
  constructor() {}
}
