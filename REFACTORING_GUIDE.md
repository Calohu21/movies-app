# Guía de Refactorización y Nuevas Funcionalidades - Movies App

## 📋 Índice
1. [Análisis de la Aplicación Actual](#análisis-de-la-aplicación-actual)
2. [Arquitectura Refactorizada Propuesta](#arquitectura-refactorizada-propuesta)
3. [Endpoints TMDB a Integrar](#endpoints-tmdb-a-integrar)
4. [Pasos Detallados de Implementación](#pasos-detallados-de-implementación)

---

## 📊 Análisis de la Aplicación Actual

### Estructura Actual del Proyecto

```
src/app/
├── core/
│   └── interceptors/
│       └── language-interceptor.ts          # Interceptor para idioma ES
├── movies/
│   ├── models/
│   │   ├── movie.interface.ts               # Interface Movie y MovieResponse
│   │   ├── genre.interface.ts               # Interface Genre y GenreResponse
│   │   ├── detail-movie.interface.ts        # Interface DetailMovie
│   │   └── scroll-event.interface.ts        # Interface para eventos de scroll
│   ├── pages/
│   │   ├── movie-list-page/                 # ⚠️ A ELIMINAR
│   │   ├── movie-card-page/                 # Vista de cards (Grid)
│   │   └── movie-detail.page/               # Página de detalles
│   └── service/
│       └── movie.service.ts                 # Servicio principal de películas
├── shared/
│   ├── components/
│   │   ├── navbar-component/                # Navbar con búsqueda y filtros
│   │   ├── movie-card/                      # Componente card individual
│   │   ├── list/                            # Componente lista
│   │   ├── card-detail/                     # Componente detalle
│   │   └── description/                     # Componente descripción
│   ├── directives/
│   │   └── infinite-scroll.directive.ts     # Directiva de scroll infinito
│   ├── pipes/
│   │   ├── genre.names.pipe.ts              # Pipe para nombres de géneros
│   │   └── tmbd.image.pipe.ts               # Pipe para URLs de imágenes
│   └── service/
│       └── scroll-state.service.ts          # Servicio de persistencia de scroll
└── app.routes.ts                            # Rutas de la aplicación
```

### Funcionalidades Actuales

**MovieService (movie.service.ts):**
- ✅ Obtención de películas con `discover/movie` (paginado)
- ✅ Filtrado por género
- ✅ Búsqueda de películas
- ✅ Detalles de película
- ✅ Cache de películas por página usando signals
- ✅ Cache de búsquedas
- ✅ Cache de géneros
- ✅ Modo búsqueda activa/inactiva

**Páginas:**
- `movie-list-page`: Vista de lista (scroll infinito) - **A ELIMINAR**
- `movie-card-page`: Vista de cards en grid (scroll infinito) - **A TRANSFORMAR**
- `movie-detail.page`: Detalles de película individual

**Componentes Compartidos:**
- `navbar-component`: Navegación + búsqueda + filtro de género
- `movie-card`: Tarjeta de película individual con link a detalles
- `list`: Componente de lista con scroll infinito
- `card-detail`: Card de detalles de película
- `description`: Descripción de película

**Características Técnicas:**
- Zoneless change detection
- Signals para gestión de estado
- Cache en memoria
- Scroll infinito
- Persistencia de posición de scroll
- Interceptor de idioma (ES)
- Lazy loading de rutas

---

## 🏗️ Arquitectura Refactorizada Propuesta

### Nueva Estructura del Proyecto

```
src/app/
├── core/
│   └── interceptors/
│       └── language-interceptor.ts          # [SIN CAMBIOS]
│
├── movies/
│   ├── models/
│   │   ├── movie.interface.ts               # [SIN CAMBIOS]
│   │   ├── genre.interface.ts               # [SIN CAMBIOS]
│   │   ├── detail-movie.interface.ts        # [SIN CAMBIOS]
│   │   ├── scroll-event.interface.ts        # [SIN CAMBIOS]
│   │   └── carousel-config.interface.ts     # [NUEVO] Interface para configuración de carruseles
│   │
│   ├── pages/
│   │   ├── movie-home-page/                 # [NUEVO] Ex movie-list-page (transformada)
│   │   │   ├── movie-home-page.ts
│   │   │   └── movie-home-page.html
│   │   ├── movie-grid-page/                 # [RENOMBRADO] Ex movie-card-page
│   │   │   ├── movie-grid-page.ts
│   │   │   └── movie-grid-page.html
│   │   └── movie-detail.page/               # [SIN CAMBIOS]
│   │       ├── movie-detail.page.ts
│   │       └── movie-detail.page.html
│   │
│   └── service/
│       └── movie.service.ts                 # [EXTENDER] Añadir nuevos métodos
│
├── shared/
│   ├── components/
│   │   ├── navbar-component/                # [MODIFICAR] Adaptar para nueva navegación
│   │   │   ├── navbar-component.ts
│   │   │   └── navbar-component.html
│   │   │
│   │   ├── movie-carousel/                  # [NUEVO] Componente carrusel
│   │   │   ├── movie-carousel.ts
│   │   │   └── movie-carousel.html
│   │   │
│   │   ├── movie-card/                      # [SIN CAMBIOS]
│   │   │   ├── movie-card.ts
│   │   │   └── movie-card.html
│   │   │
│   │   ├── card-detail/                     # [SIN CAMBIOS]
│   │   │   ├── card-detail.ts
│   │   │   └── card-detail.html
│   │   │
│   │   └── description/                     # [SIN CAMBIOS]
│   │       ├── description.ts
│   │       └── description.html
│   │
│   ├── directives/
│   │   └── infinite-scroll.directive.ts     # [SIN CAMBIOS]
│   │
│   ├── pipes/
│   │   ├── genre.names.pipe.ts              # [SIN CAMBIOS]
│   │   └── tmbd.image.pipe.ts               # [SIN CAMBIOS]
│   │
│   └── service/
│       └── scroll-state.service.ts          # [SIN CAMBIOS]
│
└── app.routes.ts                            # [MODIFICAR] Actualizar rutas
```

### Flujo de Navegación Propuesto

```
┌─────────────────────────────────────────────────────────────┐
│                      NAVBAR (Siempre visible)               │
│  Logo | Inicio | Búsqueda | Filtro Género | Avatar          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   RUTA: / (movie-home-page)   │
              └───────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────────┐
        │      CARRUSEL 1: Películas Populares    │
        │      [20 películas] [Botón: Ver más →]  │
        ├─────────────────────────────────────────┤
        │      CARRUSEL 2: Mejor Valoradas        │
        │      [20 películas] [Botón: Ver más →]  │
        ├─────────────────────────────────────────┤
        │      CARRUSEL 3: En Tendencia (Semana)  │
        │      [20 películas] [Botón: Ver más →]  │
        ├─────────────────────────────────────────┤
        │      CARRUSEL 4: Acción                 │
        │      [20 películas] [Botón: Ver más →]  │
        ├─────────────────────────────────────────┤
        │      CARRUSEL 5: Comedia                │
        │      [20 películas] [Botón: Ver más →]  │
        ├─────────────────────────────────────────┤
        │      CARRUSEL 6: Ciencia Ficción        │
        │      [20 películas] [Botón: Ver más →]  │
        └─────────────────────────────────────────┘
                              │
                              ▼
              (Click en "Ver más" o en una película)
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
         ┌──────────────────┐  ┌──────────────────┐
         │  movie-grid-page │  │ movie-detail.page│
         │  (con filtro     │  │  (detalles de    │
         │   específico)    │  │   película)      │
         └──────────────────┘  └──────────────────┘
                    │
                    │ (scroll infinito)
                    ▼
         Más películas del mismo filtro
```

### Componentes Nuevos a Crear

**1. movie-carousel (Componente Hijo Reutilizable)**

**Responsabilidades:**
- Mostrar 20 películas en formato horizontal deslizante
- Recibir configuración del carrusel (título, endpoint, género)
- Botón "Ver más" que navega a movie-grid-page con filtro específico
- Navegación horizontal con botones o arrastre

**Inputs:**
```typescript
title: string                    // "Películas Populares"
endpoint: CarouselEndpoint       // Tipo de endpoint a usar
genreId?: number                 // ID del género (opcional)
movies: Movie[]                  // Array de películas a mostrar
```

**Outputs:**
```typescript
viewMore: EventEmitter<CarouselConfig>  // Emite cuando se clickea "Ver más"
```

**2. movie-home-page (Página Principal - Ex movie-list-page)**

**Responsabilidades:**
- Página principal de la app (ruta `/`)
- Contener múltiples componentes `movie-carousel`
- Coordinar la carga de datos para cada carrusel
- Gestionar el estado de carga de cada carrusel

**Carruseles a mostrar:**
1. Películas Populares (Popular)
2. Mejor Valoradas (Top Rated)
3. En Tendencia - Esta Semana (Trending Week)
4. En Tendencia - Hoy (Trending Day)
5. Acción (Género ID: 28)
6. Comedia (Género ID: 35)
7. Drama (Género ID: 18)
8. Ciencia Ficción (Género ID: 878)
9. Terror (Género ID: 27)
10. Romance (Género ID: 10749)

**3. movie-grid-page (Renombrado desde movie-card-page)**

**Responsabilidades:**
- Mostrar películas en vista grid con scroll infinito
- Recibir parámetros de filtrado desde query params
- Mostrar título descriptivo según el filtro activo
- Cargar más películas al hacer scroll

**Query Params a manejar:**
```typescript
?filter=popular              // Películas populares
?filter=top_rated           // Mejor valoradas
?filter=trending&window=day // Tendencias del día
?filter=trending&window=week// Tendencias de la semana
?genre=28                   // Películas de género específico
?search=termino             // Búsqueda (ya existe)
```

---

## 🌐 Endpoints TMDB a Integrar

### Endpoints Actuales en Uso

1. **Discover Movies** - `GET /discover/movie`
   - ✅ Actualmente usado
   - Parámetros: `page`, `with_genres`, `sort_by`

2. **Search Movies** - `GET /search/movie`
   - ✅ Actualmente usado
   - Parámetros: `query`, `page`

3. **Movie Details** - `GET /movie/{movie_id}`
   - ✅ Actualmente usado

4. **Genre List** - `GET /genre/movie/list`
   - ✅ Actualmente usado (precargado en app.config.ts)

### Nuevos Endpoints a Integrar

#### 1. Películas Populares
```
GET https://api.themoviedb.org/3/movie/popular
```
**Descripción:** Obtiene películas ordenadas por popularidad.

**Parámetros:**
- `page`: número (paginación)
- `language`: string (ya gestionado por interceptor)

**Equivalencia con Discover:**
```
/discover/movie?sort_by=popularity.desc
```

**Uso en la App:** Carrusel "Películas Populares" + Página grid con filtro `?filter=popular`

---

#### 2. Películas Mejor Valoradas
```
GET https://api.themoviedb.org/3/movie/top_rated
```
**Descripción:** Obtiene películas ordenadas por valoración.

**Parámetros:**
- `page`: número (paginación)
- `language`: string (ya gestionado por interceptor)

**Equivalencia con Discover:**
```
/discover/movie?sort_by=vote_average.desc&vote_count.gte=200&without_genres=99,10755
```

**Uso en la App:** Carrusel "Mejor Valoradas" + Página grid con filtro `?filter=top_rated`

---

#### 3. Películas en Tendencia
```
GET https://api.themoviedb.org/3/trending/movie/{time_window}
```
**Descripción:** Obtiene películas en tendencia por periodo de tiempo.

**Parámetros de Ruta:**
- `time_window`: "day" | "week"

**Parámetros Query:**
- `page`: número (paginación)
- `language`: string

**Uso en la App:**
- Carrusel "Tendencias del Día" (`time_window=day`)
- Carrusel "Tendencias de la Semana" (`time_window=week`)
- Página grid con filtros `?filter=trending&window=day` o `?filter=trending&window=week`

---

#### 4. Películas que se Están Reproduciendo Ahora
```
GET https://api.themoviedb.org/3/movie/now_playing
```
**Descripción:** Obtiene películas que actualmente están en cines.

**Parámetros:**
- `page`: número (paginación)
- `language`: string
- `region`: string (opcional, código de país ISO 3166-1)

**Uso en la App (OPCIONAL):** Carrusel "En Cines Ahora"

---

#### 5. Próximos Estrenos
```
GET https://api.themoviedb.org/3/movie/upcoming
```
**Descripción:** Obtiene películas que se estrenarán próximamente.

**Parámetros:**
- `page`: número (paginación)
- `language`: string
- `region`: string (opcional)

**Uso en la App (OPCIONAL):** Carrusel "Próximos Estrenos"

---

#### 6. Películas Recomendadas
```
GET https://api.themoviedb.org/3/movie/{movie_id}/recommendations
```
**Descripción:** Obtiene películas recomendadas basadas en una película específica.

**Parámetros:**
- `movie_id`: número (ID de la película base)
- `page`: número (paginación)
- `language`: string

**Uso en la App (FUTURO):** Sección "Películas Recomendadas" en la página de detalles

---

#### 7. Películas Similares
```
GET https://api.themoviedb.org/3/movie/{movie_id}/similar
```
**Descripción:** Obtiene películas similares a una película específica.

**Parámetros:**
- `movie_id`: número (ID de la película base)
- `page`: número (paginación)
- `language`: string

**Uso en la App (FUTURO):** Sección "Películas Similares" en la página de detalles

---

#### 8. Videos de Película (Trailers)
```
GET https://api.themoviedb.org/3/movie/{movie_id}/videos
```
**Descripción:** Obtiene videos (trailers, teasers) de una película.

**Parámetros:**
- `movie_id`: número (ID de la película)
- `language`: string

**Uso en la App (FUTURO):** Reproducir trailers en la página de detalles

---

#### 9. Imágenes de Película
```
GET https://api.themoviedb.org/3/movie/{movie_id}/images
```
**Descripción:** Obtiene imágenes (posters, backdrops) de una película.

**Parámetros:**
- `movie_id`: número (ID de la película)
- `include_image_language`: string (opcional, ej: "en,null")

**Uso en la App (FUTURO):** Galería de imágenes en la página de detalles

---

#### 10. Créditos de Película (Cast & Crew)
```
GET https://api.themoviedb.org/3/movie/{movie_id}/credits
```
**Descripción:** Obtiene el elenco y equipo de una película.

**Parámetros:**
- `movie_id`: número (ID de la película)
- `language`: string

**Uso en la App (FUTURO):** Mostrar actores y directores en la página de detalles

---

### Resumen de Integraciones Prioritarias

**FASE 1 (Refactorización Principal):**
1. ✅ `movie/popular` - Carrusel de Populares
2. ✅ `movie/top_rated` - Carrusel de Mejor Valoradas
3. ✅ `trending/movie/day` - Carrusel de Tendencias Hoy
4. ✅ `trending/movie/week` - Carrusel de Tendencias Semana
5. ✅ `discover/movie?with_genres={id}` - Carruseles por Género (ya existe, reutilizar)

**FASE 2 (Mejoras Futuras):**
6. ⏳ `movie/now_playing` - Carrusel En Cines
7. ⏳ `movie/upcoming` - Carrusel Próximos Estrenos
8. ⏳ `movie/{id}/recommendations` - Recomendaciones en detalle
9. ⏳ `movie/{id}/similar` - Similares en detalle
10. ⏳ `movie/{id}/videos` - Trailers en detalle
11. ⏳ `movie/{id}/credits` - Elenco en detalle

---

## 🔧 Pasos Detallados de Implementación

### FASE 0: Preparación y Limpieza

#### Paso 0.1: Backup y Git
**Objetivo:** Asegurar que puedas revertir cambios si algo sale mal.

**Acciones:**
1. Asegúrate de tener todos los cambios actuales commiteados
2. Crea una nueva rama para la refactorización:
   ```bash
   git checkout -b refactor/carousel-home-page
   ```
3. Considera hacer un backup manual del proyecto (copia de seguridad)

**Verificación:**
- ✅ Rama nueva creada
- ✅ Código actual funcional commiteado

---

#### Paso 0.2: Revisar Dependencias
**Objetivo:** Verificar que todas las dependencias estén actualizadas.

**Acciones:**
1. Ejecuta `npm list` para ver las dependencias instaladas
2. Verifica que Angular 20, Tailwind CSS v4, y DaisyUI v5 estén correctamente instalados
3. Si planeas añadir una librería de carruseles (Embla, Swiper, etc.), investiga cuál se adapta mejor a Angular 20 standalone components

**Recomendación de Librería de Carrusel:**
- **Opción 1 (Recomendada):** Implementar carrusel nativo con CSS scroll-snap y TypeScript
  - ✅ Sin dependencias adicionales
  - ✅ Mejor rendimiento
  - ✅ Más control sobre el código

- **Opción 2:** Usar `embla-carousel` (si necesitas funcionalidades avanzadas)
  - Instalación: `npm install embla-carousel embla-carousel-autoplay`
  - Compatible con framework-agnostic approach

**Verificación:**
- ✅ Dependencias listadas y funcionando
- ✅ Decisión tomada sobre librería de carrusel

---

### FASE 1: Creación de Modelos e Interfaces

#### Paso 1.1: Crear Interface de Configuración de Carrusel
**Objetivo:** Definir la estructura de datos para configurar cada carrusel.

**Archivo a crear:** `src/app/movies/models/carousel-config.interface.ts`

**Contenido sugerido:**
```typescript
export type CarouselEndpoint =
  | 'popular'
  | 'top_rated'
  | 'trending_day'
  | 'trending_week'
  | 'genre'
  | 'now_playing'    // OPCIONAL: FASE 2
  | 'upcoming';      // OPCIONAL: FASE 2

export interface CarouselConfig {
  id: string;                    // Identificador único del carrusel
  title: string;                 // Título a mostrar ("Películas Populares")
  endpoint: CarouselEndpoint;    // Tipo de endpoint a llamar
  genreId?: number;              // Opcional: ID del género (solo para endpoint 'genre')
}
```

**Verificación:**
- ✅ Archivo creado en la ruta correcta
- ✅ Interface exportada correctamente
- ✅ Sin errores de TypeScript

---

### FASE 2: Extensión del MovieService

#### Paso 2.1: Añadir Signals para Nuevos Endpoints
**Objetivo:** Crear el estado necesario para manejar los nuevos datos.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Acciones:**
1. Añadir signals privados para cachear datos de cada endpoint:
   ```typescript
   // Nuevos signals de cache
   private readonly popularMoviesCache = signal<Map<number, Movie[]>>(new Map());
   private readonly topRatedMoviesCache = signal<Map<number, Movie[]>>(new Map());
   private readonly trendingDayCache = signal<Map<number, Movie[]>>(new Map());
   private readonly trendingWeekCache = signal<Map<number, Movie[]>>(new Map());
   ```

2. Crear signals públicos readonly si necesitas exponerlos:
   ```typescript
   public readonly popularMovies = this.popularMoviesCache.asReadonly();
   // ... etc
   ```

**Notas:**
- Mantén la convención de nomenclatura actual: `nombreCache` privado, `nombre` público
- Usa `Map<number, Movie[]>` para cachear por página, igual que el código actual
- Los signals permiten reactividad automática cuando cambien los datos

**Verificación:**
- ✅ Signals creados sin errores
- ✅ Nomenclatura consistente con el código existente

---

#### Paso 2.2: Implementar Método para Películas Populares
**Objetivo:** Crear método que obtenga películas populares de la API.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Método a añadir:**
```typescript
getPopularMovies(page: number = 1): Observable<Movie[]> {
  const cache = this.popularMoviesCache();

  // Verificar si ya está en cache
  if (cache.has(page)) {
    return of(cache.get(page)!);
  }

  // Llamar a la API
  return this.http
    .get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      tap((resp) => {
        // Actualizar cache
        const newCache = new Map(cache);
        newCache.set(page, resp.results);
        this.popularMoviesCache.set(newCache);
      }),
      map((resp) => resp.results)
    );
}
```

**Notas:**
- El patrón es idéntico a `getDiscoverMovies()` existente
- Aprovecha el sistema de cache por página
- El interceptor `languageInterceptor` ya añade `language: 'es-ES'` automáticamente
- Retorna `Observable<Movie[]>` para mantener consistencia

**Verificación:**
- ✅ Método añadido sin errores de compilación
- ✅ Tipos correctos (Observable<Movie[]>)
- ✅ Cache funcionando correctamente

---

#### Paso 2.3: Implementar Método para Películas Mejor Valoradas
**Objetivo:** Crear método que obtenga películas mejor valoradas.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Método a añadir:**
```typescript
getTopRatedMovies(page: number = 1): Observable<Movie[]> {
  const cache = this.topRatedMoviesCache();

  if (cache.has(page)) {
    return of(cache.get(page)!);
  }

  return this.http
    .get<MovieResponse>(`${this.apiUrl}/movie/top_rated`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      tap((resp) => {
        const newCache = new Map(cache);
        newCache.set(page, resp.results);
        this.topRatedMoviesCache.set(newCache);
      }),
      map((resp) => resp.results)
    );
}
```

**Verificación:**
- ✅ Método añadido sin errores
- ✅ Cache independiente del de películas populares

---

#### Paso 2.4: Implementar Métodos para Películas en Tendencia
**Objetivo:** Crear métodos para obtener películas en tendencia (día y semana).

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Métodos a añadir:**

```typescript
getTrendingMovies(timeWindow: 'day' | 'week', page: number = 1): Observable<Movie[]> {
  const cache = timeWindow === 'day' ? this.trendingDayCache() : this.trendingWeekCache();

  if (cache.has(page)) {
    return of(cache.get(page)!);
  }

  return this.http
    .get<MovieResponse>(`${this.apiUrl}/trending/movie/${timeWindow}`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      tap((resp) => {
        const newCache = new Map(cache);
        newCache.set(page, resp.results);

        if (timeWindow === 'day') {
          this.trendingDayCache.set(newCache);
        } else {
          this.trendingWeekCache.set(newCache);
        }
      }),
      map((resp) => resp.results)
    );
}

// Métodos de conveniencia
getTrendingDay(page: number = 1): Observable<Movie[]> {
  return this.getTrendingMovies('day', page);
}

getTrendingWeek(page: number = 1): Observable<Movie[]> {
  return this.getTrendingMovies('week', page);
}
```

**Notas:**
- Método genérico `getTrendingMovies()` que acepta `timeWindow`
- Métodos específicos `getTrendingDay()` y `getTrendingWeek()` para facilitar el uso
- Cache separado para día y semana

**Verificación:**
- ✅ Tres métodos añadidos correctamente
- ✅ Caches separados funcionando
- ✅ Parámetro `timeWindow` con tipos correctos

---

#### Paso 2.5: Refactorizar Método de Discover para Géneros
**Objetivo:** Asegurar que el método `getDiscoverMovies()` pueda recibir género como parámetro.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Acción:**
- Revisa el método `getDiscoverMovies()` existente
- Verifica que ya acepta filtrado por género mediante `this.genreFilterCache()`
- **NO necesitas modificarlo**, ya funciona correctamente

**Método adicional opcional (para carruseles):**
```typescript
getMoviesByGenre(genreId: number, page: number = 1): Observable<Movie[]> {
  return this.http
    .get<MovieResponse>(`${this.apiUrl}/discover/movie`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
        with_genres: genreId.toString(),
      },
    })
    .pipe(
      map((resp) => resp.results)
    );
}
```

**Notas:**
- Este método **NO usa cache compartido** con `getDiscoverMovies()` para evitar conflictos
- Es útil para carruseles porque no interfiere con el filtro global de género
- Si prefieres reutilizar `getDiscoverMovies()`, puedes hacerlo pero debes gestionar el estado del filtro global

**Recomendación:**
- Usa `getMoviesByGenre()` para carruseles (datos independientes)
- Mantén `getDiscoverMovies()` para la página grid con filtro global

**Verificación:**
- ✅ Método `getMoviesByGenre()` creado (o decides reutilizar existente)
- ✅ Sin conflictos con el filtro global de género

---

#### Paso 2.6: (OPCIONAL - FASE 2) Métodos para Recomendaciones y Similares
**Objetivo:** Preparar métodos para funcionalidades futuras en la página de detalles.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Métodos a añadir (SOLO si quieres implementar FASE 2):**

```typescript
getRecommendations(movieId: number, page: number = 1): Observable<Movie[]> {
  return this.http
    .get<MovieResponse>(`${this.apiUrl}/movie/${movieId}/recommendations`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      map((resp) => resp.results)
    );
}

getSimilarMovies(movieId: number, page: number = 1): Observable<Movie[]> {
  return this.http
    .get<MovieResponse>(`${this.apiUrl}/movie/${movieId}/similar`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      map((resp) => resp.results)
    );
}
```

**Notas:**
- Estos métodos son para la **FASE 2**
- Úsalos solo si quieres añadir secciones de "Recomendadas" o "Similares" en la página de detalles
- Puedes omitirlos por ahora y añadirlos más tarde

**Verificación:**
- ✅ Métodos añadidos (si decides implementarlos)
- ✅ O marcados como "TODO" para implementación futura

---

### FASE 3: Creación del Componente Carrusel

#### Paso 3.1: Generar Componente movie-carousel
**Objetivo:** Crear el componente hijo reutilizable para mostrar carruseles.

**Comando:**
```bash
ng generate component shared/components/movie-carousel
```

**Resultado esperado:**
- Carpeta: `src/app/shared/components/movie-carousel/`
- Archivos:
  - `movie-carousel.ts`
  - `movie-carousel.html`

**Notas:**
- Angular 20 generará automáticamente un componente standalone
- **NO añadas** `standalone: true` manualmente (es el default en Angular 20)

**Verificación:**
- ✅ Carpeta y archivos creados
- ✅ Componente standalone
- ✅ Sin errores de generación

---

#### Paso 3.2: Implementar Lógica del Componente movie-carousel
**Objetivo:** Definir inputs, outputs y lógica del carrusel.

**Archivo a modificar:** `src/app/shared/components/movie-carousel/movie-carousel.ts`

**Estructura sugerida:**

```typescript
import { Component, input, output, computed } from '@angular/core';
import { Movie } from '../../../movies/models/movie.interface';
import { CarouselConfig } from '../../../movies/models/carousel-config.interface';
import { Router } from '@angular/router';
import { TmbdImagePipe } from '../../pipes/tmbd.image.pipe';

@Component({
  selector: 'app-movie-carousel',
  imports: [TmbdImagePipe],
  templateUrl: './movie-carousel.html',
  styles: `
    // Estilos inline si son pocos, o crea archivo .css aparte
  `,
})
export class MovieCarousel {
  // Inputs
  config = input.required<CarouselConfig>();  // Configuración del carrusel
  movies = input.required<Movie[]>();          // Películas a mostrar
  isLoading = input<boolean>(false);           // Estado de carga

  // Outputs
  viewMore = output<CarouselConfig>();         // Emite cuando se clickea "Ver más"

  // Router para navegación programática
  private router = inject(Router);

  // Método para manejar "Ver más"
  handleViewMore(): void {
    const conf = this.config();
    this.viewMore.emit(conf);

    // Navegación según el tipo de endpoint
    this.navigateToGrid(conf);
  }

  // Método auxiliar para navegación
  private navigateToGrid(config: CarouselConfig): void {
    const queryParams: any = {};

    switch (config.endpoint) {
      case 'popular':
        queryParams.filter = 'popular';
        break;
      case 'top_rated':
        queryParams.filter = 'top_rated';
        break;
      case 'trending_day':
        queryParams.filter = 'trending';
        queryParams.window = 'day';
        break;
      case 'trending_week':
        queryParams.filter = 'trending';
        queryParams.window = 'week';
        break;
      case 'genre':
        queryParams.genre = config.genreId;
        break;
    }

    this.router.navigate(['/movies'], { queryParams });
  }

  // Método para navegar a detalle de película
  navigateToDetail(movieId: number): void {
    this.router.navigate(['/movie-detail', movieId]);
  }
}
```

**Notas:**
- Usa `input.required<T>()` para inputs obligatorios
- Usa `input<T>(defaultValue)` para inputs opcionales
- Usa `output<T>()` para eventos (reemplaza a `@Output()`)
- Inyecta `Router` con `inject()` para navegación
- El método `navigateToGrid()` construye los query params según el tipo de carrusel

**Verificación:**
- ✅ Inputs y outputs definidos correctamente
- ✅ Navegación implementada
- ✅ Sin errores de TypeScript

---

#### Paso 3.3: Diseñar Template del Carrusel
**Objetivo:** Crear el HTML del carrusel con scroll horizontal y botón "Ver más".

**Archivo a modificar:** `src/app/shared/components/movie-carousel/movie-carousel.html`

**Estructura sugerida:**

```html
<section class="mb-8">
  <!-- Header del carrusel -->
  <div class="flex justify-between items-center mb-4 px-4">
    <h2 class="text-2xl font-bold">{{ config().title }}</h2>
    <button
      class="btn btn-sm btn-outline"
      (click)="handleViewMore()"
    >
      Ver más →
    </button>
  </div>

  <!-- Skeleton loader mientras carga -->
  @if (isLoading()) {
    <div class="flex gap-4 px-4 overflow-x-hidden">
      @for (skeleton of [1,2,3,4,5,6]; track skeleton) {
        <div class="skeleton h-64 w-44 shrink-0"></div>
      }
    </div>
  }

  <!-- Carrusel de películas -->
  @else if (movies().length > 0) {
    <div class="carousel carousel-center gap-4 px-4">
      @for (movie of movies(); track movie.id) {
        <div
          class="carousel-item cursor-pointer"
          (click)="navigateToDetail(movie.id)"
        >
          <div class="card w-44 bg-base-100 shadow-md hover:shadow-xl transition-shadow">
            <figure>
              <img
                [src]="movie.poster_path | tmdbImage"
                [alt]="movie.title"
                class="h-64 w-44 object-cover rounded-t-lg"
              />
            </figure>
            <div class="card-body p-2">
              <h3 class="card-title text-sm line-clamp-2">{{ movie.title }}</h3>
              <div class="flex items-center gap-1">
                <span class="text-warning text-lg">★</span>
                <span class="text-sm">{{ movie.vote_average.toFixed(1) }}</span>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  }

  <!-- Estado vacío -->
  @else {
    <div class="text-center py-8 text-base-content/50">
      <p>No hay películas disponibles</p>
    </div>
  }
</section>
```

**Notas sobre el diseño:**
- Usa clases de **DaisyUI**: `carousel`, `carousel-center`, `carousel-item`, `card`, `skeleton`
- El carrusel usa scroll horizontal nativo con la clase `carousel` de DaisyUI
- Skeleton loader con `@if (isLoading())` para feedback visual
- `line-clamp-2` de Tailwind para limitar el título a 2 líneas
- Hover effects con `hover:shadow-xl transition-shadow`
- Rating con estrella y valor numérico

**Ajustes de diseño opcionales:**
- Si quieres botones de navegación (← →), añádelos manualmente
- Si quieres usar Embla Carousel, integra la librería aquí
- Ajusta tamaños de cards según tu diseño (actualmente 176px de ancho)

**Verificación:**
- ✅ Template renderiza correctamente
- ✅ Scroll horizontal funciona
- ✅ Botón "Ver más" visible
- ✅ Skeleton loader se muestra al cargar

---

#### Paso 3.4: Estilos del Carrusel (Opcional)
**Objetivo:** Añadir estilos personalizados si DaisyUI no cubre todas tus necesidades.

**Opciones:**

**Opción A: Estilos inline en el componente**
```typescript
// En movie-carousel.ts
styles: `
  .carousel {
    -webkit-overflow-scrolling: touch; /* Smooth scrolling en iOS */
    scrollbar-width: thin; /* Firefox */
  }

  .carousel::-webkit-scrollbar {
    height: 8px;
  }

  .carousel::-webkit-scrollbar-thumb {
    background: oklch(var(--bc) / 0.3);
    border-radius: 4px;
  }
`
```

**Opción B: Archivo CSS separado**
- Crea `movie-carousel.css` en la misma carpeta
- Importa en el componente: `styleUrls: ['./movie-carousel.css']`

**Estilos recomendados:**
- Scrollbar personalizado (opcional)
- Smooth scrolling
- Snap scroll (CSS scroll-snap)

**Ejemplo de scroll-snap:**
```css
.carousel {
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.carousel-item {
  scroll-snap-align: start;
}
```

**Verificación:**
- ✅ Carrusel tiene scroll suave
- ✅ Scrollbar visible pero no invasiva
- ✅ (Opcional) Snap scroll funciona

---

### FASE 4: Transformación de movie-list-page a movie-home-page

#### Paso 4.1: Renombrar Carpeta y Archivos
**Objetivo:** Cambiar el nombre del componente para reflejar su nueva función.

**Acciones manuales:**

1. **Renombrar carpeta:**
   - De: `src/app/movies/pages/movie-list-page/`
   - A: `src/app/movies/pages/movie-home-page/`

2. **Renombrar archivos:**
   - De: `movie-home-page.ts`
   - A: `movie-home-page.ts`
   - De: `movie-list-page.html`
   - A: `movie-home-page.html`

3. **Renombrar clase en el archivo .ts:**
   - De: `export class MovieListPage`
   - A: `export class MovieHomePage`

4. **Actualizar selector (opcional):**
   - De: `selector: 'app-movie-list'`
   - A: `selector: 'app-movie-home'`

**Notas:**
- Hazlo manualmente en tu IDE/editor
- VS Code ofrece refactorización automática (F2 sobre la clase)
- Asegúrate de actualizar todas las referencias

**Verificación:**
- ✅ Carpeta renombrada
- ✅ Archivos renombrados
- ✅ Clase renombrada
- ✅ Sin errores de compilación

---

#### Paso 4.2: Limpiar Código Antiguo
**Objetivo:** Eliminar todo el código relacionado con la vista de lista.

**Archivo a modificar:** `src/app/movies/pages/movie-home-page/movie-home-page.ts`

**Código a eliminar:**
```typescript
// ELIMINAR:
import { List } from '../../../shared/components/list/list';

// ELIMINAR de imports del @Component:
imports: [List],  // ← Quitar

// ELIMINAR propiedades y métodos relacionados con la lista:
movies = this.movieService.displayMovies;
hasMorePages = this.movieService.hasMorePages;
isSearchActive = this.movieService.isSearchActive;

ngOnInit(): void {
  if (this.movies().length === 0 && !this.isSearchActive()) {
    this.movieService.getDiscoverMovies().subscribe();
  }
}

onLoadMore(): void {
  if (this.isSearchActive()) {
    this.movieService.loadNextSearchPage().subscribe();
  } else {
    this.movieService.loadNextPage().subscribe();
  }
}
```

**Resultado esperado:**
- Archivo casi vacío, solo con la estructura básica del componente
- Sin referencias al componente `List`
- Sin lógica de carga de películas (se moverá a la nueva lógica)

**Verificación:**
- ✅ Código antiguo eliminado
- ✅ Componente compila sin errores
- ✅ Sin imports no utilizados

---

#### Paso 4.3: Implementar Nueva Lógica de movie-home-page
**Objetivo:** Convertir el componente en el contenedor de múltiples carruseles.

**Archivo a modificar:** `src/app/movies/pages/movie-home-page/movie-home-page.ts`

**Código sugerido:**

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../service/movie.service';
import { MovieCarousel } from '../../../shared/components/movie-carousel/movie-carousel';
import { CarouselConfig } from '../../models/carousel-config.interface';
import { Movie } from '../../models/movie.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movie-home',
  imports: [MovieCarousel],
  templateUrl: './movie-home-page.html',
  styles: ``,
})
export class MovieHomePage implements OnInit {
  private movieService = inject(MovieService);

  // Configuraciones de los carruseles
  carousels: CarouselConfig[] = [
    { id: 'popular', title: 'Películas Populares', endpoint: 'popular' },
    { id: 'top_rated', title: 'Mejor Valoradas', endpoint: 'top_rated' },
    { id: 'trending_week', title: 'Tendencias de la Semana', endpoint: 'trending_week' },
    { id: 'trending_day', title: 'Tendencias de Hoy', endpoint: 'trending_day' },
    { id: 'action', title: 'Acción', endpoint: 'genre', genreId: 28 },
    { id: 'comedy', title: 'Comedia', endpoint: 'genre', genreId: 35 },
    { id: 'drama', title: 'Drama', endpoint: 'genre', genreId: 18 },
    { id: 'scifi', title: 'Ciencia Ficción', endpoint: 'genre', genreId: 878 },
    { id: 'horror', title: 'Terror', endpoint: 'genre', genreId: 27 },
    { id: 'romance', title: 'Romance', endpoint: 'genre', genreId: 10749 },
  ];

  // Signal para almacenar las películas de cada carrusel
  carouselMovies = signal<Map<string, Movie[]>>(new Map());

  // Signal para estado de carga
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadAllCarousels();
  }

  private loadAllCarousels(): void {
    this.isLoading.set(true);

    // Crear array de observables para cargar todos los carruseles en paralelo
    const requests = this.carousels.map((config) => {
      return this.getMoviesForCarousel(config);
    });

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: (results) => {
        const moviesMap = new Map<string, Movie[]>();

        this.carousels.forEach((config, index) => {
          moviesMap.set(config.id, results[index]);
        });

        this.carouselMovies.set(moviesMap);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar carruseles:', error);
        this.isLoading.set(false);
      },
    });
  }

  private getMoviesForCarousel(config: CarouselConfig) {
    switch (config.endpoint) {
      case 'popular':
        return this.movieService.getPopularMovies(1);
      case 'top_rated':
        return this.movieService.getTopRatedMovies(1);
      case 'trending_day':
        return this.movieService.getTrendingDay(1);
      case 'trending_week':
        return this.movieService.getTrendingWeek(1);
      case 'genre':
        return this.movieService.getMoviesByGenre(config.genreId!, 1);
      default:
        return this.movieService.getPopularMovies(1);
    }
  }

  getMoviesForCarousel(carouselId: string): Movie[] {
    return this.carouselMovies().get(carouselId) || [];
  }

  onViewMore(config: CarouselConfig): void {
    // Navegación manejada por el componente hijo (MovieCarousel)
    console.log('Ver más:', config.title);
  }
}
```

**Notas:**
- `forkJoin()` carga todos los carruseles en paralelo (mejor UX)
- `carouselMovies` es un signal con un Map para acceso rápido por ID
- Método `getMoviesForCarousel()` privado determina qué endpoint llamar
- Método público `getMoviesForCarousel(id)` devuelve las películas de un carrusel específico
- `onViewMore()` es opcional, la navegación ya está en el hijo

**Optimización alternativa (carga secuencial):**
Si prefieres cargar carruseles uno por uno a medida que se hacen visibles (lazy loading con Intersection Observer), puedes implementarlo más tarde.

**Verificación:**
- ✅ Componente compila sin errores
- ✅ Array `carousels` con 10 configuraciones
- ✅ Lógica de carga implementada
- ✅ Map de películas funcional

---

#### Paso 4.4: Diseñar Template de movie-home-page
**Objetivo:** Crear el HTML que renderiza todos los carruseles.

**Archivo a modificar:** `src/app/movies/pages/movie-home-page/movie-home-page.html`

**Código sugerido:**

```html
<div class="min-h-screen bg-base-200 pt-20 pb-8">
  <!-- Título de la página -->
  <div class="px-4 mb-6">
    <h1 class="text-4xl font-bold">Descubre Películas</h1>
    <p class="text-base-content/70 mt-2">Explora las mejores películas por categorías</p>
  </div>

  <!-- Loading state general -->
  @if (isLoading()) {
    <div class="flex flex-col gap-8">
      @for (skeleton of [1,2,3]; track skeleton) {
        <div class="px-4">
          <div class="skeleton h-8 w-64 mb-4"></div>
          <div class="flex gap-4 overflow-x-hidden">
            @for (card of [1,2,3,4,5,6]; track card) {
              <div class="skeleton h-80 w-44 shrink-0"></div>
            }
          </div>
        </div>
      }
    </div>
  }

  <!-- Carruseles -->
  @else {
    @for (carousel of carousels; track carousel.id) {
      <app-movie-carousel
        [config]="carousel"
        [movies]="getMoviesForCarousel(carousel.id)"
        [isLoading]="false"
        (viewMore)="onViewMore($event)"
      />
    }
  }
