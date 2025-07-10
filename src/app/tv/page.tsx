import {
  getTrendingTVShows,
  getPopularTVShows,
  getTopRatedTVShows,
  getOnTheAirTVShows,
  getAiringTodayTVShows,
} from "@/app/utils/tmdb-tv";
import { NetflixNav } from "@/components/nav";
import { TVShowRow } from "@/components/tv-show-row";
import { TVHeroSection } from "@/components/tv-hero-section";

export default async function TVShowsPage() {
  const [
    trendingShows,
    popularShows,
    topRatedShows,
    onTheAirShows,
    airingTodayShows,
  ] = await Promise.all([
    getTrendingTVShows(),
    getPopularTVShows(),
    getTopRatedTVShows(),
    getOnTheAirTVShows(),
    getAiringTodayTVShows(),
  ]);

  // Get a random show for hero section
  const heroShow =
    trendingShows[
      Math.floor(Math.random() * Math.min(10, trendingShows.length))
    ];

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixNav />

      {/* Hero Section */}
      <TVHeroSection tvShow={heroShow} />

      {/* TV Show Rows */}
      <div className="relative z-10 -mt-32 space-y-8 pb-20">
        <TVShowRow title="Trending Now" tvShows={trendingShows} />
        <TVShowRow title="Popular TV Shows" tvShows={popularShows.results} />
        <TVShowRow title="Top Rated" tvShows={topRatedShows.results} />
        <TVShowRow title="On The Air" tvShows={onTheAirShows.results} />
        <TVShowRow title="Airing Today" tvShows={airingTodayShows.results} />
      </div>
    </div>
  );
}
