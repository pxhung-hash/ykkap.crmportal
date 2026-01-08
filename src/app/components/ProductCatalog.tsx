import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Search, BookmarkPlus, Star, Grid3x3, List, LayoutGrid } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useState } from "react";

interface ProductCatalogProps {
  onViewProduct: (productId: number) => void;
}

export function ProductCatalog({ onViewProduct }: ProductCatalogProps) {
  const products = [
    {
      id: 1,
      name: "YKK AP 350 Series Window",
      category: "Windows",
      type: "Casement",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1647516887078-b9ecea36d93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBlbGV2YXRpb24lMjBhcmNoaXRlY3R1cmFsfGVufDF8fHx8MTc2NzAwNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "High-performance aluminum window system"
    },
    {
      id: 2,
      name: "YKK AP Storefront System",
      category: "Storefronts",
      type: "Fixed",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1763971052925-7af015f86152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tZXJjaWFsJTIwc3RvcmVmcm9udCUyMGVudHJhbmNlfGVufDF8fHx8MTc2NzAwNDkwNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Commercial grade storefront entrance system"
    },
    {
      id: 3,
      name: "YKK AP Door Hardware Kit",
      category: "Hardware",
      type: "Accessories",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1676762147275-65e76b41a892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwZWxldmF0aW9uJTIwYXJjaGl0ZWN0dXJhbHxlbnwxfHx8fDE3NjcwMDQ5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Complete door hardware installation kit"
    },
    {
      id: 4,
      name: "YKK AP Curtain Wall System",
      category: "Curtain Walls",
      type: "Unitized",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1667264963898-267d52c2e113?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJ0YWluJTIwd2FsbCUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2NzAwNDkwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Advanced curtain wall glazing system"
    },
    {
      id: 5,
      name: "YKK AP Thermal Break Frame",
      category: "Windows",
      type: "Sliding",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1626005592101-018b4e09eb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMHdpbmRvdyUyMHN5c3RlbXxlbnwxfHx8fDE3NjcwMDQ5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Energy-efficient thermal break window frame"
    },
    {
      id: 6,
      name: "YKK AP Sliding Door System",
      category: "Doors",
      type: "Sliding",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1762884820153-97349aad8f75?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkb29yJTIwc3lzdGVtfGVufDF8fHx8MTc2NzAwNDkwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Smooth-operating sliding door mechanism"
    },
    {
      id: 7,
      name: "YKK AP Awning Window",
      category: "Windows",
      type: "Awning",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1647516887078-b9ecea36d93a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aW5kb3clMjBlbGV2YXRpb24lMjBhcmNoaXRlY3R1cmFsfGVufDF8fHx8MTc2NzAwNDkwM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Ventilating awning window system"
    },
    {
      id: 8,
      name: "YKK AP Fixed Window",
      category: "Windows",
      type: "Fixed",
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1626005592101-018b4e09eb5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbHVtaW51bSUyMHdpbmRvdyUyMHN5c3RlbXxlbnwxfHx8fDE3NjcwMDQ5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Non-operable fixed picture window"
    },
    {
      id: 9,
      name: "YKK AP Swing Door",
      category: "Doors",
      type: "Swing",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1676762147275-65e76b41a892?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb29yJTIwZWxldmF0aW9uJTIwYXJjaGl0ZWN0dXJhbHxlbnwxfHx8fDE3NjcwMDQ5MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Hinged swing door system"
    },
  ];

  const [viewMode, setViewMode] = useState<"grid" | "list" | "compact">("grid");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");

  // Define types for each category
  const categoryTypes: Record<string, string[]> = {
    windows: ["Casement", "Sliding", "Awning", "Fixed"],
    doors: ["Sliding", "Swing", "Folding"],
    storefronts: ["Fixed", "Swing Door"],
    "curtain-walls": ["Unitized", "Stick Built"],
    hardware: ["Locks", "Handles", "Hinges", "Accessories"],
  };

  // Filter products based on selected category and type
  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    const typeMatch = selectedType === "all" || product.type === selectedType;
    return categoryMatch && typeMatch;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Product Catalog</h2>
        <p className="text-gray-500">Browse and order from our complete range of YKK AP products</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={(value) => {
          setSelectedCategory(value);
          setSelectedType("all"); // Reset type when category changes
        }}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="windows">Windows</SelectItem>
            <SelectItem value="doors">Doors</SelectItem>
            <SelectItem value="storefronts">Storefronts</SelectItem>
            <SelectItem value="curtain-walls">Curtain Walls</SelectItem>
            <SelectItem value="hardware">Hardware</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="featured">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center gap-1 border rounded-lg p-1 bg-white">
          <Button
            size="sm"
            className={`px-3 py-2 ${viewMode === "grid" ? "bg-gray-100" : "bg-transparent hover:bg-gray-50"}`}
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            onClick={() => setViewMode("grid")}
          >
            <Grid3x3 className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className={`px-3 py-2 ${viewMode === "compact" ? "bg-gray-100" : "bg-transparent hover:bg-gray-50"}`}
            variant={viewMode === "compact" ? "secondary" : "ghost"}
            onClick={() => setViewMode("compact")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            className={`px-3 py-2 ${viewMode === "list" ? "bg-gray-100" : "bg-transparent hover:bg-gray-50"}`}
            variant={viewMode === "list" ? "secondary" : "ghost"}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Type Filter Buttons - Show when a specific category is selected */}
      {selectedCategory !== "all" && categoryTypes[selectedCategory] && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedType === "all" ? "default" : "outline"}
            onClick={() => setSelectedType("all")}
            className={selectedType === "all" ? "bg-black text-white" : ""}
          >
            All {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </Button>
          {categoryTypes[selectedCategory].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={selectedType === type ? "default" : "outline"}
              onClick={() => setSelectedType(type)}
              className={selectedType === type ? "bg-black text-white" : ""}
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant="secondary" className="shrink-0">{product.category}</Badge>
                </div>
                <p className="text-sm text-gray-500">{product.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                  <span className="text-sm text-gray-500 ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                </div>
              </CardContent>
              <CardFooter className="gap-2">
                <Button className="flex-1" variant="outline" onClick={() => onViewProduct(product.id)}>View Details</Button>
                <Button className="flex-1">
                  <BookmarkPlus className="h-4 w-4 mr-2" />
                  Add to Library
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Compact View */}
      {viewMode === "compact" && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader className="p-4">
                <CardTitle className="text-sm line-clamp-2">{product.name}</CardTitle>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium">{product.rating}</span>
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button size="sm" className="w-full" variant="outline" onClick={() => onViewProduct(product.id)}>
                  View
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-64 aspect-[4/3] sm:aspect-auto overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <CardHeader className="flex-row items-start justify-between space-y-0 pb-4">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-xl">{product.name}</CardTitle>
                      <Badge variant="secondary" className="mt-2">{product.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{product.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({Math.floor(Math.random() * 100) + 20} reviews)</span>
                    </div>
                  </CardContent>
                  <CardFooter className="gap-2 pt-0">
                    <Button variant="outline" onClick={() => onViewProduct(product.id)}>
                      View Details
                    </Button>
                    <Button>
                      <BookmarkPlus className="h-4 w-4 mr-2" />
                      Add to Library
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}