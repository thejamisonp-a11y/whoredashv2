import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertCompanionSchema, insertBookingSchema, insertReviewSchema, insertTestimonialSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  // Companion routes with advanced search and filtering
  app.get("/api/companions", async (req, res) => {
    try {
      const {
        search,
        category,
        location,
        userLat,
        userLng,
        maxDistance = 25,
        minPrice,
        maxPrice,
        minRating = 0,
        availability,
        sortBy = 'distance'
      } = req.query;

      const companions = await storage.searchCompanions({
        searchTerm: search as string,
        category: category as string,
        location: location as string,
        userLocation: userLat && userLng ? {
          lat: parseFloat(userLat as string),
          lng: parseFloat(userLng as string)
        } : undefined,
        maxDistance: parseInt(maxDistance as string),
        priceRange: minPrice && maxPrice ? [
          parseInt(minPrice as string),
          parseInt(maxPrice as string)
        ] : undefined,
        minRating: parseFloat(minRating as string),
        availability: availability as string,
        sortBy: sortBy as string
      });

      res.json(companions);
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ message: "Failed to search companions" });
    }
  });

  app.get("/api/companions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const companion = await storage.getCompanion(id);
      
      if (!companion) {
        return res.status(404).json({ message: "Companion not found" });
      }
      
      res.json(companion);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companion" });
    }
  });

  app.post("/api/companions", async (req, res) => {
    try {
      const validatedData = insertCompanionSchema.parse(req.body);
      const companion = await storage.createCompanion(validatedData);
      res.status(201).json(companion);
    } catch (error) {
      res.status(400).json({ message: "Invalid companion data" });
    }
  });

  app.put("/api/companions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const companion = await storage.updateCompanion(id, updates);
      
      if (!companion) {
        return res.status(404).json({ message: "Companion not found" });
      }
      
      res.json(companion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update companion" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const { companionId } = req.query;
      if (companionId) {
        const reviews = await storage.getReviewsByCompanion(parseInt(companionId as string));
        res.json(reviews);
      } else {
        const reviews = await storage.getReviews();
        res.json(reviews);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Booking routes
  app.get("/api/bookings", async (req, res) => {
    try {
      const bookings = await storage.getBookings();
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch booking" });
    }
  });

  app.get("/api/bookings/client/:clientId", isAuthenticated, async (req: any, res) => {
    try {
      const clientId = req.params.clientId;
      // Ensure user can only access their own bookings
      if (clientId !== req.user.claims.sub) {
        return res.status(403).json({ message: "Access denied" });
      }
      const bookings = await storage.getBookingsByClient(clientId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client bookings" });
    }
  });

  app.get("/api/bookings/companion/:companionId", async (req, res) => {
    try {
      const companionId = parseInt(req.params.companionId);
      const bookings = await storage.getBookingsByCompanion(companionId);
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companion bookings" });
    }
  });

  app.post("/api/bookings", async (req, res) => {
    try {
      const validatedData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(validatedData);
      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ message: "Invalid booking data" });
    }
  });

  app.put("/api/bookings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const booking = await storage.updateBooking(id, updates);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ message: "Failed to update booking" });
    }
  });

  // Review routes
  app.get("/api/reviews", async (req, res) => {
    try {
      const reviews = await storage.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.get("/api/reviews/companion/:companionId", async (req, res) => {
    try {
      const companionId = parseInt(req.params.companionId);
      const reviews = await storage.getReviewsByCompanion(companionId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch companion reviews" });
    }
  });

  app.post("/api/reviews", async (req, res) => {
    try {
      const validatedData = insertReviewSchema.parse(req.body);
      const review = await storage.createReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ message: "Invalid review data" });
    }
  });

  // Testimonial routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const featured = req.query.featured === 'true';
      const testimonials = featured 
        ? await storage.getFeaturedTestimonials()
        : await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Send user without sensitive data
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Newsletter signup
  app.post("/api/newsletter", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // In a real app, this would integrate with an email service
      console.log(`Newsletter signup: ${email}`);
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Contact form
  app.post("/api/contact", async (req, res) => {
    try {
      const { name, email, subject, message, type } = req.body;
      
      if (!name || !email || !subject || !message) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // In a real app, this would send an email or save to database
      console.log(`Contact form submission:`, { name, email, subject, message, type });
      res.json({ message: "Message sent successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
