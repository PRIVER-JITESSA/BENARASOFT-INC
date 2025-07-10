import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getNowPlayingMovies,
  getUpcomingMovies,
} from "@/app/utils/tmdb";
import { NetflixNav } from "@/components/nav";
import { MovieRow } from "@/components/movie-row";
import { HeroSection } from "@/components/hero-section";

export default async function HomePage() {
  const [
    trendingMovies,
    popularMovies,
    topRatedMovies,
    nowPlayingMovies,
    upcomingMovies,
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getTopRatedMovies(),
    getNowPlayingMovies(),
    getUpcomingMovies(),
  ]);

  // Get a random movie for hero section
  const heroMovie =
    trendingMovies[
      Math.floor(Math.random() * Math.min(10, trendingMovies.length))
    ];

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixNav />

      {/* Hero Section */}
      <HeroSection movie={heroMovie} />

      {/* Movie Rows */}
      <div className="relative z-10 -mt-32 space-y-8 pb-20">
        <MovieRow title="Trending Now" movies={trendingMovies} />
        <MovieRow title="Popular Movies" movies={popularMovies.results} />
        <MovieRow title="Top Rated" movies={topRatedMovies.results} />
        <MovieRow title="Now Playing" movies={nowPlayingMovies.results} />
        <MovieRow title="Coming Soon" movies={upcomingMovies.results} />
      </div>
    </div>
  );
}
