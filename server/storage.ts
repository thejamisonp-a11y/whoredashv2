import { 
  type User, type InsertUser, type UpsertUser,
  type Companion, type InsertCompanion,
  type Booking, type InsertBooking,
  type Review, type InsertReview,
  type Testimonial, type InsertTestimonial
} from "@shared/schema";

export interface SearchFilters {
  searchTerm?: string;
  category?: string;
  location?: string;
  userLocation?: { lat: number; lng: number };
  maxDistance?: number;
  priceRange?: [number, number];
  minRating?: number;
  availability?: string;
  sortBy?: string;
}

export interface CompanionWithDistance extends Companion {
  distance?: number;
}

export interface IStorage {
  // User methods (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Additional user methods
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Companion methods
  getCompanion(id: number): Promise<Companion | undefined>;
  getCompanions(): Promise<Companion[]>;
  getCompanionsByLocation(location: string): Promise<Companion[]>;
  getAvailableCompanions(): Promise<Companion[]>;
  searchCompanions(filters: SearchFilters): Promise<CompanionWithDistance[]>;
  createCompanion(companion: InsertCompanion): Promise<Companion>;
  updateCompanion(id: number, updates: Partial<Companion>): Promise<Companion | undefined>;

  // Booking methods
  getBooking(id: number): Promise<Booking | undefined>;
  getBookings(): Promise<Booking[]>;
  getBookingsByClient(clientId: string): Promise<Booking[]>;
  getBookingsByCompanion(companionId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined>;

  // Review methods
  getReview(id: number): Promise<Review | undefined>;
  getReviews(): Promise<Review[]>;
  getReviewsByCompanion(companionId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;

  // Testimonial methods
  getTestimonials(): Promise<Testimonial[]>;
  getFeaturedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
}

export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private companions: Map<number, Companion> = new Map();
  private bookings: Map<number, Booking> = new Map();
  private reviews: Map<number, Review> = new Map();
  private testimonials: Map<number, Testimonial> = new Map();
  private nextCompanionId = 1;
  private nextBookingId = 1;
  private nextReviewId = 1;
  private nextTestimonialId = 1;

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Add sample companions
    const sampleCompanions: Companion[] = [
      {
        id: this.nextCompanionId++,
        userId: null,
        name: "Jessica",
        bio: "Professional companion with a passion for fine dining and cultural events.",
        location: "New York",
        latitude: "40.7128",
        longitude: "-74.0060",
        hourlyRate: "300",
        rating: "4.9",
        profileImage: "/api/placeholder/400/600",
        gallery: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
        categories: ["female", "dinner dates", "events", "companionship"],
        isAvailable: true,
        isVerified: true,
        responseRate: 98,
        totalBookings: 120
      },
      {
        id: this.nextCompanionId++,
        userId: null,
        name: "Marcus",
        bio: "Fitness enthusiast and great conversationalist for any occasion.",
        location: "Los Angeles",
        latitude: "34.0522",
        longitude: "-118.2437",
        hourlyRate: "250",
        rating: "4.8",
        profileImage: "/api/placeholder/400/600",
        gallery: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
        categories: ["male", "fitness", "events", "companionship"],
        isAvailable: true,
        isVerified: true,
        responseRate: 95,
        totalBookings: 85
      },
      {
        id: this.nextCompanionId++,
        userId: null,
        name: "Sophia",
        bio: "Creative and adventurous companion with a love for art and nightlife.",
        location: "Miami",
        latitude: "25.7617",
        longitude: "-80.1918",
        hourlyRate: "275",
        rating: "4.7",
        profileImage: "/api/placeholder/400/600",
        gallery: ["/api/placeholder/400/600", "/api/placeholder/400/600"],
        categories: ["trans", "events", "nightlife", "companionship"],
        isAvailable: true,
        isVerified: true,
        responseRate: 92,
        totalBookings: 98
      }
    ];

    sampleCompanions.forEach(companion => {
      this.companions.set(companion.id, companion);
    });

    // Add sample testimonials
    const sampleTestimonials: Testimonial[] = [
      {
        id: this.nextTestimonialId++,
        clientName: "David R.",
        clientTitle: "Business Executive",
        clientImage: null,
        content: "Exceptional service and professionalism. Highly recommend!",
        featured: true
      },
      {
        id: this.nextTestimonialId++,
        clientName: "Michael S.",
        clientTitle: "Tech Entrepreneur",
        clientImage: null,
        content: "Amazing experience. Professional and trustworthy.",
        featured: true
      }
    ];

    sampleTestimonials.forEach(testimonial => {
      this.testimonials.set(testimonial.id, testimonial);
    });
  }

