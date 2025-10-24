import { Link } from "wouter";
import { Star, ShieldCheck, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InteractiveCarousel } from "@/components/ui/interactive-carousel";
import type { Companion } from "@shared/schema";

interface CompanionCardProps {
  companion: Companion;
}

export function CompanionCard({ companion }: CompanionCardProps) {
  const galleryImages = companion.gallery && companion.gallery.length > 0 
    ? companion.gallery 
    : companion.profileImage 
    ? [companion.profileImage] 
    : [];

  return (
    <Card className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border-0">
      <div className="relative">
        {galleryImages.length > 0 ? (
          <InteractiveCarousel 
            images={galleryImages} 
            className="h-64"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
        
        {/* Status Badge */}
        <Badge
          className={`absolute top-4 right-4 z-10 ${
            companion.isAvailable
              ? "bg-green-500 hover:bg-green-600"
              : "bg-yellow-500 hover:bg-yellow-600"
          } text-white`}
        >
          {companion.isAvailable ? "Available Now" : "Busy"}
        </Badge>

        {/* Rating */}
        <div className="absolute top-4 left-4 z-10 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm font-semibold">{companion.rating || "N/A"}</span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-heading font-semibold text-brand-black">
            {companion.name}
          </h3>
          <div className="flex items-center text-brand-pink">
            <ShieldCheck className="w-5 h-5 mr-1" />
            <span className="text-sm font-medium">Verified</span>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {companion.bio}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-brand-black">
            ${companion.hourlyRate}
            <span className="text-base text-gray-500">/hr</span>
          </div>
          <Link href={`/companion/${companion.id}`}>
            <Button className="bg-brand-pink hover:bg-pink-600 font-medium">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