</div>
```

**Notas:**
- Padding top (`pt-20`) para compensar el navbar fixed
- Skeleton loader mientras carga (`@if (isLoading())`)
- Bucle `@for` renderiza un `app-movie-carousel` por cada configuración
- Método `getMoviesForCarousel(carousel.id)` obtiene las películas del Map
- Fondo con `bg-base-200` de DaisyUI para contraste

**Mejoras opcionales:**
- Añadir un hero section en la parte superior con película destacada
- Añadir animaciones de entrada con Tailwind o librerías como GSAP
- Añadir botón "Scroll to top" al final de la página

**Verificación:**
- ✅ Template renderiza correctamente
- ✅ Carruseles se muestran en orden
- ✅ Skeleton loader funciona
- ✅ Sin errores en consola

---

### FASE 5: Renombrado y Adaptación de movie-card-page

#### Paso 5.1: Renombrar a movie-grid-page
**Objetivo:** Cambiar el nombre para reflejar mejor su función.

**Acciones manuales:**

1. **Renombrar carpeta:**
   - De: `src/app/movies/pages/movie-card-page/`
   - A: `src/app/movies/pages/movie-grid-page/`

2. **Renombrar archivos:**
   - De: `movie-grid-page.ts`
   - A: `movie-grid-page.ts`
   - De: `movie-card-page.html`
   - A: `movie-grid-page.html`

3. **Renombrar clase:**
   - De: `export class MovieGridPage`
   - A: `export class MovieGridPage`

4. **Actualizar selector:**
   - De: `selector: 'app-movie-card-page'`
   - A: `selector: 'app-movie-grid-page'`

**Verificación:**
- ✅ Carpeta renombrada
- ✅ Archivos renombrados
- ✅ Clase y selector actualizados
- ✅ Sin errores de compilación

---

#### Paso 5.2: Adaptar Lógica para Query Params
**Objetivo:** Hacer que la página responda a diferentes filtros desde la URL.

**Archivo a modificar:** `src/app/movies/pages/movie-grid-page/movie-grid-page.ts`

**Código sugerido:**

```typescript
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../service/movie.service';
import { MovieCard } from '../../../shared/components/card/movie-card';

