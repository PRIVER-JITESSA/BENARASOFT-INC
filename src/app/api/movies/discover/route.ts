import { type NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function GET(request: NextRequest) {
  try {
    if (!TMDB_API_KEY) {
      console.error("TMDB_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);

    const params = new URLSearchParams({
      api_key: TMDB_API_KEY,
      page: searchParams.get("page") || "1",
      sort_by: searchParams.get("sort_by") || "popularity.desc",
    });

    const withGenres = searchParams.get("with_genres");
    const primaryReleaseYear = searchParams.get("primary_release_year");
    const voteAverageGte = searchParams.get("vote_average.gte");
    const voteAverageLte = searchParams.get("vote_average.lte");

    if (withGenres) params.append("with_genres", withGenres);
    if (primaryReleaseYear)
      params.append("primary_release_year", primaryReleaseYear);
    if (voteAverageGte) params.append("vote_average.gte", voteAverageGte);
    if (voteAverageLte) params.append("vote_average.lte", voteAverageLte);

    const url = `${TMDB_BASE_URL}/discover/movie?${params.toString()}`;
    console.log("Fetching from TMDb:", url.replace(TMDB_API_KEY, "***"));

    const response = await fetch(url, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error("TMDb API error:", response.status, response.statusText);
      throw new Error(`TMDb API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error discovering movies:", error);
    return NextResponse.json(
      { error: "Failed to discover movies" },
      { status: 500 }
    );
  }
}
