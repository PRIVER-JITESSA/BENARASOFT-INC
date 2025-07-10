"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import  Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
import Image from "next/image";
import {
  discoverMovies,
  searchMovies,
  type Movie,
  type MovieResponse,
} from "@/app/utils/tmdb-client";
import { MovieModal } from "@/components/movie-modal";
import { addToMyList, removeFromMyList, isInMyList } from "@/app/utils/my-list";

interface MovieGridProps {
  searchQuery?: string;
  filters?: {
    genres: string[];
    year: string;
    rating: [number, number];
    sortBy: string;
  };
}

export function MovieGrid({ searchQuery, filters }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [myListItems, setMyListItems] = useState<number[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const fetchMovies = useCallback(
    async (page: number) => {
      setLoading(true);
      try {
        let response: MovieResponse;

        if (searchQuery && searchQuery.trim()) {
          response = await searchMovies(searchQuery, page);
        } else {
          const genreIds = filters?.genres?.join(",") || undefined;
          const year = filters?.year
            ? Number.parseInt(filters.year)
            : undefined;
          const [minRating, maxRating] = filters?.rating || [0, 10];

          response = await discoverMovies({
            page,
            sortBy: filters?.sortBy || "popularity.desc",
            withGenres: genreIds,
            primaryReleaseYear: year,
            voteAverageGte: minRating > 0 ? minRating : undefined,
            voteAverageLte: maxRating < 10 ? maxRating : undefined,
          });
        }

        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 500)); // TMDb API limit
        setTotalResults(response.total_results);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setMovies([]);
        setTotalPages(0);
        setTotalResults(0);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, filters]
  );

  useEffect(() => {
    setCurrentPage(1);
    fetchMovies(1);
  }, [fetchMovies]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchMovies(currentPage);
    }
  }, [currentPage, fetchMovies]);

  useEffect(() => {
    // Update My List status when component mounts or list changes
    const updateMyListStatus = () => {
      const myListMovieIds = movies
        .filter((movie) => isInMyList(movie.id))
        .map((movie) => movie.id);
      setMyListItems(myListMovieIds);
    };

    updateMyListStatus();
    window.addEventListener("myListUpdated", updateMyListStatus);
    return () =>
      window.removeEventListener("myListUpdated", updateMyListStatus);
  }, [movies]);

  const toggleFavorite = (movieId: number) => {
    setFavorites((prev) =>
      prev.includes(movieId)
        ? prev.filter((id) => id !== movieId)
        : [...prev, movieId]
    );
  };

  const toggleMyList = (movie: Movie) => {
    if (isInMyList(movie.id)) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-gray-900 border-gray-800">
              <CardContent className="p-0">
                <div className="bg-gray-800 h-64 rounded-t-lg" />
                <div className="p-4 space-y-2">
                  <div className="bg-gray-800 h-4 rounded" />
                  <div className="bg-gray-800 h-3 rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-400">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Discover movies"}{" "}
          - {totalResults.toLocaleString()} movies found
        </p>
      </div>

      {/* Movie Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <Card
            key={movie.id}
            className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gray-900 border-gray-800 cursor-pointer">
            <CardContent
              className="p-0"
              onClick={() => setSelectedMovie(movie)}>
              <div className="relative overflow-hidden rounded-t-lg">
                <Image
                  src={
                    movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=400&width=300"
                  }
                  alt={movie.title}
                  width={300}
                  height={400}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant={
                      favorites.includes(movie.id) ? "default" : "secondary"
                    }
                    className="h-8 w-8 p-0 bg-black/70 hover:bg-black/90"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(movie.id);
                    }}>
                    <Heart
                      className={`h-4 w-4 ${
                        favorites.includes(movie.id)
                          ? "fill-current text-red-500"
                          : "text-white"
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      myListItems.includes(movie.id) ? "default" : "secondary"
                    }
                    className={`h-8 w-8 p-0 bg-black/70 hover:bg-black/90 ${
                      myListItems.includes(movie.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : ""
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMyList(movie);
                    }}>
                    {myListItems.includes(movie.id) ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <Plus className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 line-clamp-2 text-white group-hover:text-gray-300">
                  {movie.title}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : "TBA"}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400">
                    {myListItems.includes(movie.id)
                      ? "In My List"
                      : movie.vote_count > 1000
                      ? "Popular"
                      : "New"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">
                  {movie.overview}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(pageNum)}
                  className={`w-8 h-8 p-0 ${
                    currentPage === pageNum
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
                  }`}>
                  {pageNum}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Movie Modal */}
      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}