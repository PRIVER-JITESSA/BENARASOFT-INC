"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Plus,
  ThumbsUp,
  ThumbsDown,
  X,
  Volume2,
  VolumeX,
  Star,
  Calendar,
  Clock,
  Check
} from "lucide-react";
import Image from "next/image";
import type { Movie } from "@/app/utils/tmdb";
import {
  getMovieDetails,
  getMovieCredits,
  getSimilarMovies,
  type MovieDetails,
  type Credits,
} from "@/app/utils/tmdb";
import { addToMyList, removeFromMyList, isInMyList } from "@/app/utils/my-list";

interface MovieModalProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export function MovieModal({ movie, isOpen, onClose }: MovieModalProps) {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInMyListState, setIsInMyListState] = useState(false);
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieData();
      setIsInMyListState(isInMyList(movie.id));
    }
  }, [isOpen, movie]);

  useEffect(() => {
    // Listen for My List updates
    const handleMyListUpdate = () => {
      setIsInMyListState(isInMyList(movie.id));
    };

    window.addEventListener("myListUpdated", handleMyListUpdate);
    return () =>
      window.removeEventListener("myListUpdated", handleMyListUpdate);
  }, [movie.id]);

  const fetchMovieData = async () => {
    setLoading(true);
    try {
      const [details, creditsData, similar] = await Promise.all([
        getMovieDetails(movie.id),
        getMovieCredits(movie.id),
        getSimilarMovies(movie.id),
      ]);

      setMovieDetails(details);
      setCredits(creditsData);
      setSimilarMovies(similar.results.slice(0, 6));
    } catch (error) {
      console.error("Error fetching movie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleMyListToggle = () => {
    if (isInMyListState) {
      removeFromMyList(movie.id);
    } else {
      addToMyList(movie);
    }
  };

  const handleRating = (rating: "like" | "dislike") => {
    setUserRating(userRating === rating ? null : rating);
    // In a real app, this would make an API call to save the user's rating
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-black text-white border-gray-800 p-0">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="relative">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
              onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>

            {/* Hero Section */}
            <div className="relative h-96">
              <Image
                src={
                  movie.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                    : "/placeholder.svg?height=400&width=800"
                }
                alt={movie.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

              {/* Mute Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
                onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </Button>

              {/* Title and Actions */}
              <div className="absolute bottom-8 left-8 right-16">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  {movie.title}
                </h1>
                <div className="flex items-center space-x-3">
                  <Button
                    size="lg"
                    className="bg-white text-black hover:bg-gray-200 font-semibold">
                    <Play className="mr-2 h-5 w-5 fill-current" />
                    Play
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className={`border-2 rounded-full w-12 h-12 p-0 ${
                      isInMyListState
                        ? "border-white bg-white text-black"
                        : "border-gray-400 text-white hover:border-white"
                    }`}
                    onClick={handleMyListToggle}>
                    {isInMyListState ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Plus className="h-5 w-5" />
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className={`border-2 rounded-full w-12 h-12 p-0 ${
                      userRating === "like"
                        ? "border-white bg-white text-black"
                        : "border-gray-400 text-white hover:border-white"
                    }`}
                    onClick={() => handleRating("like")}>
                    <ThumbsUp className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="ghost"
                    className={`border-2 rounded-full w-12 h-12 p-0 ${
                      userRating === "dislike"
                        ? "border-white bg-white text-black"
                        : "border-gray-400 text-white hover:border-white"
                    }`}
                    onClick={() => handleRating("dislike")}>
                    <ThumbsDown className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Movie Info */}
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge
                      variant="secondary"
                      className="bg-green-600 text-white">
                      {Math.round(movie.vote_average * 10)}% Match
                    </Badge>
                    <span className="text-gray-300">
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : ""}
                    </span>
                    {movieDetails?.runtime && (
                      <span className="text-gray-300">
                        {formatRuntime(movieDetails.runtime)}
                      </span>
                    )}
                    <Badge
                      variant="outline"
                      className="border-gray-600 text-gray-300">
                      HD
                    </Badge>
                    {isInMyListState && (
                      <Badge
                        variant="outline"
                        className="border-green-600 text-green-400">
                        In My List
                      </Badge>
                    )}
                  </div>

                  {/* Overview */}
                  <p className="text-gray-200 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>

                {/* Sidebar */}
                <div className="space-y-4 text-sm">
                  {/* Cast */}
                  {credits?.cast && credits.cast.length > 0 && (
                    <div>
                      <span className="text-gray-400">Cast: </span>
                      <span className="text-gray-200">
                        {credits.cast
                          .slice(0, 4)
                          .map((actor) => actor.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Genres */}
                  {movieDetails?.genres && movieDetails.genres.length > 0 && (
                    <div>
                      <span className="text-gray-400">Genres: </span>
                      <span className="text-gray-200">
                        {movieDetails.genres
                          .map((genre) => genre.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Director */}
                  {credits?.crew && (
                    <div>
                      <span className="text-gray-400">Director: </span>
                      <span className="text-gray-200">
                        {credits.crew.find(
                          (person) => person.job === "Director"
                        )?.name || "Unknown"}
                      </span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-200">
                      {movie.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-gray-400">
                      ({movie.vote_count.toLocaleString()} votes)
                    </span>
                  </div>

                  {/* Release Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-200">
                      {movie.release_date
                        ? new Date(movie.release_date).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>

                  {/* Runtime */}
                  {movieDetails?.runtime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-200">
                        {formatRuntime(movieDetails.runtime)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar Movies */}
              {similarMovies.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {similarMovies.map((similarMovie) => (
                      <div
                        key={similarMovie.id}
                        className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          setMovieDetails(null);
                          setCredits(null);
                          setSimilarMovies([]);
                          // Update the current movie to the clicked similar movie
                          // In a real implementation, you'd update the parent component's state
                        }}>
                        <div className="relative h-32">
                          <Image
                            src={
                              similarMovie.backdrop_path
                                ? `https://image.tmdb.org/t/p/w500${similarMovie.backdrop_path}`
                                : "/placeholder.svg?height=128&width=256"
                            }
                            alt={similarMovie.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-white text-sm mb-1">
                            {similarMovie.title}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {similarMovie.overview}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

