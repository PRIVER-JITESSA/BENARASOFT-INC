"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Plus,
  ThumbsUp,
  ChevronDown,
  Check,
} from "lucide-react";
import Image from "next/image";
import type { TVShow } from "@/app/utils/tmdb-tv";
import { cn } from "@/app/utils/utils";
import { TVShowModal } from "./tv-show-modal";
import { addToMyList, removeFromMyList, isInMyList } from "@/app/utils/my-list";
import AuthGuard from "./auth-guard";
import { useUser } from "@clerk/nextjs";

interface TVShowRowProps {
  title: string;
  tvShows: TVShow[];
}

export function TVShowRow({ title, tvShows }: TVShowRowProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredShow, setHoveredShow] = useState<number | null>(null);
  const [myListItems, setMyListItems] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedShow, setSelectedShow] = useState<TVShow | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { isSignedIn } = useUser();


  useEffect(() => {
    const updateMyListStatus = () => {
      const myListShowIds = tvShows
        .filter((show) => isInMyList(show.id))
        .map((show) => show.id);
      setMyListItems(myListShowIds);
    };

    updateMyListStatus();
    window.addEventListener("myListUpdated", updateMyListStatus);
    return () => {
      window.removeEventListener("myListUpdated", updateMyListStatus);
    };
  }, [tvShows]);

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

  const toggleMyList = (tvShow: TVShow) => {

    if (isSignedIn) {

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
    
        if (isInMyList(tvShow.id)) {
          removeFromMyList(tvShow.id);
        } else {
          addToMyList(movieFormat);
        }
    } else {
      setShowAuthDialog(true);
    }
  };

  return (
    <>
    <AuthGuard open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <div className="px-4 md:px-16 group">
        <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
          {title}
        </h2>

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

          {/* TV Shows Scroll Container */}
          <div
            ref={scrollRef}
            className="flex space-x-2 overflow-x-auto scrollbar-hide pb-4"
            onScroll={handleScroll}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {tvShows.slice(0, 20).map((tvShow, index) => (
              <div
                key={tvShow.id}
                className="flex-shrink-0 w-48 md:w-64 group/item cursor-pointer relative"
                onMouseEnter={() => setHoveredShow(tvShow.id)}
                onMouseLeave={() => setHoveredShow(null)}
                onClick={() => setSelectedShow(tvShow)}>
                <div className="relative overflow-hidden rounded-md transition-transform duration-300 group-hover/item:scale-105">
                  <Image
                    src={
                      tvShow.backdrop_path
                        ? `https://image.tmdb.org/t/p/w500${tvShow.backdrop_path}`
                        : tvShow.poster_path
                        ? `https://image.tmdb.org/t/p/w500${tvShow.poster_path}`
                        : "/placeholder.svg?height=144&width=256"
                    }
                    alt={tvShow.name}
                    width={256}
                    height={144}
                    className="w-full h-36 object-cover"
                  />

                  {/* Hover Overlay */}
                  <div
                    className={cn(
                      "absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center",
                      hoveredShow === tvShow.id && "opacity-100"
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
                          myListItems.includes(tvShow.id)
                            ? "bg-green-600 border-green-600"
                            : ""
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMyList(tvShow);
                        }}>
                        {myListItems.includes(tvShow.id) ? (
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

                {/* TV Show Info */}
                <div className="mt-2 px-1">
                  <h3 className="text-sm font-medium text-white line-clamp-1 group-hover/item:text-gray-300">
                    {tvShow.name}
                  </h3>
                  <div className="flex items-center justify-between mt-1">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-800 text-gray-300">
                      {tvShow.vote_average.toFixed(1)}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {tvShow.first_air_date
                        ? new Date(tvShow.first_air_date).getFullYear()
                        : ""}
                    </span>
                  </div>
                  {myListItems.includes(tvShow.id) && (
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
          {selectedShow && (
            <TVShowModal
              tvShow={selectedShow}
              isOpen={!!selectedShow}
              onClose={() => setSelectedShow(null)}
            />
          )}
        </div>
      </div>
    </>
  );
}
