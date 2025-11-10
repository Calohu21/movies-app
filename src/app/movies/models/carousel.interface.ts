export type CarouselEndpoint =
  | 'popular'
  | 'top_rated'
  | 'trending_day'
  | 'trending_week'
  | 'genre'
  | 'now_playing'
  | 'upcoming';

export interface CarouselConfig {
  id: string;
  title: string;
  endpoint: CarouselEndpoint;
  genreId?: number;
}
