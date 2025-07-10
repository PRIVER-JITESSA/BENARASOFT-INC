"use client";

import { useState } from "react";
import Button  from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import Image from "next/image";
import type { TVShow } from "@/app/utils/tmdb-tv";
import { TVShowModal } from "@/components/tv-show-modal";

interface TVHeroSectionProps {
  tvShow: TVShow;
}

export function TVHeroSection({ tvShow }: TVHeroSectionProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [showModal, setShowModal] = useState(false);

  if (!tvShow) return null;

  return (
    <div className="relative h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={
            tvShow.backdrop_path
              ? `https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`
              : "/placeholder.svg?height=1080&width=1920"
          }
          alt={tvShow.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-16 max-w-2xl">
        <button
          onClick={() => setShowModal(true)}
          className="text-left hover:text-gray-300 transition-colors">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{tvShow.name}</h1>
        </button>

        <div className="flex items-center space-x-4 mb-4">
          <Badge
            variant="secondary"
            className="bg-red-600 text-white hover:bg-red-700">
            ★ {tvShow.vote_average.toFixed(1)}
          </Badge>
          <span className="text-gray-300">
            {tvShow.first_air_date
              ? new Date(tvShow.first_air_date).getFullYear()
              : ""}
          </span>
          <Badge variant="outline" className="border-gray-600 text-gray-300">
            TV Series
          </Badge>
        </div>

        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed line-clamp-3">
          {tvShow.overview}
        </p>

        <div className="flex items-center space-x-4">
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-200 font-semibold px-8">
            <Play className="mr-2 h-5 w-5 fill-current" />
            Play
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="bg-gray-600/70 text-white hover:bg-gray-600 font-semibold px-8">
            <Info className="mr-2 h-5 w-5" />
            More Info
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto text-white border border-gray-600 hover:border-white rounded-full w-10 h-10 p-0"
            onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? (
              <VolumeX className="h-5 w-5" />
            ) : (
              <Volume2 className="h-5 w-5" />
            )}
          </Button>
        </div>
        <TVShowModal
          tvShow={tvShow}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      </div>
    </div>
  );
}
