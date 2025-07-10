"use client";

import { useState, useRef, useEffect } from "react";
import Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  ThumbsUp,
  ChevronDown,
  Check
} from "lucide-react";
import Image from "next/image";
import type { Movie } from "@/app/utils/tmdb";
import { cn } from "@/app/utils/utils";
import { MovieModal } from "./movie-modal";
import { addToMyList, removeFromMyList, isInMyList } from "@/app/utils/my-list";
import { useUser } from "@clerk/nextjs";
import  AuthGuard  from "./auth-guard";


interface MovieRowProps {
  title: string;
  movies: Movie[];
}


export function MovieRow({ title, movies }: MovieRowProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [myListItems, setMyListItems] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isSignedIn } = useUser();

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

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });

      // Update arrow visibility
      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftArrow(scrollRef.current.scrollLeft > 0);
          setShowRightArrow(
            scrollRef.current.scrollLeft <
              scrollRef.current.scrollWidth - scrollRef.current.clientWidth
          );
        }
      }, 300);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0);
      setShowRightArrow(
        scrollRef.current.scrollLeft <
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  const toggleMyList = (movie: Movie) => {
    if (isSignedIn) {
      if (isInMyList(movie.id)) {
        removeFromMyList(movie.id);
      } else {
        addToMyList(movie);
      }
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <div className="px-4 md:px-16 group">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
        {title}
      </h2>
      <AuthGuard open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <div className="relative">
        {/* Left Arrow */}
        {showLeftArrow && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("left")}>
            <ChevronLeft className="h-6 w-6" />
          </Button>
        )}

        {/* Right Arrow */}
        {showRightArrow && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-12 h-12 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll("right")}>
            <ChevronRight className="h-6 w-6" />
          </Button>
        )}

        {/* Movies Scroll Container */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {movies.slice(0, 20).map((movie, index) => (
            <div
              key={movie.id}
              className="flex-shrink-0 w-48 md:w-64 group/item cursor-pointer"
              onMouseEnter={() => setHoveredMovie(movie.id)}
              onMouseLeave={() => setHoveredMovie(null)}
              onClick={() => setSelectedMovie(movie)}>
              <div className="relative overflow-hidden rounded-md transition-transform duration-300 group-hover/item:scale-105">
                <Image
                  src={
                    movie.backdrop_path
                      ? `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`
                      : movie.poster_path
                      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                      : "/placeholder.svg?height=144&width=256"
                  }
                  alt={movie.title}
                  width={256}
                  height={144}
                  className="w-full h-36 object-cover"
                />

                {/* Hover Overlay */}
                <div
                  className={cn(
                    "absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center",
                    hoveredMovie === movie.id && "opacity-100"
                  )}>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-gray-200 rounded-full w-8 h-8 p-0">
                      <Play className="h-4 w-4 fill-current" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`text-white border border-gray-600 hover:border-white rounded-full w-8 h-8 p-0 ${
                        myListItems.includes(movie.id)
                          ? "bg-green-600 border-green-600"
                          : ""
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMyList(movie);
                      }}>
                      {myListItems.includes(movie.id) ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white border border-gray-600 hover:border-white rounded-full w-8 h-8 p-0">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white border border-gray-600 hover:border-white rounded-full w-8 h-8 p-0">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Movie Info */}
              <div className="mt-2 px-1">
                <h3 className="text-sm font-medium text-white line-clamp-1 group-hover/item:text-gray-300">
                  {movie.title}
                </h3>
                <div className="flex items-center justify-between mt-1">
                  <Badge
                    variant="secondary"
                    className="text-xs bg-gray-800 text-gray-300">
                    {movie.vote_average.toFixed(1)}
                  </Badge>
                  <span className="text-xs text-gray-400">
                    {movie.release_date
                      ? new Date(movie.release_date).getFullYear()
                      : ""}
                  </span>
                </div>
                {myListItems.includes(movie.id) && (
                  <Badge
                    variant="outline"
                    className="text-xs border-green-600 text-green-400 mt-1">
                    In My List
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            isOpen={!!selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </div>
    </div>
  );
}