@Component({
  selector: 'app-movie-grid-page',
  imports: [MovieCard],
  templateUrl: './movie-grid-page.html',
  styles: ``,
})
export class MovieGridPage implements OnInit {
  private movieService = inject(MovieService);
  private route = inject(ActivatedRoute);

  // Signals para query params
  filter = signal<string | null>(null);
  window = signal<string | null>(null);
  genreId = signal<number | null>(null);

  // Signal para películas
  movies = this.movieService.displayMovies;
  hasMorePages = this.movieService.hasMorePages;
  isSearchActive = this.movieService.isSearchActive;

  // Computed para título dinámico
  pageTitle = computed(() => {
    const filterType = this.filter();
    const genreIdValue = this.genreId();

    if (this.isSearchActive()) {
      return 'Resultados de búsqueda';
    }

    if (filterType === 'popular') {
      return 'Películas Populares';
    }

    if (filterType === 'top_rated') {
      return 'Mejor Valoradas';
    }

    if (filterType === 'trending') {
      const windowType = this.window();
      return windowType === 'day' ? 'Tendencias de Hoy' : 'Tendencias de la Semana';
    }

    if (genreIdValue) {
      // Buscar nombre del género en el servicio
      const genres = this.movieService.genres()?.genres || [];
      const genre = genres.find((g) => g.id === genreIdValue);
      return genre ? `Películas de ${genre.name}` : 'Películas';
    }

    return 'Todas las Películas';
  });

