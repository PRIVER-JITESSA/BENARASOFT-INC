"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { getGenres, type Genre } from "@/app/utils/tmdb-client";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

interface MovieFiltersProps {
  onFiltersChange?: (filters: {
    genres: string[];
    year: string;
    rating: [number, number];
    sortBy: string;
  }) => void;
}

export function MovieFilters({ onFiltersChange }: MovieFiltersProps) {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 10]);
  const [selectedYear, setSelectedYear] = useState<string>("any");
  const [sortBy, setSortBy] = useState("popularity.desc");

  useEffect(() => {
    const fetchGenres = async () => {
      const genreList = await getGenres();
      setGenres(genreList);
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    onFiltersChange?.({
      genres: selectedGenres,
      year: selectedYear === "any" ? "" : selectedYear,
      rating: ratingRange,
      sortBy,
    });
  }, [selectedGenres, selectedYear, ratingRange, sortBy, onFiltersChange]);

  const handleGenreChange = (genreId: string, checked: boolean) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genreId]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g !== genreId));
    }
  };

  const removeGenre = (genreId: string) => {
    setSelectedGenres(selectedGenres.filter((g) => g !== genreId));
  };

  const clearAllFilters = () => {
    setSelectedGenres([]);
    setRatingRange([0, 10]);
    setSelectedYear("any");
    setSortBy("popularity.desc");
  };

  const getGenreName = (genreId: string) => {
    return genres.find((g) => g.id.toString() === genreId)?.name || genreId;
  };

  return (
    <div className="space-y-6">
      {/* Active Filters */}
      {(selectedGenres.length > 0 ||
        (selectedYear && selectedYear !== "any") ||
        ratingRange[0] > 0 ||
        ratingRange[1] < 10) && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm text-white">
                Active Filters
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-400 hover:text-white">
                Clear All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {selectedGenres.map((genreId) => (
                <Badge
                  key={genreId}
                  variant="secondary"
                  className="cursor-pointer bg-red-600 text-white hover:bg-red-700">
                  {getGenreName(genreId)}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={() => removeGenre(genreId)}
                  />
                </Badge>
              ))}
              {selectedYear && selectedYear !== "any" && (
                <Badge
                  variant="secondary"
                  className="bg-red-600 text-white hover:bg-red-700">
                  Year: {selectedYear}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={() => setSelectedYear("any")}
                  />
                </Badge>
              )}
              {(ratingRange[0] > 0 || ratingRange[1] < 10) && (
                <Badge
                  variant="secondary"
                  className="bg-red-600 text-white hover:bg-red-700">
                  Rating: {ratingRange[0]}-{ratingRange[1]}
                  <X
                    className="ml-1 h-3 w-3"
                    onClick={() => setRatingRange([0, 10])}
                  />
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sort By */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-sm text-white">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem
                value="popularity.desc"
                className="text-white hover:bg-gray-700">
                Popularity (High to Low)
              </SelectItem>
              <SelectItem
                value="popularity.asc"
                className="text-white hover:bg-gray-700">
                Popularity (Low to High)
              </SelectItem>
              <SelectItem
                value="release_date.desc"
                className="text-white hover:bg-gray-700">
                Release Date (Newest)
              </SelectItem>
              <SelectItem
                value="release_date.asc"
                className="text-white hover:bg-gray-700">
                Release Date (Oldest)
              </SelectItem>
              <SelectItem
                value="vote_average.desc"
                className="text-white hover:bg-gray-700">
                Rating (High to Low)
              </SelectItem>
              <SelectItem
                value="vote_average.asc"
                className="text-white hover:bg-gray-700">
                Rating (Low to High)
              </SelectItem>
              <SelectItem
                value="title.asc"
                className="text-white hover:bg-gray-700">
                Title (A-Z)
              </SelectItem>
              <SelectItem
                value="title.desc"
                className="text-white hover:bg-gray-700">
                Title (Z-A)
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Genres */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-sm text-white">Genres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <Checkbox
                  id={genre.id.toString()}
                  checked={selectedGenres.includes(genre.id.toString())}
                  onCheckedChange={(checked) =>
                    handleGenreChange(genre.id.toString(), checked as boolean)
                  }
                  className="border-gray-600 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                />
                <label
                  htmlFor={genre.id.toString()}
                  className="text-sm cursor-pointer text-gray-300 hover:text-white">
                  {genre.name}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Release Year */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-sm text-white">Release Year</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Any year" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              <SelectItem value="any" className="text-white hover:bg-gray-700">
                Any year
              </SelectItem>
              {years.map((year) => (
                <SelectItem
                  key={year}
                  value={year.toString()}
                  className="text-white hover:bg-gray-700">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Rating Range */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-sm text-white">Rating Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Slider
              value={ratingRange}
              onValueChange={(value) =>
                setRatingRange(value as [number, number])
              }
              max={10}
              min={0}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{ratingRange[0]}</span>
              <span>{ratingRange[1]}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
