import { useState, useEffect } from "react";
import { Search, MapPin, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CategorySwitcher } from "@/components/ui/category-switcher";

interface SearchFiltersProps {
  onFiltersChange: (filters: SearchFilters) => void;
  activeCategory: "female" | "male" | "trans";
  onCategoryChange: (category: "female" | "male" | "trans") => void;
}

export interface SearchFilters {
  searchTerm: string;
  category: "female" | "male" | "trans";
  location: string;
  userLocation?: { lat: number; lng: number };
  maxDistance: number;
  priceRange: [number, number];
  minRating: number;
  availability: "all" | "available" | "verified";
  sortBy: "distance" | "price" | "rating" | "newest";
}

export function SearchFilters({ onFiltersChange, activeCategory, onCategoryChange }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: "",
    category: activeCategory,
    location: "",
    maxDistance: 25,
    priceRange: [50, 500],
    minRating: 0,
    availability: "all",
    sortBy: "distance",
  });

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setFilters(prev => ({ ...prev, userLocation: location }));
          setLocationError(null);
        },
        (error) => {
          setLocationError("Location access denied. Using city search instead.");
          console.log("Geolocation error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
      );
    } else {
      setLocationError("Geolocation not supported by this browser.");
    }
  }, []);

  // Update filters when category changes
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: activeCategory }));
  }, [activeCategory]);

  // Emit filter changes
  useEffect(() => {
    onFiltersChange(filters);
  }, [filters, onFiltersChange]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      searchTerm: "",
      category: activeCategory,
      location: "",
      maxDistance: 25,
      priceRange: [50, 500],
      minRating: 0,
      availability: "all",
      sortBy: "distance",
      userLocation,
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.location) count++;
    if (filters.maxDistance !== 25) count++;
    if (filters.priceRange[0] !== 50 || filters.priceRange[1] !== 500) count++;
    if (filters.minRating > 0) count++;
    if (filters.availability !== "all") count++;
    if (filters.sortBy !== "distance") count++;
    return count;
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* Category Switcher */}
        <div className="mb-4">
          <CategorySwitcher
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
            className="w-full"
          />
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search companions..."
              value={filters.searchTerm}
              onChange={(e) => updateFilter("searchTerm", e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant={isExpanded ? "secondary" : "outline"}
            onClick={() => setIsExpanded(!isExpanded)}
            className="shrink-0"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {getActiveFilterCount()}
              </Badge>
            )}
          </Button>
        </div>

        {/* Location Section */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Enter city or area..."
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="pl-10"
            />
          </div>
          {userLocation && (
            <Button
              variant="outline"
              onClick={() => updateFilter("location", "Current Location")}
              className="shrink-0"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Near Me
            </Button>
          )}
        </div>

        {locationError && (
          <div className="text-sm text-amber-600 mb-4 p-2 bg-amber-50 rounded">
            {locationError}
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-6 pt-4 border-t">
            {/* Distance Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Maximum Distance</label>
                <span className="text-sm text-gray-500">
                  {filters.maxDistance === 100 ? "100+ miles" : `${filters.maxDistance} miles`}
                </span>
              </div>
              <Slider
                value={[filters.maxDistance]}
                onValueChange={(value) => updateFilter("maxDistance", value[0])}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Price Range (per hour)</label>
                <span className="text-sm text-gray-500">
                  ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilter("priceRange", value)}
                max={1000}
                min={50}
                step={25}
                className="w-full"
              />
            </div>

            {/* Rating Filter */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Minimum Rating</label>
                <span className="text-sm text-gray-500">
                  {filters.minRating === 0 ? "Any rating" : `${filters.minRating}+ stars`}
                </span>
              </div>
              <Slider
                value={[filters.minRating]}
                onValueChange={(value) => updateFilter("minRating", value[0])}
                max={5}
                min={0}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Availability Filter */}
            <div>
              <label className="text-sm font-medium mb-3 block">Availability</label>
              <Select value={filters.availability} onValueChange={(value) => updateFilter("availability", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companions</SelectItem>
                  <SelectItem value="available">Available Now</SelectItem>
                  <SelectItem value="verified">Verified Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="text-sm font-medium mb-3 block">Sort By</label>
              <Select value={filters.sortBy} onValueChange={(value) => updateFilter("sortBy", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distance">Distance</SelectItem>
                  <SelectItem value="price">Price (Low to High)</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            {getActiveFilterCount() > 0 && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full"
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}