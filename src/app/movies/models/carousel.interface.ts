export type CarouselEndpoint =
  | 'popular'
  | 'top_rated'
  | 'trending_week'
  | 'genre'
  | 'now_playing'
  | 'upcoming';

export interface CarouselInterface {
  id: string;
  title: string;
  endpoint: CarouselEndpoint;
  genreId?: number;
}
