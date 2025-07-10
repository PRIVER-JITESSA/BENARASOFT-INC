import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Film, TrendingUp, Heart, Clock, Star, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { MovieStatsChart } from "@/components/movie-stats";
import { GenreChart } from "@/components/genre-chart";
import { NetflixNav } from "@/components/nav";
import {
  getNowPlayingMovies,
  getTrendingMovies,
  getPopularMovies,
} from "@/app/utils/tmdb";

// Mock user data (in real app, this would come from user database)
const userStats = {
  moviesWatched: 127,
  watchlistCount: 23,
  favoriteGenre: "Action",
  totalWatchTime: "284 hours",
};

export default async function Dashboard() {
  const [nowPlayingData, trendingMovies, popularMovies] = await Promise.all([
    getNowPlayingMovies(),
    getTrendingMovies(),
    getPopularMovies(),
  ]);

  const recentMovies = nowPlayingData.results.slice(0, 5);
  const recommendations = popularMovies.results.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <NetflixNav />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your movie journey
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Movies Watched
              </CardTitle>
              <Film className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.moviesWatched}
              </div>
              <p className="text-xs text-muted-foreground">
                +12 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.watchlistCount}
              </div>
              <p className="text-xs text-muted-foreground">+3 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Watch Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.totalWatchTime}
              </div>
              <p className="text-xs text-muted-foreground">This year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Favorite Genre
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userStats.favoriteGenre}
              </div>
              <p className="text-xs text-muted-foreground">Most watched</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Movie Stats Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Viewing Activity</CardTitle>
              <CardDescription>
                Your movie watching trends over the past 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MovieStatsChart />
            </CardContent>
          </Card>

          {/* Genre Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Genre Preferences</CardTitle>
              <CardDescription>
                Distribution of your favorite movie genres
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GenreChart />
            </CardContent>
          </Card>
        </div>

        {/* Recent Movies Table */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Now Playing Movies</CardTitle>
              <CardDescription>
                Latest movies currently in theaters
              </CardDescription>
            </div>
            <Link href="/movies">
              <Button variant="outline">View More</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead>Release Date</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Popularity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentMovies.map((movie) => (
                  <TableRow key={movie.id}>
                    <TableCell className="flex items-center space-x-3">
                      <Image
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                            : "/placeholder.svg?height=60&width=40"
                        }
                        alt={movie.title}
                        width={40}
                        height={60}
                        className="rounded"
                      />
                      <span className="font-medium">{movie.title}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        {new Date(movie.release_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-400 fill-current" />
                        {movie.vote_average.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          movie.popularity > 100 ? "default" : "secondary"
                        }>
                        {Math.round(movie.popularity)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Movies</CardTitle>
            <CardDescription>Trending movies you might enjoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((movie) => (
                <div key={movie.id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-lg mb-3">
                    <Image
                      src={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                          : "/placeholder.svg?height=200&width=150"
                      }
                      alt={movie.title}
                      width={150}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge
                        variant="secondary"
                        className="bg-black/70 text-white">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{movie.title}</h3>
                  <Badge variant="outline" className="mb-2">
                    Popular
                  </Badge>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {movie.overview}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
