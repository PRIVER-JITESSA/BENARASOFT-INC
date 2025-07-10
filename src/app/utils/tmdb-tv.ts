const TMDB_API_KEY = process.env.TMDB_API_KEY || "demo_key";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_name: string;
  origin_country: string[];
}

export interface TVShowResponse {
  page: number;
  results: TVShow[];
  total_pages: number;
  total_results: number;
}

export interface TVShowDetails extends TVShow {
  episode_run_time: number[];
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
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: {
    id: number;
    name: string;
    overview: string;
    poster_path: string | null;
    season_number: number;
    episode_count: number;
    air_date: string;
  }[];
  created_by: {
    id: number;
    name: string;
    profile_path: string | null;
  }[];
  networks: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
}

export interface Genre {
  id: number;
  name: string;
}

// Fetch trending TV shows
export async function getTrendingTVShows(
  timeWindow: "day" | "week" = "week"
): Promise<TVShow[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/trending/tv/${timeWindow}?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch trending TV shows");
    }

    const data: TVShowResponse = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching trending TV shows:", error);
    return [];
  }
}

// Fetch popular TV shows
export async function getPopularTVShows(page = 1): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch popular TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching popular TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Search TV shows
export async function searchTVShows(
  query: string,
  page = 1
): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(
        query
      )}&page=${page}`,
      { next: { revalidate: 300 } }
    );

    if (!response.ok) {
      throw new Error("Failed to search TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Discover TV shows with filters
export async function discoverTVShows({
  page = 1,
  sortBy = "popularity.desc",
  withGenres,
  firstAirDateYear,
  voteAverageGte,
  voteAverageLte,
}: {
  page?: number;
  sortBy?: string;
  withGenres?: string;
  firstAirDateYear?: number;
  voteAverageGte?: number;
  voteAverageLte?: number;
} = {}): Promise<TVShowResponse> {
  try {
    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: page.toString(),
      sort_by: sortBy,
    });

    if (withGenres) params.append("with_genres", withGenres);
    if (firstAirDateYear)
      params.append("first_air_date_year", firstAirDateYear.toString());
    if (voteAverageGte)
      params.append("vote_average.gte", voteAverageGte.toString());
    if (voteAverageLte)
      params.append("vote_average.lte", voteAverageLte.toString());

    const response = await fetch(
      `${TMDB_BASE_URL}/discover/tv?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    if (!response.ok) {
      throw new Error("Failed to discover TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error discovering TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get TV show genres
export async function getTVGenres(): Promise<Genre[]> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 86400 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV genres");
    }

    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error("Error fetching TV genres:", error);
    return [];
  }
}

// Get TV show details
export async function getTVShowDetails(
  tvId: number
): Promise<TVShowDetails | null> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV show details:", error);
    return null;
  }
}

// Get on the air TV shows
export async function getOnTheAirTVShows(page = 1): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch on the air TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching on the air TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get airing today TV shows
export async function getAiringTodayTVShows(page = 1): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch airing today TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching airing today TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get top rated TV shows
export async function getTopRatedTVShows(page = 1): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&page=${page}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch top rated TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching top rated TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}

// Get TV show credits
export async function getTVShowCredits(tvId: number) {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/credits?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch TV show credits");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching TV show credits:", error);
    return null;
  }
}

// Get similar TV shows
export async function getSimilarTVShows(tvId: number): Promise<TVShowResponse> {
  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/similar?api_key=${TMDB_API_KEY}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch similar TV shows");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching similar TV shows:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
}