  ngOnInit(): void {
    // Leer query params
    this.route.queryParams.subscribe((params) => {
      this.filter.set(params['filter'] || null);
      this.window.set(params['window'] || null);

      const genreParam = params['genre'];
      this.genreId.set(genreParam ? parseInt(genreParam, 10) : null);

      // Cargar películas según el filtro
      this.loadMovies();
    });
  }

  private loadMovies(): void {
    const filterType = this.filter();
    const windowType = this.window();
    const genreIdValue = this.genreId();

    // No cargar si ya hay búsqueda activa
    if (this.isSearchActive()) {
      return;
    }

    // Limpiar cache anterior si cambia el filtro
    // (esto depende de cómo quieras manejar el cache)

    if (filterType === 'popular') {
      this.movieService.getPopularMovies(1).subscribe();
    } else if (filterType === 'top_rated') {
      this.movieService.getTopRatedMovies(1).subscribe();
    } else if (filterType === 'trending') {
      const time = windowType === 'day' ? 'day' : 'week';
      this.movieService.getTrendingMovies(time, 1).subscribe();
    } else if (genreIdValue) {
      this.movieService.setGenreFilter(genreIdValue);
      this.movieService.getDiscoverMovies(1).subscribe();
    } else {
      this.movieService.getDiscoverMovies(1).subscribe();
    }
  }

