import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, Download, FileText, Eye, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function Documents() {
  const documents = [
    {
      id: 1,
      name: "Product Catalog 2024",
      type: "Catalog",
      category: "Product Info",
      size: "12.5 MB",
      date: "Dec 15, 2024",
      format: "PDF"
    },
    {
      id: 2,
      name: "Installation Guide - Window Systems",
      type: "Guide",
      category: "Technical",
      size: "3.2 MB",
      date: "Dec 10, 2024",
      format: "PDF"
    },
    {
      id: 3,
      name: "Invoice - ORD-2024-1245",
      type: "Invoice",
      category: "Financial",
      size: "245 KB",
      date: "Dec 28, 2024",
      format: "PDF"
    },
    {
      id: 4,
      name: "Warranty Information",
      type: "Legal",
      category: "Warranty",
      size: "892 KB",
      date: "Jan 1, 2024",
      format: "PDF"
    },
    {
      id: 5,
      name: "Product Specifications Sheet",
      type: "Specifications",
      category: "Technical",
      size: "1.8 MB",
      date: "Nov 28, 2024",
      format: "PDF"
    },
    {
      id: 6,
      name: "Dealer Agreement 2024",
      type: "Contract",
      category: "Legal",
      size: "456 KB",
      date: "Jan 1, 2024",
      format: "PDF"
    },
    {
      id: 7,
      name: "Safety Guidelines",
      type: "Guide",
      category: "Safety",
      size: "2.1 MB",
      date: "Jan 5, 2024",
      format: "PDF"
    },
    {
      id: 8,
      name: "Order History 2024",
      type: "Report",
      category: "Financial",
      size: "578 KB",
      date: "Dec 29, 2024",
      format: "XLSX"
    },
    {
      id: 9,
      name: "Training Materials",
      type: "Training",
      category: "Education",
      size: "15.3 MB",
      date: "Feb 1, 2024",
      format: "PDF"
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Product Info":
        return "default";
      case "Technical":
        return "secondary";
      case "Financial":
        return "outline";
      case "Legal":
        return "destructive";
      case "Safety":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Document Library</h2>
        <p className="text-gray-500">Access all your YKK AP documents and resources</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search documents..."
            className="pl-10"
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="product">Product Info</SelectItem>
            <SelectItem value="technical">Technical</SelectItem>
            <SelectItem value="financial">Financial</SelectItem>
            <SelectItem value="legal">Legal</SelectItem>
            <SelectItem value="safety">Safety</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <FileText className="h-8 w-8 text-blue-600 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">127</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <Download className="h-8 w-8 text-green-600 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Downloads This Month</p>
            <p className="text-2xl font-bold text-gray-900">48</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <FileText className="h-8 w-8 text-purple-600 mb-2" />
            <p className="text-sm text-gray-600 mb-1">Recently Added</p>
            <p className="text-2xl font-bold text-gray-900">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                      <Badge variant={getCategoryColor(doc.category)}>
                        {doc.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span className="font-mono text-xs">{doc.format}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
