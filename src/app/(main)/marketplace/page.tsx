"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  Heart,
  Star,
  MapPin,
  Tag,
} from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Badge } from "@/shared/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/tabs";
import { mockUsers } from "@/lib/mock-data";

const marketplaceItems = [
  { id: "1", title: "Calculus Textbook (8th Ed)", description: "Thomas Calculus, barely used, like new condition", price: 45, currency: "USD", category: "books", condition: "used" as const, seller: mockUsers[0] },
  { id: "2", title: "Scientific Calculator TI-84", description: "Texas Instruments TI-84 Plus, works perfectly", price: 65, currency: "USD", category: "electronics", condition: "used" as const, seller: mockUsers[1] },
  { id: "3", title: "Python Programming Course", description: "Complete Python bootcamp, 50+ hours of content", price: 29, currency: "USD", category: "courses", condition: "new" as const, seller: mockUsers[3] },
  { id: "4", title: "Physics Lab Manual", description: "Comprehensive lab manual for physics courses", price: 20, currency: "USD", category: "books", condition: "used" as const, seller: mockUsers[2] },
  { id: "5", title: "Wireless Headphones", description: "Sony WH-1000XM4, noise cancelling, great for studying", price: 180, currency: "USD", category: "electronics", condition: "used" as const, seller: mockUsers[4] },
  { id: "6", title: "Machine Learning Course", description: "Andrew Ng's ML course materials and projects", price: 35, currency: "USD", category: "courses", condition: "new" as const, seller: mockUsers[3] },
];

const categoryColors: Record<string, string> = {
  books: "text-primary",
  electronics: "text-accent",
  courses: "text-secondary",
};

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Marketplace
          </h1>
          <Button>
            <Tag className="h-4 w-4 mr-1" />
            Sell Item
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="books">Books</TabsTrigger>
            <TabsTrigger value="electronics">Electronics</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {marketplaceItems
                .filter((item) => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all"
                >
                  <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center relative">
                    <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                    <Badge className="absolute top-2 right-2 capitalize" variant={item.condition === "new" ? "success" : "outline"}>
                      {item.condition}
                    </Badge>
                    <Button variant="ghost" size="icon-sm" className="absolute top-2 left-2">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <p className="text-lg font-bold text-primary shrink-0">${item.price}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>{item.seller.name}</span>
                      </div>
                      <Button size="sm" className="h-7 text-xs">Contact</Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {["books", "electronics", "courses"].map((category) => (
            <TabsContent key={category} value={category} className="mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {marketplaceItems
                  .filter((item) => item.category === category && item.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="rounded-2xl border border-border bg-card overflow-hidden"
                  >
                    <div className="h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <p className="text-lg font-bold text-primary">${item.price}</p>
                        <Button size="sm">Contact</Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
