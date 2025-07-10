"use client";

import { useState, useEffect } from "react";
import { NetflixNav } from "@/components/nav";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Trash2, Play, Calendar } from "lucide-react";
import Image from "next/image";
import {
  getMyList,
  removeFromMyList,
  clearMyList,
  type MyListItem,
} from "@/app/utils/my-list";
import { MovieModal } from "@/components/movie-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function MyListPage() {
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MyListItem | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "title" | "rating" | "year">(
    "recent"
  );

  useEffect(() => {
    // Load initial list
    setMyList(getMyList());

    // Listen for updates
    const handleMyListUpdate = () => {
      setMyList(getMyList());
    };

    window.addEventListener("myListUpdated", handleMyListUpdate);
    return () =>
      window.removeEventListener("myListUpdated", handleMyListUpdate);
  }, []);

  const handleRemoveFromList = (movieId: number) => {
    removeFromMyList(movieId);
  };

  const handleClearList = () => {
    clearMyList();
  };

  const sortedList = [...myList].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case "title":
        return a.title.localeCompare(b.title);
      case "rating":
        return b.vote_average - a.vote_average;
      case "year":
        return (
          new Date(b.release_date).getFullYear() -
          new Date(a.release_date).getFullYear()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixNav />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                My List
              </h1>
              <p className="text-gray-400">
                {myList.length} {myList.length === 1 ? "movie" : "movies"} in
                your list
              </p>
            </div>
            {myList.length > 0 && (
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md text-sm">
                  <option value="recent">Recently Added</option>
                  <option value="title">Title (A-Z)</option>
                  <option value="rating">Rating (High to Low)</option>
                  <option value="year">Year (Newest)</option>
                </select>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:text-white bg-transparent">
                      Clear All
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">
                        Clear My List
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        Are you sure you want to remove all movies from your
                        list? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleClearList}
                        className="bg-red-600 hover:bg-red-700 text-white">
                        Clear All
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </div>

        {myList.length === 0 ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <div className="w-24 h-24 mx-auto bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <Star className="w-12 h-12 text-gray-600" />
              </div>
              <h2 className="text-2xl font-semibold text-white mb-2">
                Your list is empty
              </h2>
              <p className="text-gray-400 mb-6">
                Add movies to your list to watch them later. You can add movies
                by clicking the "+" button on any movie.
              </p>
              <Button
                onClick={() => (window.location.href = "/movies")}
                className="bg-red-600 hover:bg-red-700 text-white">
                Browse Movies
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {sortedList.map((movie) => (
              <Card
                key={movie.id}
                className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-gray-900 border-gray-800 cursor-pointer relative">
                <CardContent className="p-0">
                  <div
                    className="relative overflow-hidden rounded-t-lg"
                    onClick={() => setSelectedMovie(movie)}>
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
                      <Badge
                        variant="secondary"
                        className="bg-black/70 text-white">
                        <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                        {movie.vote_average.toFixed(1)}
                      </Badge>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button
                        size="sm"
                        variant="destructive"
                        className="h-8 w-8 p-0 bg-red-600/90 hover:bg-red-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFromList(movie.id);
                        }}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Button
                        size="sm"
                        className="bg-white text-black hover:bg-gray-200 rounded-full w-12 h-12 p-0">
                        <Play className="h-5 w-5 fill-current" />
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
                        className="border-gray-600 text-gray-400 text-xs">
                        Added {new Date(movie.addedAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>
                        Added {new Date(movie.addedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {movie.overview}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
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
      </main>
    </div>
  );
}
