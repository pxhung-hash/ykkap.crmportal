import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Plus,
  Filter,
  MoreVertical,
  Edit,
  Copy,
  Eye,
  Trash2,
  X,
  ChevronRight,
  TrendingUp,
  Package,
  FileText,
  Clock,
  ExternalLink,
  CheckCircle2,
  Box,
  Layers,
  BarChart3
} from "lucide-react";

interface ProductConfig {
  id: string;
  productName: string;
  configId: string;
  series: string;
  category: "Sliding" | "Door" | "Casement" | "Top Hung" | "Louver";
  depth: string;
  numberOfLeaves: number;
  outerBomId: string;
  innerBomId: string;
  configDate: string;
  status: "Active" | "Draft" | "Archived";
  windPressure: string;
  waterproof: string;
  usageCount: number;
}

const mockProducts: ProductConfig[] = [
  {
    id: "1",
    productName: "IWIN-S Sliding 2-Leaves",
    configId: "CFG-001",
    series: "IWIN S",
    category: "Sliding",
    depth: "50mm",
    numberOfLeaves: 2,
    outerBomId: "BOM-OUT-IWIN-S-SL-50",
    innerBomId: "BOM-INN-SL-2L-CRE",
    configDate: "2025-01-05",
    status: "Active",
    windPressure: "2000Pa",
    waterproof: "350Pa",
    usageCount: 15
  },
  {
    id: "2",
    productName: "IWIN-E Door Single Lock",
    configId: "CFG-002",
    series: "IWIN E",
    category: "Door",
    depth: "62.5mm",
    numberOfLeaves: 1,
    outerBomId: "BOM-OUT-IWIN-E-DR-62",
    innerBomId: "BOM-INN-DR-1L-LAT",
    configDate: "2025-01-04",
    status: "Active",
    windPressure: "2500Pa",
    waterproof: "600Pa",
    usageCount: 8
  },
  {
    id: "3",
    productName: "U4E Casement 3-Leaves",
    configId: "CFG-003",
    series: "U4E",
    category: "Casement",
    depth: "92.5mm",
    numberOfLeaves: 3,
    outerBomId: "BOM-OUT-U4E-CS-92",
    innerBomId: "BOM-INN-CS-3L-MUL",
    configDate: "2025-01-03",
    status: "Draft",
    windPressure: "1200Pa",
    waterproof: "300Pa",
    usageCount: 3
  },
  {
    id: "4",
    productName: "U4ES Top Hung 2-Leaves",
    configId: "CFG-004",
    series: "U4ES",
    category: "Top Hung",
    depth: "50mm",
    numberOfLeaves: 2,
    outerBomId: "BOM-OUT-U4ES-TH-50",
    innerBomId: "BOM-INN-TH-2L-STD",
    configDate: "2025-01-02",
    status: "Active",
    windPressure: "2000Pa",
    waterproof: "350Pa",
    usageCount: 12
  },
  {
    id: "5",
    productName: "IWIN-S Louver 4-Leaves",
    configId: "CFG-005",
    series: "IWIN S",
    category: "Louver",
    depth: "62.5mm",
    numberOfLeaves: 4,
    outerBomId: "BOM-OUT-IWIN-S-LV-62",
    innerBomId: "BOM-INN-LV-4L-SEC",
    configDate: "2024-12-28",
    status: "Archived",
    windPressure: "1200Pa",
    waterproof: "300Pa",
    usageCount: 0
  },
  {
    id: "6",
    productName: "IWIN-E Sliding 6-Leaves",
    configId: "CFG-006",
    series: "IWIN E",
    category: "Sliding",
    depth: "92.5mm",
    numberOfLeaves: 6,
    outerBomId: "BOM-OUT-IWIN-E-SL-92",
    innerBomId: "BOM-INN-SL-6L-MUL",
    configDate: "2025-01-05",
    status: "Draft",
    windPressure: "2500Pa",
    waterproof: "600Pa",
    usageCount: 2
  }
];

