import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" },
  { value: "year-desc", label: "Newest First" },
  { value: "year-asc", label: "Oldest First" },
];

interface SearchControlsProps {
  inputValue: string;
  sortBy: string;
  filterType: string;
  isSearching: boolean;
  onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export function SearchControls({
  inputValue,
  sortBy,
  filterType,
  isSearching,
  onInputChange,
  onSortChange,
  onFilterChange,
}: SearchControlsProps) {
  return (
    <div
      className="space-y-6"
      role="search"
      aria-label="Search for books, movies, and TV shows"
    >
      {/* Main search input - Vercel style */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Input
            type="text"
            id="search-query"
            value={inputValue}
            onChange={onInputChange}
            placeholder="Search your items..."
            className="h-10 text-sm bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600"
            aria-describedby="search-instructions search-results-status"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const form = e.currentTarget.closest("form");
                if (form) {
                  const event = new Event("submit", {
                    bubbles: true,
                    cancelable: true,
                  });
                  form.dispatchEvent(event);
                }
              }
            }}
          />
          {isSearching && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <LoadingSpinner size={16} />
            </div>
          )}
        </div>
        <Button
          type="submit"
          size="sm"
          variant="outline"
          disabled={isSearching}
          className="h-10 px-4"
        >
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Minimal Filter and Sort Controls */}
      <div className="flex flex-wrap gap-3 text-sm">
        <Select value={filterType} onValueChange={onFilterChange}>
          <SelectTrigger className="w-32 h-8 text-xs border-slate-200 dark:border-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Book">Books</SelectItem>
            <SelectItem value="Movie">Movies</SelectItem>
            <SelectItem value="Show">Shows</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-36 h-8 text-xs border-slate-200 dark:border-slate-800">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div id="search-instructions" className="sr-only">
        Search through books, movies, and TV shows. Press Enter or click Search
        to find results.
      </div>
    </div>
  );
}