  onLoadMore(): void {
    const filterType = this.filter();
    const windowType = this.window();

    if (this.isSearchActive()) {
      this.movieService.loadNextSearchPage().subscribe();
      return;
    }

    if (filterType === 'popular') {
      // Necesitarás añadir método loadNextPopular() al servicio
      // O manejar manualmente la página siguiente
    } else if (filterType === 'top_rated') {
      // Similar
    } else if (filterType === 'trending') {
      // Similar
    } else {
      this.movieService.loadNextPage().subscribe();
    }
  }
}
```

**Notas importantes:**
- **Problema:** Los métodos `getPopularMovies()`, `getTrendingMovies()`, etc. no tienen equivalente `loadNextPage()` en el servicio
- **Solución 1:** Añadir métodos `loadNextPopularPage()`, `loadNextTopRatedPage()`, etc. en `MovieService`
- **Solución 2:** Usar un signal de página actual y llamar al método correspondiente con `page + 1`
- **Solución 3:** Simplificar y usar solo `discover` con `sort_by` (como hace la API internamente)

**Recomendación:**
- Implementa **Solución 2** para mantener consistencia con el código actual
- Añade signals de página para cada tipo de filtro en el servicio

**Verificación:**
- ✅ Query params se leen correctamente
- ✅ Título dinámico funciona
- ✅ Películas se cargan según el filtro
- ⚠️ Scroll infinito necesita ajustes (ver siguiente paso)

---

#### Paso 5.3: Extender MovieService para Paginación de Nuevos Endpoints
**Objetivo:** Añadir métodos `loadNextPage()` para cada tipo de filtro.

**Archivo a modificar:** `src/app/movies/service/movie.service.ts`

**Signals adicionales a añadir:**

```typescript
// Signals para páginas actuales de cada endpoint
private readonly popularCurrentPageCache = signal<number>(1);
private readonly topRatedCurrentPageCache = signal<number>(1);
private readonly trendingDayCurrentPageCache = signal<number>(1);
private readonly trendingWeekCurrentPageCache = signal<number>(1);

