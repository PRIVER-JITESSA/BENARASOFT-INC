const TMDB_API_KEY = process.env.TMDB_API_KEY || "demo_key";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface Genre {
  id: number;
  name: string;
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface GenreResponse {
  genres: Genre[];
}

// Fetch trending movies
export async function getTrendingMovies(
  timeWindow: "day" | "week" = "week"
): Promise<Movie[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending movies");
    }

    const data: MovieResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }
}

// Fetch popular movies
export async function getPopularMovies(page = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Search movies
export async function searchMovies(
  query: string,
  page = 1
): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    );

    if (!response.ok) {
      throw new Error("Failed to search movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Discover movies with filters
export async function discoverMovies({
  page = 1,
  sortBy = "popularity.desc",
  withGenres,
  primaryReleaseYear,
  voteAverageGte,
  voteAverageLte,
}: {
  page?: number;
  sortBy?: string;
  withGenres?: string;
  primaryReleaseYear?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
} = {}): Promise<MovieResponse> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: page.toString(),
      sort_by: sortBy,
    });

    if (withGenres) params.append("with_genres", withGenres);
    if (primaryReleaseYear)
      params.append("primary_release_year", primaryReleaseYear.toString());
    if (voteAverageGte)
      params.append("vote_average.gte", voteAverageGte.toString());
    if (voteAverageLte)
      params.append("vote_average.lte", voteAverageLte.toString());

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/movie?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error("Failed to discover movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error discovering movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get movie genres
export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}`,
      { next: { revalidate: 86400 } } // Cache for 24 hours
    );

    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    const data: GenreResponse = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

// Get movie details
export async function getMovieDetailsBasic(
  movieId: number
): Promise<Movie | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Get now playing movies
export async function getNowPlayingMovies(page = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch now playing movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching now playing movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get upcoming movies
export async function getUpcomingMovies(page = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching upcoming movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get top rated movies
export async function getTopRatedMovies(page = 1): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch top rated movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching top rated movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Additional interfaces for movie details
export interface MovieDetails extends Movie {
  runtime: number;
  genres: Genre[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  production_countries: {
    iso_3166_1: string;
    name: string;
  }[];
  spoken_languages: {
    iso_639_1: string;
    name: string;
  }[];
  status: string;
  tagline: string;
  budget: number;
  revenue: number;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface Crew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface Credits {
  cast: Cast[];
  crew: Crew[];
}

// Get detailed movie information
export async function getMovieDetails(
  movieId: number
): Promise<MovieDetails | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

// Get movie credits (cast and crew)
export async function getMovieCredits(
  movieId: number
): Promise<Credits | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch movie credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null;
  }
}

// Get similar movies
export async function getSimilarMovies(
  movieId: number
): Promise<MovieResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/similar?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch similar movies");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