  // User methods (required for Replit Auth)
  async getUser(id: string | number): Promise<User | undefined> {
    const userId = typeof id === 'string' ? id : String(id);
    return this.users.get(userId);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      ...userData,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      role: existingUser?.role || userData.role || "client",
      phone: userData.phone || existingUser?.phone || null,
      isVerified: userData.isVerified ?? existingUser?.isVerified ?? false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const existingUser = this.users.get(id);
    if (!existingUser) return undefined;
    
    const updatedUser: User = {
      ...existingUser,
      ...updates,
      updatedAt: new Date()
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Companion methods
  async getCompanion(id: number): Promise<Companion | undefined> {
    return this.companions.get(id);
  }

  async getCompanions(): Promise<Companion[]> {
    return Array.from(this.companions.values());
  }

  async getCompanionsByLocation(location: string): Promise<Companion[]> {
    return Array.from(this.companions.values()).filter(companion => 
      companion.location === location
    );
  }

  async getAvailableCompanions(): Promise<Companion[]> {
    return Array.from(this.companions.values()).filter(companion => 
      companion.isAvailable
    );
  }

  async searchCompanions(filters: SearchFilters): Promise<CompanionWithDistance[]> {
    let results = Array.from(this.companions.values());

    // Category filter
    if (filters.category && filters.category !== 'all') {
      results = results.filter(companion => 
        companion.categories?.some(cat => cat.toLowerCase() === filters.category?.toLowerCase())
      );
    }

    // Location filter
    if (filters.location && filters.location !== 'all') {
      results = results.filter(companion => companion.location === filters.location);
    }

    // Search term filter
    if (filters.searchTerm) {
      const searchTerm = filters.searchTerm.toLowerCase();
      results = results.filter(companion =>
        companion.name.toLowerCase().includes(searchTerm) ||
        companion.bio?.toLowerCase().includes(searchTerm) ||
        false
      );
    }

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      results = results.filter(companion => {
        const rate = parseFloat(companion.hourlyRate);
        return rate >= minPrice && rate <= maxPrice;
      });
    }

    // Rating filter
    if (filters.minRating && filters.minRating > 0) {
      results = results.filter(companion => {
        const rating = companion.rating ? parseFloat(companion.rating) : 0;
        return rating >= (filters.minRating || 0);
      });
    }

    // Availability filter
    if (filters.availability === 'available') {
      results = results.filter(companion => companion.isAvailable);
    } else if (filters.availability === 'verified') {
      results = results.filter(companion => companion.isVerified);
    }

    // Calculate distances if user location is provided
    let resultsWithDistance: CompanionWithDistance[] = results;
    if (filters.userLocation) {
      resultsWithDistance = results.map(companion => ({
        ...companion,
        distance: companion.latitude && companion.longitude
          ? this.calculateDistance(
              filters.userLocation!.lat,
              filters.userLocation!.lng,
              parseFloat(companion.latitude),
              parseFloat(companion.longitude)
            )
          : undefined
      })).filter(companion => 
        !filters.maxDistance || !companion.distance || companion.distance <= filters.maxDistance
      );
    }

    // Sort results
    if (filters.sortBy === 'distance' && filters.userLocation) {
      resultsWithDistance.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else if (filters.sortBy === 'price') {
      resultsWithDistance.sort((a, b) => parseFloat(a.hourlyRate) - parseFloat(b.hourlyRate));
    } else if (filters.sortBy === 'rating') {
      resultsWithDistance.sort((a, b) => parseFloat(b.rating || '0') - parseFloat(a.rating || '0'));
    } else if (filters.sortBy === 'popularity') {
      resultsWithDistance.sort((a, b) => (b.totalBookings || 0) - (a.totalBookings || 0));
    }

    return resultsWithDistance;
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959; // Radius of the Earth in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  async createCompanion(insertCompanion: InsertCompanion): Promise<Companion> {
    const companion: Companion = {
      ...insertCompanion,
      id: this.nextCompanionId++,
      userId: insertCompanion.userId || null,
      bio: insertCompanion.bio || null,
      latitude: insertCompanion.latitude || null,
      longitude: insertCompanion.longitude || null,
      profileImage: insertCompanion.profileImage || null,
      gallery: insertCompanion.gallery || null,
      categories: insertCompanion.categories || null,
      isAvailable: insertCompanion.isAvailable ?? true,
      isVerified: insertCompanion.isVerified ?? false,
      responseRate: insertCompanion.responseRate || null,
      rating: "0",
      totalBookings: 0
    };
    this.companions.set(companion.id, companion);
    return companion;
  }

  async updateCompanion(id: number, updates: Partial<Companion>): Promise<Companion | undefined> {
    const existingCompanion = this.companions.get(id);
    if (!existingCompanion) return undefined;

    const updatedCompanion: Companion = {
      ...existingCompanion,
      ...updates
    };
    this.companions.set(id, updatedCompanion);
    return updatedCompanion;
  }

  // Booking methods
  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async getBookings(): Promise<Booking[]> {
    return Array.from(this.bookings.values());
  }

  async getBookingsByClient(clientId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => 
      booking.clientId === clientId
    );
  }

  async getBookingsByCompanion(companionId: number): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter(booking => 
      booking.companionId === companionId
    );
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const booking: Booking = {
      ...insertBooking,
      id: this.nextBookingId++,
      clientId: insertBooking.clientId || null,
      companionId: insertBooking.companionId || null,
      status: insertBooking.status || "pending",
      specialRequests: insertBooking.specialRequests || null,
      createdAt: new Date()
    };
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async updateBooking(id: number, updates: Partial<Booking>): Promise<Booking | undefined> {
    const existingBooking = this.bookings.get(id);
    if (!existingBooking) return undefined;

    const updatedBooking: Booking = {
      ...existingBooking,
      ...updates
    };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  // Review methods
  async getReview(id: number): Promise<Review | undefined> {
    return this.reviews.get(id);
  }

  async getReviews(): Promise<Review[]> {
    return Array.from(this.reviews.values());
  }

  async getReviewsByCompanion(companionId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(review => 
      review.companionId === companionId
    );
  }

  async createReview(insertReview: InsertReview): Promise<Review> {
    const review: Review = {
      ...insertReview,
      id: this.nextReviewId++,
      bookingId: insertReview.bookingId || null,
      companionId: insertReview.companionId || null,
      comment: insertReview.comment || null
    };
    this.reviews.set(review.id, review);
    return review;
  }

  // Testimonial methods
  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async getFeaturedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(testimonial => 
      testimonial.featured
    );
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id: this.nextTestimonialId++,
      clientTitle: insertTestimonial.clientTitle || null,
      clientImage: insertTestimonial.clientImage || null,
      featured: insertTestimonial.featured ?? false
    };
    this.testimonials.set(testimonial.id, testimonial);
    return testimonial;
  }
}

export const storage = new MemoryStorage();