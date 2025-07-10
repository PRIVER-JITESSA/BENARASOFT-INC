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

// Client-side functions that call our API routes
export async function getGenres(): Promise<Genre[]> {
  try {
    const response = await fetch("/api/genres");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

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

    const response = await fetch(`/api/movies/discover?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to discover movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error discovering movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<MovieResponse> {
  try {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
    });

    const response = await fetch(`/api/movies/search?${params.toString()}`);
    if (!response.ok) {
      throw new Error("Failed to search movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

export async function getMovieDetails(
  movieId: number
): Promise<MovieDetails | null> {
  try {
    const response = await fetch(`/api/movies/${movieId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch movie details");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}

export async function getMovieCredits(
  movieId: number
): Promise<Credits | null> {
  try {
    const response = await fetch(`/api/movies/${movieId}/credits`);
    if (!response.ok) {
      throw new Error("Failed to fetch movie credits");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    return null;
  }
}

export async function getSimilarMovies(
  movieId: number
): Promise<MovieResponse> {
  try {
    const response = await fetch(`/api/movies/${movieId}/similar`);
    if (!response.ok) {
      throw new Error("Failed to fetch similar movies");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