export function ProductManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductConfig | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filterSeries, setFilterSeries] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterWindPressure, setFilterWindPressure] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showActionsMenu, setShowActionsMenu] = useState<string | null>(null);
  const [products, setProducts] = useState<ProductConfig[]>(mockProducts);

  // Calculate KPIs
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "Active").length;
  const drafts = products.filter(p => p.status === "Draft").length;
  const recentUpdates = products.filter(p => {
    const configDate = new Date(p.configDate);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return configDate >= yesterday;
  }).length;

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.configId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.outerBomId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.innerBomId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeries = !filterSeries || product.series === filterSeries;
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesWindPressure = !filterWindPressure || product.windPressure === filterWindPressure;
    const matchesStatus = !filterStatus || product.status === filterStatus;

    return matchesSearch && matchesSeries && matchesCategory && matchesWindPressure && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleToggleStatus = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, status: p.status === "Active" ? "Draft" : "Active" } as ProductConfig;
      }
      return p;
    }));
  };

  const handleDelete = (productId: string) => {
    if (confirm("Are you sure you want to delete this product configuration?")) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null);
      }
      alert("Product configuration deleted successfully!");
    }
  };

  const handleDuplicate = (product: ProductConfig) => {
    const newProduct: ProductConfig = {
      ...product,
      id: String(Date.now()),
      configId: `CFG-${String(products.length + 1).padStart(3, '0')}`,
      productName: `${product.productName} (Copy)`,
      status: "Draft",
      configDate: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    setProducts([...products, newProduct]);
    alert("Product configuration duplicated successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-300";
      case "Draft":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "Archived":
        return "bg-gray-100 text-gray-700 border-gray-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Sliding":
        return "⇄";
      case "Door":
        return "🚪";
      case "Casement":
        return "↗";
      case "Top Hung":
        return "↑";
      case "Louver":
        return "≡";
      default:
        return "□";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Sliding":
        return "bg-blue-100 text-blue-700";
      case "Door":
        return "bg-purple-100 text-purple-700";
      case "Casement":
        return "bg-green-100 text-green-700";
      case "Top Hung":
        return "bg-orange-100 text-orange-700";
      case "Louver":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Top Header */}
      <div className="bg-white border-b sticky top-0 z-40 w-full">
        <div className="px-4 md:px-6 lg:px-8 py-4 w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div className="w-full md:w-auto">
              <h1 className="text-xl md:text-2xl lg:text-3xl text-gray-900 mb-1">Product Management</h1>
              <p className="text-xs md:text-sm text-gray-500">
                Manage and monitor all configured window/door products
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Create New Configuration
            </Button>
          </div>

          {/* Global Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Product Name or BOM ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-gray-50 w-full"
            />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6 w-full">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 w-full">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white w-full">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Total Products</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{totalProducts}</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <Package className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white w-full">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Active Systems</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{activeProducts}</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <CheckCircle2 className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-yellow-100 bg-gradient-to-br from-yellow-50 to-white w-full">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Drafts</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{drafts}</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <FileText className="h-5 w-5 md:h-6 md:w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-white w-full">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1">Recent Updates</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{recentUpdates}</p>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </div>
                <div className="h-10 w-10 md:h-12 md:w-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                  <Clock className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filter Bar */}
        <Card className="mb-4 md:mb-6 w-full">
          <CardContent className="p-3 md:p-4">
            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Advanced Filters</span>
              </div>
              {(filterSeries || filterCategory || filterWindPressure || filterStatus) && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setFilterSeries("");
                    setFilterCategory("");
                    setFilterWindPressure("");
                    setFilterStatus("");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 w-full md:w-auto md:ml-auto"
                >
                  Clear All
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3 w-full">
              <select
                className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm w-full"
                value={filterSeries}
                onChange={(e) => setFilterSeries(e.target.value)}
              >
                <option value="">All Series</option>
                <option value="IWIN S">IWIN S</option>
                <option value="IWIN E">IWIN E</option>
                <option value="U4E">U4E</option>
                <option value="U4ES">U4ES</option>
              </select>

              <select
                className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm w-full"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Sliding">Sliding</option>
                <option value="Door">Door</option>
                <option value="Casement">Casement</option>
                <option value="Top Hung">Top Hung</option>
                <option value="Louver">Louver</option>
              </select>

              <select
                className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm w-full"
                value={filterWindPressure}
                onChange={(e) => setFilterWindPressure(e.target.value)}
              >
                <option value="">All Wind Pressure</option>
                <option value="1200Pa">1200 Pa</option>
                <option value="2000Pa">2000 Pa</option>
                <option value="2500Pa">2500 Pa</option>
              </select>

              <select
                className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm w-full"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 w-full">
          {/* Main Data Table */}
          <div className={selectedProduct ? "lg:col-span-8 w-full" : "lg:col-span-12 w-full"}>
            <Card className="w-full">
              <CardContent className="p-0">
                {/* Bulk Actions Bar */}
                {selectedIds.length > 0 && (
                  <div className="bg-blue-50 border-b border-blue-200 px-3 md:px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-sm text-blue-900 font-medium">
                      {selectedIds.length} item(s) selected
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-initial">
                        <Edit className="h-3 w-3 mr-1" />
                        Bulk Edit
                      </Button>
                      <Button size="sm" variant="outline" className="text-xs flex-1 sm:flex-initial">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete Selected
                      </Button>
                    </div>
                  </div>
                )}

                {/* Table */}
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="p-3 text-left w-12">
                          <input
                            type="checkbox"
                            checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="p-3 text-left font-medium text-gray-700">Product Name & ID</th>
                        <th className="p-3 text-left font-medium text-gray-700">Attributes</th>
                        <th className="p-3 text-left font-medium text-gray-700">Outer BOM ID</th>
                        <th className="p-3 text-left font-medium text-gray-700">Inner BOM ID</th>
                        <th className="p-3 text-left font-medium text-gray-700">Config Date</th>
                        <th className="p-3 text-left font-medium text-gray-700">Status</th>
                        <th className="p-3 text-left font-medium text-gray-700 w-16">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-1">No products found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((product) => (
                          <tr
                            key={product.id}
                            className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                              selectedProduct?.id === product.id ? "bg-blue-50" : ""
                            }`}
                            onClick={() => setSelectedProduct(product)}
                          >
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(product.id)}
                                onChange={() => handleSelectOne(product.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-gray-900">{product.productName}</p>
                                <p className="text-xs text-gray-500 font-mono">{product.configId}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-wrap gap-1">
                                <Badge variant="secondary" className="text-xs bg-indigo-100 text-indigo-700">
                                  {product.series}
                                </Badge>
                                <Badge variant="secondary" className={`text-xs ${getCategoryColor(product.category)}`}>
                                  {getCategoryIcon(product.category)} {product.category}
                                </Badge>
                                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                                  {product.depth}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-3">
                              <button className="text-blue-600 hover:text-blue-700 font-mono text-xs flex items-center gap-1">
                                {product.outerBomId}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </td>
                            <td className="p-3">
                              <button className="text-purple-600 hover:text-purple-700 font-mono text-xs flex items-center gap-1">
                                {product.innerBomId}
                                <ExternalLink className="h-3 w-3" />
                              </button>
                            </td>
                            <td className="p-3 text-gray-600">{product.configDate}</td>
                            <td className="p-3">
                              <Badge className={`text-xs ${getStatusColor(product.status)}`}>
                                {product.status}
                              </Badge>
                            </td>
                            <td className="p-3" onClick={(e) => e.stopPropagation()}>
                              <div className="relative">
                                <button
                                  onClick={() => setShowActionsMenu(showActionsMenu === product.id ? null : product.id)}
                                  className="p-1 hover:bg-gray-100 rounded"
                                >
                                  <MoreVertical className="h-4 w-4 text-gray-600" />
                                </button>
                                {showActionsMenu === product.id && (
                                  <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    <button
                                      onClick={() => {
                                        setShowActionsMenu(null);
                                        alert("Edit functionality would open Product Configuration Master");
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                    >
                                      <Edit className="h-4 w-4 text-blue-600" />
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowActionsMenu(null);
                                        handleDuplicate(product);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                    >
                                      <Copy className="h-4 w-4 text-green-600" />
                                      Duplicate
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowActionsMenu(null);
                                        setSelectedProduct(product);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                                    >
                                      <Eye className="h-4 w-4 text-purple-600" />
                                      View BOM Details
                                    </button>
                                    <div className="border-t"></div>
                                    <button
                                      onClick={() => {
                                        setShowActionsMenu(null);
                                        handleDelete(product.id);
                                      }}
                                      className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-sm text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {filteredProducts.length > 0 && (
                  <div className="border-t p-3 md:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-gray-600">
                    <span className="text-xs md:text-sm">Showing {filteredProducts.length} of {totalProducts} products</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" disabled className="flex-1 sm:flex-initial">Previous</Button>
                      <Button size="sm" variant="outline" disabled className="flex-1 sm:flex-initial">Next</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Quick Info */}
          {selectedProduct && (
            <div className="lg:col-span-4 w-full">
              <Card className="sticky top-24 border-2 border-blue-200 w-full">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b p-3 md:p-4 flex items-center justify-between">
                  <h3 className="text-sm md:text-base font-semibold text-gray-900">Quick Info</h3>
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="p-1 hover:bg-white rounded"
                  >
                    <X className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <CardContent className="p-3 md:p-4 space-y-4">
                  {/* Thumbnail */}
                  <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-4 md:p-6 text-center w-full">
                    <div className="text-4xl md:text-6xl mb-2">{getCategoryIcon(selectedProduct.category)}</div>
                    <p className="text-xs md:text-sm font-medium text-gray-700">{selectedProduct.category}</p>
                  </div>

                  {/* Product Details */}
                  <div className="w-full">
                    <h4 className="text-sm md:text-base font-medium text-gray-900 mb-2">{selectedProduct.productName}</h4>
                    <p className="text-xs text-gray-500 font-mono mb-3">{selectedProduct.configId}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="secondary" className="text-xs">{selectedProduct.series}</Badge>
                      <Badge variant="secondary" className="text-xs">{selectedProduct.depth}</Badge>
                      <Badge variant="secondary" className="text-xs">{selectedProduct.numberOfLeaves}L</Badge>
                    </div>
                  </div>

                  {/* Linked BOMs */}
                  <div className="border-t pt-4 w-full">
                    <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Linked BOMs
                    </h4>
                    <div className="space-y-2 w-full">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Box className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-medium text-gray-700">Outer BOM</span>
                        </div>
                        <p className="text-xs font-mono text-green-700 break-all">{selectedProduct.outerBomId}</p>
                        <button className="text-xs text-green-700 hover:text-green-800 mt-1 flex items-center gap-1">
                          View Details <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 w-full">
                        <div className="flex items-center gap-2 mb-1">
                          <Layers className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium text-gray-700">Inner BOM</span>
                        </div>
                        <p className="text-xs font-mono text-purple-700 break-all">{selectedProduct.innerBomId}</p>
                        <button className="text-xs text-purple-700 hover:text-purple-800 mt-1 flex items-center gap-1">
                          View Details <ExternalLink className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Performance Stats */}
                  <div className="border-t pt-4 w-full">
                    <h4 className="text-xs md:text-sm font-medium text-gray-700 mb-3">Performance Specs</h4>
                    <div className="grid grid-cols-2 gap-2 w-full">
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Wind Pressure</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.windPressure}</p>
                      </div>
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-500">Waterproof</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedProduct.waterproof}</p>
                      </div>
                    </div>
                  </div>

                  {/* Usage Statistics */}
                  <div className="border-t pt-4 w-full">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 w-full">
                      <div className="flex items-center gap-2 mb-2">
                        <BarChart3 className="h-4 w-4 text-orange-600" />
                        <h4 className="text-xs md:text-sm font-medium text-gray-700">Usage Statistics</h4>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-orange-600 mb-1">{selectedProduct.usageCount}</p>
                      <p className="text-xs text-gray-600">Used in current project quotes</p>
                    </div>
                  </div>

                  {/* Quick Toggle */}
                  <div className="border-t pt-4 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs md:text-sm font-medium text-gray-700">FAB Portal Status</h4>
                        <p className="text-xs text-gray-500">Toggle availability for fabricators</p>
                      </div>
                      <label className="relative inline-block w-11 h-6 cursor-pointer flex-shrink-0">
                        <input
                          type="checkbox"
                          checked={selectedProduct.status === "Active"}
                          onChange={() => handleToggleStatus(selectedProduct.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="border-t pt-4 space-y-2 w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Configuration
                    </Button>
                    <Button variant="outline" className="w-full text-sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate Product
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}