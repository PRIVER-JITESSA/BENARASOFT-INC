"use client";

import type React from "react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery("");
    onSearch?.("");
  };

  return (
    <form onSubmit={handleSearch} className="flex gap-2 items-center">
      <div className="relative flex-1 items-center">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search movies by title or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-red-600"
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 mr-3 text-gray-400 hover:text-white">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button type="submit" className="bg-red-600 hover:bg-red-700 text-white">
        Search
      </Button>
    </form>
  );
}