// Signals para total de páginas
private readonly popularTotalPagesCache = signal<number>(0);
private readonly topRatedTotalPagesCache = signal<number>(0);
private readonly trendingDayTotalPagesCache = signal<number>(0);
private readonly trendingWeekTotalPagesCache = signal<number>(0);
```

**Métodos de paginación a añadir:**

```typescript
loadNextPopularPage(): Observable<Movie[]> {
  const nextPage = this.popularCurrentPageCache() + 1;

  if (this.popularTotalPagesCache() > 0 && nextPage > this.popularTotalPagesCache()) {
    return of([]);
  }

  return this.getPopularMovies(nextPage);
}

loadNextTopRatedPage(): Observable<Movie[]> {
  const nextPage = this.topRatedCurrentPageCache() + 1;

  if (this.topRatedTotalPagesCache() > 0 && nextPage > this.topRatedTotalPagesCache()) {
    return of([]);
  }

  return this.getTopRatedMovies(nextPage);
}

// Similar para trending day y week...
```

**Modificar métodos existentes para actualizar páginas:**

```typescript
getPopularMovies(page: number = 1): Observable<Movie[]> {
  const cache = this.popularMoviesCache();

  if (cache.has(page)) {
    return of(cache.get(page)!);
  }

  return this.http
    .get<MovieResponse>(`${this.apiUrl}/movie/popular`, {
      params: {
        api_key: this.apiKey,
        page: page.toString(),
      },
    })
    .pipe(
      tap((resp) => {
        const newCache = new Map(cache);
        newCache.set(page, resp.results);
        this.popularMoviesCache.set(newCache);

        // AÑADIR:
        this.popularTotalPagesCache.set(resp.total_pages);
        if (page > this.popularCurrentPageCache()) {
          this.popularCurrentPageCache.set(page);
        }
      }),
      map((resp) => resp.results)
    );
}
```

**Notas:**
- Este patrón es idéntico al usado en `getDiscoverMovies()` y `loadNextPage()`
- Mantén consistencia en la nomenclatura
- Actualiza `total_pages` y `current_page` en cada llamada

**Verificación:**
- ✅ Signals de paginación añadidos
- ✅ Métodos `loadNext...Page()` implementados
- ✅ Métodos base actualizados para gestionar páginas

---

#### Paso 5.4: Actualizar movie-grid-page con Paginación Correcta
**Objetivo:** Usar los nuevos métodos de paginación en el componente.

**Archivo a modificar:** `src/app/movies/pages/movie-grid-page/movie-grid-page.ts`

**Actualizar método `onLoadMore()`:**

```typescript
onLoadMore(): void {
  const filterType = this.filter();
  const windowType = this.window();

  if (this.isSearchActive()) {
    this.movieService.loadNextSearchPage().subscribe();
    return;
  }

  if (filterType === 'popular') {
    this.movieService.loadNextPopularPage().subscribe();
  } else if (filterType === 'top_rated') {
    this.movieService.loadNextTopRatedPage().subscribe();
  } else if (filterType === 'trending') {
    if (windowType === 'day') {
      this.movieService.loadNextTrendingDayPage().subscribe();
    } else {
      this.movieService.loadNextTrendingWeekPage().subscribe();
    }
  } else {
    this.movieService.loadNextPage().subscribe();
  }
}
```

**Problema potencial:**
- `displayMovies` en el servicio actualmente retorna solo películas de `discover` o `search`
- Necesitas un computed que retorne las películas correctas según el filtro activo

**Solución: Crear un computed específico para la grid page**

**En movie-grid-page.ts:**

```typescript
// Reemplazar:
movies = this.movieService.displayMovies;

// Por:
movies = computed(() => {
  const filterType = this.filter();

  if (this.isSearchActive()) {
    return this.movieService.displayMovies();
  }

  if (filterType === 'popular') {
    return this.getAllMoviesFromCache(this.movieService['popularMoviesCache']());
  }

  if (filterType === 'top_rated') {
    return this.getAllMoviesFromCache(this.movieService['topRatedMoviesCache']());
  }

  // Similar para trending...

  return this.movieService.displayMovies();
});

private getAllMoviesFromCache(cache: Map<number, Movie[]>): Movie[] {
  const movies: Movie[] = [];
  const sortedPages = Array.from(cache.keys()).sort((a, b) => a - b);

  for (const page of sortedPages) {
    movies.push(...(cache.get(page) || []));
  }

  return movies;
}
```

**Problema:** Acceder a signals privados del servicio.

**Solución alternativa (MEJOR):**
- Exponer signals públicos readonly en el servicio
- O crear computeds públicos en el servicio para cada tipo

**En MovieService, añadir:**

```typescript
public readonly allPopularMovies = computed(() => {
  const cache = this.popularMoviesCache();
  const movies: Movie[] = [];
  const sortedPages = Array.from(cache.keys()).sort((a, b) => a - b);

  for (const page of sortedPages) {
    movies.push(...(cache.get(page) || []));
  }

  return movies;
});

// Similar para topRated, trendingDay, trendingWeek...
```

**En movie-grid-page.ts:**

```typescript
movies = computed(() => {
  const filterType = this.filter();

  if (this.isSearchActive()) {
    return this.movieService.displayMovies();
  }

  if (filterType === 'popular') {
    return this.movieService.allPopularMovies();
  }

  if (filterType === 'top_rated') {
    return this.movieService.allTopRatedMovies();
  }

  if (filterType === 'trending') {
    const windowType = this.window();
    return windowType === 'day'
      ? this.movieService.allTrendingDayMovies()
      : this.movieService.allTrendingWeekMovies();
  }

  return this.movieService.displayMovies();
});
```

**Verificación:**
- ✅ Computed públicos añadidos al servicio
- ✅ Computed de `movies` en grid-page funciona
- ✅ Scroll infinito carga más películas correctamente

---

#### Paso 5.5: Actualizar Template de movie-grid-page
**Objetivo:** Añadir título dinámico y mensajes de estado.

**Archivo a modificar:** `src/app/movies/pages/movie-grid-page/movie-grid-page.html`

**Código sugerido:**

```html
<div class="min-h-screen bg-base-200 pt-20 pb-8">
  <!-- Header con título dinámico -->
  <div class="px-4 mb-6">
    <h1 class="text-4xl font-bold">{{ pageTitle() }}</h1>
  </div>

  <!-- Estado: No hay resultados de búsqueda -->
  @if (isSearchActive() && movies().length === 0) {
    <div class="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div class="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-24 h-24 mx-auto mb-4 text-base-content/50">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <h2 class="text-2xl font-bold mb-2">No se encontraron películas</h2>
        <p class="text-base-content/70">Intenta con otros términos de búsqueda</p>
      </div>
    </div>
  }

  <!-- Grid de películas -->
  @else {
    <app-movie-card
      [movies]="movies()"
      [hasMorePages]="hasMorePages()"
      (loadMore)="onLoadMore()">
    </app-movie-card>
  }
</div>
```

**Notas:**
- Usa el computed `pageTitle()` para mostrar el título correcto
- Mantiene el estado de "no resultados" existente
- Fondo consistente con movie-home-page (`bg-base-200`)

**Verificación:**
- ✅ Título cambia según el filtro
- ✅ Grid renderiza correctamente
- ✅ Mensajes de estado funcionan

---

### FASE 6: Actualización de Rutas

#### Paso 6.1: Actualizar app.routes.ts
**Objetivo:** Reflejar los cambios de nombres y rutas.

**Archivo a modificar:** `src/app/app.routes.ts`

**Código sugerido:**

```typescript
import { Routes } from '@angular/router';
import { MovieHomePage } from './movies/pages/movie-home-page/movie-home-page';
import { MovieGridPage } from './movies/pages/movie-grid-page/movie-grid-page';
import { MovieDetailPage } from './movies/pages/movie-detail.page/movie-detail.page';

