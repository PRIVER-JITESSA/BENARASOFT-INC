import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getNowPlayingMovies,
  getTrendingMovies,
  getPopularMovies,
} from "@/app/utils/tmdb";
import Link from "next/link";
import Image from "next/image";
import { Star, Calendar } from "lucide-react";


export default async function RecentMovies() {
  const [nowPlayingData, trendingMovies, popularMovies] = await Promise.all([
      getNowPlayingMovies(),
      getTrendingMovies(),
      getPopularMovies(),
    ]);
  
    const recentMovies = nowPlayingData.results.slice(0, 5);
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Now Playing Movies</CardTitle>
          <CardDescription>Latest movies currently in theaters</CardDescription>
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
                    variant={movie.popularity > 100 ? "default" : "secondary"}>
                    {Math.round(movie.popularity)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
