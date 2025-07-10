"use client";

import { useState } from "react";
import { NetflixNav } from "@/components/nav";
import { MovieGrid } from "@/components/movie-grid";
import { MovieFilters } from "@/components/movie-filters";
import { SearchBar } from "@/components/search-bar";

export default function MoviesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    genres: [] as string[],
    year: "",
    rating: [0, 10] as [number, number],
    sortBy: "popularity.desc",
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixNav />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            Discover Movies
          </h1>
          <p className="text-gray-400">Explore our vast collection of movies</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <MovieFilters onFiltersChange={setFilters} />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-6">
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <MovieGrid searchQuery={searchQuery} filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
}
