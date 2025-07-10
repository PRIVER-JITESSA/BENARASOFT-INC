"use client";

import type { Movie } from "./tmdb-client";

const MY_LIST_KEY = "moviestream_my_list";

export interface MyListItem extends Movie {
  addedAt: string;
}

// Get all items from My List
export function getMyList(): MyListItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(MY_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading My List:", error);
    return [];
  }
}

// Add movie to My List
export function addToMyList(movie: Movie): void {
  if (typeof window === "undefined") return;

  try {
    const currentList = getMyList();
    const isAlreadyInList = currentList.some((item) => item.id === movie.id);

    if (!isAlreadyInList) {
      const newItem: MyListItem = {
        ...movie,
        addedAt: new Date().toISOString(),
      };
      const updatedList = [newItem, ...currentList];
      localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("myListUpdated"));
    }
  } catch (error) {
    console.error("Error adding to My List:", error);
  }
}

// Remove movie from My List
export function removeFromMyList(movieId: number): void {
  if (typeof window === "undefined") return;

  try {
    const currentList = getMyList();
    const updatedList = currentList.filter((item) => item.id !== movieId);
    localStorage.setItem(MY_LIST_KEY, JSON.stringify(updatedList));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("myListUpdated"));
  } catch (error) {
    console.error("Error removing from My List:", error);
  }
}

// Check if movie is in My List
export function isInMyList(movieId: number): boolean {
  if (typeof window === "undefined") return false;

  try {
    const currentList = getMyList();
    return currentList.some((item) => item.id === movieId);
  } catch (error) {
    console.error("Error checking My List:", error);
    return false;
  }
}

// Clear entire My List
export function clearMyList(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(MY_LIST_KEY);
    window.dispatchEvent(new CustomEvent("myListUpdated"));
  } catch (error) {
    console.error("Error clearing My List:", error);
  }
}

// Get My List count
export function getMyListCount(): number {
  return getMyList().length;
}