export const routes: Routes = [
  {
    path: '',
    component: MovieHomePage,  // CAMBIO: Ahora la home es la página con carruseles
  },
  {
    path: 'movies',             // CAMBIO: Nueva ruta para grid
    component: MovieGridPage,
  },
  {
    path: 'movie-detail/:id',   // SIN CAMBIOS
    component: MovieDetailPage,
  },
  {
    path: '**',
    redirectTo: '',             // CAMBIO: Redirige a home
  },
];
```

**Notas:**
- Ruta `/` ahora muestra `MovieHomePage` (con carruseles)
- Ruta `/movies` muestra `MovieGridPage` (con filtros)
- Se eliminó la ruta `/movie-list` (componente eliminado)
- Se eliminó la ruta `/movie-list-card` (renombrada a `/movies`)
- Wildcard redirige a `/` (home)

**Verificación:**
- ✅ Rutas actualizadas sin errores
- ✅ Navegación a `/` muestra home con carruseles
- ✅ Navegación a `/movies` muestra grid
- ✅ Navegación a `/movie-detail/:id` funciona

---

### FASE 7: Actualización del Navbar

#### Paso 7.1: Modificar navbar-component para Nueva Navegación
**Objetivo:** Adaptar el navbar a la nueva estructura de rutas.

**Archivo a modificar:** `src/app/shared/components/navbar-component/navbar-component.html`

**Cambios sugeridos:**

**ANTES:**
```html
<div class="flex">
  <button
    class="btn btn-sm mr-3 bg-gray-600"
    routerLinkActive="bg-accent"
    routerLink="movie-list"
    (click)="movieService.getDiscoverMovies()"
  >Ver por Lista
  </button>
</div>
<div class="flex-7">
  <button
    class="btn btn-sm bg-gray-600"
    routerLink="movie-list-card"
    (click)="movieService.getDiscoverMovies()"
  >Ver por Cards
  </button>
</div>
```

**DESPUÉS:**
```html
<div class="flex gap-2">
  <button
    class="btn btn-sm bg-gray-600"
    routerLinkActive="bg-accent"
    [routerLinkActiveOptions]="{exact: true}"
    routerLink="/"
  >
    Inicio
  </button>
  <button
    class="btn btn-sm bg-gray-600"
    routerLinkActive="bg-accent"
    routerLink="/movies"
  >
    Explorar
  </button>
</div>
```

**Notas:**
- Botón "Inicio" lleva a `/` (home con carruseles)
- Botón "Explorar" lleva a `/movies` (grid de todas las películas)
- Se eliminaron los botones "Ver por Lista" y "Ver por Cards"
- `[routerLinkActiveOptions]="{exact: true}"` necesario para que solo el home exacto esté activo
- Se eliminó el click handler `(click)="movieService.getDiscoverMovies()"` porque la carga se maneja en los componentes

**Ajustes opcionales:**
- Añadir icono de casa para "Inicio"
- Añadir icono de búsqueda para "Explorar"
- Cambiar estilos según tu diseño

**Verificación:**
- ✅ Navbar muestra botones "Inicio" y "Explorar"
- ✅ `routerLinkActive` resalta el botón activo
- ✅ Navegación funciona correctamente

---

#### Paso 7.2: (OPCIONAL) Mejorar UX del Navbar
**Objetivo:** Añadir iconos y mejorar diseño del navbar.

**Archivo a modificar:** `src/app/shared/components/navbar-component/navbar-component.html`

**Ejemplo con Heroicons (SVG inline):**

```html
<div class="flex gap-2">
  <button
    class="btn btn-sm gap-2"
    routerLinkActive="btn-accent"
    [routerLinkActiveOptions]="{exact: true}"
    routerLink="/"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
    Inicio
  </button>
  <button
    class="btn btn-sm gap-2"
    routerLinkActive="btn-accent"
    routerLink="/movies"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
    Explorar
  </button>
</div>
```

**Verificación:**
- ✅ Iconos se muestran correctamente
- ✅ Diseño mejorado

---

### FASE 8: Eliminación de Componentes No Utilizados

#### Paso 8.1: Eliminar Componente List
**Objetivo:** Limpiar código no utilizado.

**Acciones:**

1. Verifica que el componente `List` ya no se use en ningún lugar:
   ```bash
   # Buscar referencias en el proyecto
   grep -r "from.*list/list" src/
   grep -r "<app-list" src/
   ```

2. Si no hay referencias, elimina la carpeta:
   ```bash
   rm -rf src/app/shared/components/list/
   ```

**Verificación:**
- ✅ No hay referencias al componente `List`
- ✅ Carpeta eliminada
- ✅ Aplicación compila sin errores

---

### FASE 9: Testing y Ajustes Finales

#### Paso 9.1: Pruebas de Navegación
**Objetivo:** Verificar que todas las rutas funcionen correctamente.

**Checklist de pruebas:**

1. **Página Home (`/`):**
   - ✅ Se muestran todos los carruseles
   - ✅ Cada carrusel tiene 20 películas (o las que devuelva la API)
   - ✅ Botón "Ver más" navega a `/movies` con el filtro correcto
   - ✅ Click en una película navega a `/movie-detail/:id`

2. **Página Grid (`/movies`):**
   - ✅ Sin query params muestra todas las películas (discover)
   - ✅ Con `?filter=popular` muestra populares
   - ✅ Con `?filter=top_rated` muestra mejor valoradas
   - ✅ Con `?filter=trending&window=day` muestra tendencias del día
   - ✅ Con `?filter=trending&window=week` muestra tendencias de la semana
   - ✅ Con `?genre=28` muestra películas de acción
   - ✅ Título de página cambia según el filtro
   - ✅ Scroll infinito carga más películas

3. **Búsqueda (desde navbar):**
   - ✅ Escribir en el input de búsqueda filtra películas
   - ✅ Funciona tanto en home como en grid
   - ✅ Botón de limpiar búsqueda funciona

4. **Filtro de género (desde navbar):**
   - ✅ Seleccionar un género filtra películas
   - ✅ Funciona tanto en home como en grid
   - ✅ Se puede combinar con búsqueda (si lo deseas)

5. **Página de Detalles (`/movie-detail/:id`):**
   - ✅ Muestra detalles de la película
   - ✅ Funciona desde home, grid y búsqueda

**Verificación:**
- ✅ Todas las rutas funcionan
- ✅ Navegación fluida sin errores

---

#### Paso 9.2: Pruebas de Rendimiento
**Objetivo:** Asegurar que la app cargue rápido y no tenga memory leaks.

**Checklist:**

1. **Carga inicial de Home:**
   - ✅ Skeleton loaders se muestran mientras cargan los carruseles
   - ✅ `forkJoin()` carga todos los carruseles en paralelo (no secuencial)
   - ✅ Tiempo de carga aceptable (< 3 segundos en conexión normal)

2. **Scroll en carruseles:**
   - ✅ Scroll horizontal suave
   - ✅ No hay lag al desplazarse

3. **Scroll infinito en grid:**
   - ✅ Carga más películas al llegar al final
   - ✅ No carga duplicados
   - ✅ No se dispara múltiples veces

4. **Cache de API:**
   - ✅ No se llama dos veces al mismo endpoint con la misma página
   - ✅ Navegar a grid y volver a home no recarga los carruseles (usa cache)

**Verificación:**
- ✅ Rendimiento aceptable
- ✅ No hay memory leaks (verifica en DevTools > Memory)

---

#### Paso 9.3: Ajustes de Estilos y UX
**Objetivo:** Pulir detalles visuales y de experiencia de usuario.

**Checklist:**

1. **Responsive Design:**
   - ✅ Navbar se adapta a móvil (usar drawer de DaisyUI si es necesario)
   - ✅ Carruseles funcionan en móvil (scroll táctil)
   - ✅ Grid se adapta a diferentes tamaños de pantalla

2. **Estados de carga:**
   - ✅ Skeleton loaders en home
   - ✅ Spinner o mensaje al cargar más películas en grid
   - ✅ Estado vacío si no hay películas

3. **Accesibilidad:**
   - ✅ Atributos `alt` en imágenes
   - ✅ Navegación con teclado funciona (Tab, Enter)
   - ✅ Contraste de colores adecuado (DaisyUI ya lo maneja)

4. **Detalles visuales:**
   - ✅ Animaciones suaves (transitions)
   - ✅ Hover effects en cards
   - ✅ Scroll to top en páginas largas (opcional)

**Verificación:**
- ✅ Diseño pulido
- ✅ Funciona bien en móvil y desktop

---

#### Paso 9.4: Testing Funcional (Opcional)
**Objetivo:** Escribir tests unitarios y e2e.

**Acciones (OPCIONAL):**

1. **Tests unitarios con Jasmine/Karma:**
   ```bash
   ng test
   ```
   - Testear servicios (MovieService)
   - Testear componentes (MovieCarousel, MovieHomePage, MovieGridPage)

2. **Tests e2e (si tienes configurado):**
   - Testear flujo completo de usuario
   - Home → Carrusel → Grid → Detalle

**Notas:**
- Los tests son opcionales pero muy recomendados
- Angular 20 ya viene configurado con Jasmine/Karma
- Considera usar Testing Library para tests más realistas

**Verificación:**
- ✅ Tests pasando (si decides escribirlos)

---

### FASE 10: Limpieza y Documentación

#### Paso 10.1: Limpiar Código
**Objetivo:** Eliminar código comentado, imports no utilizados, console.logs.

**Acciones:**

1. **Ejecutar lint:**
   ```bash
   ng lint
   ```
   - Corregir warnings
   - Eliminar imports no utilizados

2. **Buscar console.logs:**
   ```bash
   grep -r "console.log" src/
   ```
   - Eliminar o comentar logs de desarrollo

3. **Formatear código:**
   ```bash
   npx prettier --write "src/**/*.{ts,html,css,scss}"
   ```

**Verificación:**
- ✅ Sin warnings de lint
- ✅ Sin console.logs
- ✅ Código formateado

---

#### Paso 10.2: Actualizar Documentación
**Objetivo:** Actualizar CLAUDE.md con la nueva arquitectura.

**Archivo a modificar:** `CLAUDE.md`

**Acciones:**

1. Actualizar sección de **Routing**:
   ```markdown
   ### Routing

   The app has three main routes (src/app/app.routes.ts):
   - `/` - Home page with multiple movie carousels (MovieHomePage)
   - `/movies` - Grid view with filters (MovieGridPage)
   - `/movie-detail/:id` - Movie detail page (MovieDetailPage)
   ```

2. Añadir sección sobre **Carousels**:
   ```markdown
   ### Movie Carousels

   The home page displays 10 carousels with different movie categories:
   - Popular movies
   - Top rated movies
   - Trending (day and week)
   - Genre-based carousels (Action, Comedy, Drama, Sci-Fi, Horror, Romance)

   Each carousel loads 20 movies and has a "View More" button that navigates
   to the grid page with the appropriate filter.
   ```

3. Actualizar sección de **MovieService**:
   ```markdown
   **MovieService** (src/app/movies/service/movie.service.ts):
   - Integrates with TMDB API for movie data
   - Implements in-memory caching using signals
   - Supports multiple endpoints: discover, popular, top_rated, trending
   - Exposes readonly signals for components to consume
   ```

**Verificación:**
- ✅ CLAUDE.md actualizado
- ✅ Información precisa y completa

---

#### Paso 10.3: Commit y Push
**Objetivo:** Guardar todos los cambios en el repositorio.

**Comandos:**

```bash
# Añadir todos los cambios
git add .

