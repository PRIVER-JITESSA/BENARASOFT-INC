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
  Tv,
  Check,
} from "lucide-react";
import Image from "next/image";
import type { TVShow, TVShowDetails } from "@/app/utils/tmdb-tv";
import {
  getTVShowDetails,
  getTVShowCredits,
  getSimilarTVShows,
} from "@/app/utils/tmdb-tv";
import { addToMyList, removeFromMyList, isInMyList } from "@/app/utils/my-list";

interface TVShowModalProps {
  tvShow: TVShow;
  isOpen: boolean;
  onClose: () => void;
}

export function TVShowModal({ tvShow, isOpen, onClose }: TVShowModalProps) {
  const [showDetails, setShowDetails] = useState<TVShowDetails | null>(null);
  const [credits, setCredits] = useState<any>(null);
  const [similarShows, setSimilarShows] = useState<TVShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isInMyListState, setIsInMyListState] = useState(false);
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
    if (isOpen && tvShow) {
      fetchTVShowData();
      setIsInMyListState(isInMyList(tvShow.id));
    }
  }, [isOpen, tvShow]);

  useEffect(() => {
    const handleMyListUpdate = () => {
      setIsInMyListState(isInMyList(tvShow.id));
    };

    window.addEventListener("myListUpdated", handleMyListUpdate);
    return () =>
      window.removeEventListener("myListUpdated", handleMyListUpdate);
  }, [tvShow.id]);

  const fetchTVShowData = async () => {
    setLoading(true);
    try {
      const [details, creditsData, similar] = await Promise.all([
        getTVShowDetails(tvShow.id),
        getTVShowCredits(tvShow.id),
        getSimilarTVShows(tvShow.id),
      ]);

      setShowDetails(details);
      setCredits(creditsData);
      setSimilarShows(similar.results.slice(0, 6));
    } catch (error) {
      console.error("Error fetching TV show data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRuntime = (runtimes: number[]) => {
    if (!runtimes || runtimes.length === 0) return "Unknown";
    const avgRuntime = Math.round(
      runtimes.reduce((a, b) => a + b, 0) / runtimes.length
    );
    return `${avgRuntime}m`;
  };

  const handleMyListToggle = () => {
    // Convert TV show to movie format for My List compatibility
    const movieFormat = {
      id: tvShow.id,
      title: tvShow.name,
      overview: tvShow.overview,
      poster_path: tvShow.poster_path,
      backdrop_path: tvShow.backdrop_path,
      release_date: tvShow.first_air_date,
      vote_average: tvShow.vote_average,
      vote_count: tvShow.vote_count,
      popularity: tvShow.popularity,
      genre_ids: tvShow.genre_ids,
      adult: tvShow.adult,
      original_language: tvShow.original_language,
      original_title: tvShow.original_name,
      video: false,
    };

    if (isInMyListState) {
      removeFromMyList(tvShow.id);
    } else {
      addToMyList(movieFormat);
    }
  };

  const handleRating = (rating: "like" | "dislike") => {
    setUserRating(userRating === rating ? null : rating);
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
                  tvShow.backdrop_path
                    ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
                    : "/placeholder.svg?height=400&width=800"
                }
                alt={tvShow.name}
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
                  {tvShow.name}
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
                  {/* TV Show Info */}
                  <div className="flex items-center space-x-4 text-sm">
                    <Badge
                      variant="secondary"
                      className="bg-green-600 text-white">
                      {Math.round(tvShow.vote_average * 10)}% Match
                    </Badge>
                    <span className="text-gray-300">
                      {tvShow.first_air_date
                        ? new Date(tvShow.first_air_date).getFullYear()
                        : ""}
                    </span>
                    {showDetails?.episode_run_time && (
                      <span className="text-gray-300">
                        {formatRuntime(showDetails.episode_run_time)}
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
                    {tvShow.overview}
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
                          .map((actor: any) => actor.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Genres */}
                  {showDetails?.genres && showDetails.genres.length > 0 && (
                    <div>
                      <span className="text-gray-400">Genres: </span>
                      <span className="text-gray-200">
                        {showDetails.genres
                          .map((genre) => genre.name)
                          .join(", ")}
                      </span>
                    </div>
                  )}

                  {/* Creator */}
                  {showDetails?.created_by &&
                    showDetails.created_by.length > 0 && (
                      <div>
                        <span className="text-gray-400">Created by: </span>
                        <span className="text-gray-200">
                          {showDetails.created_by[0].name}
                        </span>
                      </div>
                    )}

                  {/* Rating */}
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-gray-200">
                      {tvShow.vote_average.toFixed(1)}/10
                    </span>
                    <span className="text-gray-400">
                      ({tvShow.vote_count.toLocaleString()} votes)
                    </span>
                  </div>

                  {/* First Air Date */}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-200">
                      {tvShow.first_air_date
                        ? new Date(tvShow.first_air_date).toLocaleDateString()
                        : "Unknown"}
                    </span>
                  </div>

                  {/* Seasons & Episodes */}
                  {showDetails && (
                    <div className="flex items-center space-x-2">
                      <Tv className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-200">
                        {showDetails.number_of_seasons} Season
                        {showDetails.number_of_seasons !== 1 ? "s" : ""} •{" "}
                        {showDetails.number_of_episodes} Episodes
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Similar TV Shows */}
              {similarShows.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-white">
                    More Like This
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {similarShows.map((similarShow) => (
                      <div
                        key={similarShow.id}
                        className="bg-gray-900 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-800 transition-colors">
                        <div className="relative h-32">
                          <Image
                            src={
                              similarShow.backdrop_path
                                ? `https://image.tmdb.org/t/p/w500${similarShow.backdrop_path}`
                                : "/placeholder.svg?height=128&width=256"
                            }
                            alt={similarShow.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-white text-sm mb-1">
                            {similarShow.name}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2">
                            {similarShow.overview}
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