# Crear commit descriptivo
git commit -m "refactor: transform app to carousel-based home page

- Rename movie-list-page to movie-home-page with 10 carousels
- Rename movie-card-page to movie-grid-page with filters
- Create reusable movie-carousel component
- Extend MovieService with popular, top_rated, and trending endpoints
- Update routing and navbar for new structure
- Remove unused list component
- Update documentation

Closes #[issue-number]"

# Push a la rama
git push origin refactor/carousel-home-page
```

**Verificación:**
- ✅ Commit creado
- ✅ Push exitoso
- ✅ Listo para crear Pull Request

---

## 🎯 Resumen de Pasos

### Checklist General

**FASE 0: Preparación**
- [ ] Crear rama `refactor/carousel-home-page`
- [ ] Verificar dependencias
- [ ] Decidir librería de carrusel (nativo recomendado)

**FASE 1: Modelos**
- [ ] Crear `carousel-config.interface.ts`

**FASE 2: MovieService**
- [ ] Añadir signals de cache para nuevos endpoints
- [ ] Implementar `getPopularMovies()`
- [ ] Implementar `getTopRatedMovies()`
- [ ] Implementar `getTrendingMovies()` (day/week)
- [ ] Crear `getMoviesByGenre()` (opcional, puede reutilizar discover)
- [ ] Añadir signals de paginación
- [ ] Implementar `loadNextPopularPage()`, `loadNextTopRatedPage()`, etc.
- [ ] Crear computeds públicos (`allPopularMovies`, etc.)

**FASE 3: Componente Carrusel**
- [ ] Generar componente `movie-carousel`
- [ ] Implementar lógica (inputs, outputs, navegación)
- [ ] Diseñar template (HTML con scroll horizontal)
- [ ] Añadir estilos (opcional, scroll-snap)

**FASE 4: movie-home-page**
- [ ] Renombrar `movie-list-page` a `movie-home-page`
- [ ] Limpiar código antiguo
- [ ] Implementar nueva lógica (array de configs, forkJoin)
- [ ] Diseñar template (bucle de carruseles)

**FASE 5: movie-grid-page**
- [ ] Renombrar `movie-card-page` a `movie-grid-page`
- [ ] Adaptar lógica para query params
- [ ] Crear computed `pageTitle`
- [ ] Crear computed `movies` que use los nuevos endpoints
- [ ] Actualizar método `onLoadMore()`
- [ ] Actualizar template con título dinámico

**FASE 6: Rutas**
- [ ] Actualizar `app.routes.ts`

**FASE 7: Navbar**
- [ ] Modificar botones de navegación
- [ ] Añadir iconos (opcional)

**FASE 8: Limpieza**
- [ ] Eliminar componente `List`

**FASE 9: Testing**
- [ ] Pruebas de navegación (todas las rutas)
- [ ] Pruebas de filtros (query params)
- [ ] Pruebas de búsqueda
- [ ] Pruebas de rendimiento
- [ ] Ajustes de responsive design
- [ ] Verificar accesibilidad

**FASE 10: Documentación**
- [ ] Limpiar código (lint, prettier)
- [ ] Actualizar CLAUDE.md
- [ ] Commit y push

---

## 🚀 Mejoras Futuras (FASE 2)

### Funcionalidades Adicionales

1. **En la Página de Detalles:**
   - Añadir sección "Películas Similares" (endpoint `/movie/{id}/similar`)
   - Añadir sección "Recomendaciones" (endpoint `/movie/{id}/recommendations`)
   - Mostrar trailer (endpoint `/movie/{id}/videos`)
   - Galería de imágenes (endpoint `/movie/{id}/images`)
   - Mostrar elenco y directores (endpoint `/movie/{id}/credits`)

2. **Nuevos Carruseles:**
   - "En Cines Ahora" (endpoint `/movie/now_playing`)
   - "Próximos Estrenos" (endpoint `/movie/upcoming`)

3. **Funcionalidades Avanzadas:**
   - Favoritos (localStorage o backend)
   - Watchlist (lista de películas para ver después)
   - Historial de películas vistas
   - Modo oscuro/claro
   - Compartir películas en redes sociales

4. **Optimizaciones:**
   - Lazy loading de carruseles (Intersection Observer)
   - Service Worker para offline support
   - Infinite scroll virtual (solo renderizar elementos visibles)
   - Prefetch de páginas siguientes

5. **Integraciones:**
   - Autenticación de usuarios (TMDB session)
   - Sincronización con cuenta de TMDB
   - Ratings y reviews

---

## 📝 Notas Finales

### Convenciones de Código

- Mantén consistencia con el código existente
- Usa signals para todo el estado
- Evita `any`, usa tipos específicos
- Usa `computed()` para estado derivado
- Prefiere `inject()` sobre constructor injection
- Usa control flow nativo (`@if`, `@for`)

### Gestión del Estado

- **Cache en MovieService:** Usa Map<page, Movie[]> para cachear por página
- **Signals públicos:** Siempre exponer como readonly
- **Computeds:** Para estado derivado que reacciona a cambios

### Manejo de Errores

- Añade manejo de errores en todas las llamadas HTTP
- Muestra mensajes de error al usuario (toasts, alerts)
- Usa `catchError()` de RxJS para recuperación

### Performance

- `forkJoin()` para cargar múltiples endpoints en paralelo
- Cache para evitar llamadas redundantes
- Lazy loading de rutas (si crece la app)
- Virtual scrolling para listas muy largas

### Accesibilidad

- Atributos `alt` en imágenes
- Navegación con teclado
- ARIA labels donde sea necesario
- Contraste de colores (DaisyUI ya lo maneja)

---

## ❓ Preguntas Frecuentes

**Q: ¿Debo eliminar el componente `List` inmediatamente?**
A: Espera a terminar la refactorización completa y verificar que no se use en ningún lugar. Luego elimínalo.

**Q: ¿Qué librería de carrusel recomiendas?**
A: Implementación nativa con CSS scroll-snap es la mejor opción para este caso. Es ligera, performante y no añade dependencias.

**Q: ¿Cómo manejo el cache cuando cambio de filtro?**
A: Cada endpoint tiene su propio cache independiente. Al cambiar de filtro, simplemente llamas al método correspondiente del servicio.

**Q: ¿Puedo combinar búsqueda con filtros?**
A: Sí, pero requiere ajustes en la lógica. Actualmente la búsqueda usa su propio cache separado. Puedes extenderlo para aceptar filtros adicionales.

**Q: ¿Debo implementar FASE 2 ahora?**
A: No, enfócate primero en completar FASE 1. FASE 2 son mejoras futuras que puedes añadir gradualmente.

**Q: ¿Cómo pruebo la app durante el desarrollo?**
A: Ejecuta `ng serve` y navega a `http://localhost:4200/`. Verifica cada paso antes de continuar al siguiente.

**Q: ¿Qué hago si encuentro errores?**
A: Lee el mensaje de error en consola, verifica tipos en TypeScript, y asegúrate de haber seguido los pasos en orden. Revisa la documentación de Angular si es necesario.

---

## 🎉 ¡Éxito!

Si has seguido todos los pasos, ahora tienes:

✅ Una home page con 10 carruseles de películas
✅ Una página grid con filtros dinámicos
✅ Navegación fluida entre páginas
✅ Código limpio y bien estructurado
✅ Cache optimizado para reducir llamadas a la API
✅ Diseño responsive y accesible

**¡Disfruta de tu aplicación de películas refactorizada!** 🍿🎬
