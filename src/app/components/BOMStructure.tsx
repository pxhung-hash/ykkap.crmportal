import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  Wrench,
  ArrowLeft,
  Calculator,
  CheckCircle,
  Package,
  ChevronDown,
  ChevronRight,
  Download,
  Upload,
  Filter
} from "lucide-react";

// BOM Structure Management Component
interface BOMItem {
  id: number;
  itemCode: string;
  description: string;
  itemType: string;
  formula: string;
  qtyPerWindow: number;
  weightPerMeter: number;
  unit: string;
}

interface ProductBOM {
  productCode: string;
  productName: string;
  series: string;
  category: string;
  bomItems: BOMItem[];
}

export function BOMStructure() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [expandedProducts, setExpandedProducts] = useState<Set<string>>(new Set());
  const [configuringProduct, setConfiguringProduct] = useState<string | null>(null);
  const [bomItems, setBOMItems] = useState<BOMItem[]>([]);
  const [newBOMItem, setNewBOMItem] = useState({
    itemCode: "",
    description: "",
    itemType: "profile",
    formula: "",
    qtyPerWindow: 1,
    weightPerMeter: 0,
    unit: "mm"
  });

  // Sample BOM data
  const [productBOMs, setProductBOMs] = useState<ProductBOM[]>([
    {
      productCode: "YKK-350",
      productName: "Sliding Window",
      series: "350 Series",
      category: "Windows",
      bomItems: [
        {
          id: 1,
          itemCode: "PRF-350-HF",
          description: "350 Series Head Frame",
          itemType: "profile",
          formula: "W - 40",
          qtyPerWindow: 1,
          weightPerMeter: 1.2,
          unit: "mm"
        },
        {
          id: 2,
          itemCode: "PRF-350-SF",
          description: "350 Series Sill Frame",
          itemType: "profile",
          formula: "W - 40",
          qtyPerWindow: 1,
          weightPerMeter: 1.5,
          unit: "mm"
        },
        {
          id: 3,
          itemCode: "PRF-350-JF",
          description: "350 Series Jamb Frame",
          itemType: "profile",
          formula: "H - 40",
          qtyPerWindow: 2,
          weightPerMeter: 1.2,
          unit: "mm"
        },
        {
          id: 4,
          itemCode: "HW-350-ROL",
          description: "Sliding Roller Assembly",
          itemType: "hardware",
          formula: "1",
          qtyPerWindow: 4,
          weightPerMeter: 0,
          unit: "pcs"
        },
        {
          id: 5,
          itemCode: "GSK-350-WS",
          description: "Weatherseal Gasket",
          itemType: "gasket",
          formula: "(W + H) * 2",
          qtyPerWindow: 1,
          weightPerMeter: 0.05,
          unit: "mm"
        }
      ]
    },
    {
      productCode: "YKK-450",
      productName: "Casement Window",
      series: "450 Series",
      category: "Windows",
      bomItems: [
        {
          id: 6,
          itemCode: "PRF-450-HF",
          description: "450 Series Head Frame",
          itemType: "profile",
          formula: "W - 50",
          qtyPerWindow: 1,
          weightPerMeter: 1.4,
          unit: "mm"
        },
        {
          id: 7,
          itemCode: "PRF-450-SF",
          description: "450 Series Sill Frame",
          itemType: "profile",
          formula: "W - 50",
          qtyPerWindow: 1,
          weightPerMeter: 1.6,
          unit: "mm"
        },
        {
          id: 8,
          itemCode: "PRF-450-JF",
          description: "450 Series Jamb Frame",
          itemType: "profile",
          formula: "H - 50",
          qtyPerWindow: 2,
          weightPerMeter: 1.4,
          unit: "mm"
        },
        {
          id: 9,
          itemCode: "HW-450-HNG",
          description: "Casement Hinge",
          itemType: "hardware",
          formula: "1",
          qtyPerWindow: 3,
          weightPerMeter: 0,
          unit: "pcs"
        }
      ]
    },
    {
      productCode: "YKK-550",
      productName: "Awning Window",
      series: "550 Series",
      category: "Windows",
      bomItems: [
        {
          id: 10,
          itemCode: "PRF-550-HF",
          description: "550 Series Head Frame",
          itemType: "profile",
          formula: "W - 45",
          qtyPerWindow: 1,
          weightPerMeter: 1.3,
          unit: "mm"
        },
        {
          id: 11,
          itemCode: "PRF-550-SF",
          description: "550 Series Sill Frame",
          itemType: "profile",
          formula: "W - 45",
          qtyPerWindow: 1,
          weightPerMeter: 1.5,
          unit: "mm"
        }
      ]
    }
  ]);

  const toggleProduct = (productCode: string) => {
    const newExpanded = new Set(expandedProducts);
    if (newExpanded.has(productCode)) {
      newExpanded.delete(productCode);
    } else {
      newExpanded.add(productCode);
    }
    setExpandedProducts(newExpanded);
  };

  const getItemTypeColor = (type: string) => {
    switch (type) {
      case "profile":
        return "bg-blue-100 text-blue-700";
      case "hardware":
        return "bg-purple-100 text-purple-700";
      case "accessory":
        return "bg-green-100 text-green-700";
      case "gasket":
        return "bg-orange-100 text-orange-700";
      case "glass":
        return "bg-cyan-100 text-cyan-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredProducts = productBOMs.filter(product => {
    const matchesSearch = 
      product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.series.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // If configuring a specific product
  if (configuringProduct) {
    const product = productBOMs.find(p => p.productCode === configuringProduct);
    if (!product) return null;

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setConfiguringProduct(null);
                setBOMItems([]);
              }} 
              className="mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to BOM List
            </Button>
            <h2 className="text-gray-900 mb-2">Configure BOM Structure</h2>
            <p className="text-gray-500">Configure Bill of Materials for {product.productName}</p>
          </div>
          <Button onClick={() => {
            // Save BOM configuration
            const updatedProducts = productBOMs.map(p => {
              if (p.productCode === configuringProduct) {
                return { ...p, bomItems: bomItems.length > 0 ? bomItems : p.bomItems };
              }
              return p;
            });
            setProductBOMs(updatedProducts);
            alert("BOM configuration saved!");
            setConfiguringProduct(null);
            setBOMItems([]);
          }}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Save BOM Configuration
          </Button>
        </div>

        {/* Product Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Product Code</p>
                <p className="font-medium text-gray-900">{product.productCode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Product Name</p>
                <p className="font-medium text-gray-900">{product.productName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Series</p>
                <p className="font-medium text-gray-900">{product.series}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-medium text-gray-900">{product.category}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formula Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Formula Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-medium text-blue-900 mb-2">Available Variables:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">W</code>
                  <span className="text-gray-600 ml-2">Width (mm)</span>
                </div>
                <div>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">H</code>
                  <span className="text-gray-600 ml-2">Height (mm)</span>
                </div>
                <div>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">P</code>
                  <span className="text-gray-600 ml-2">Perimeter</span>
                </div>
                <div>
                  <code className="bg-white px-2 py-1 rounded text-blue-600">A</code>
                  <span className="text-gray-600 ml-2">Area</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                <strong>Example formulas:</strong> <code className="bg-white px-2 py-1 rounded">W - 40</code>, 
                <code className="bg-white px-2 py-1 rounded ml-2">H - 40</code>, 
                <code className="bg-white px-2 py-1 rounded ml-2">(W + H) * 2</code>,
                <code className="bg-white px-2 py-1 rounded ml-2">W / 2 - 50</code>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Add New BOM Item */}
        <Card>
          <CardHeader>
            <CardTitle>Add BOM Item</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => {
              e.preventDefault();
              const newItem = { ...newBOMItem, id: Date.now() };
              setBOMItems([...bomItems, newItem]);
              setNewBOMItem({
                itemCode: "",
                description: "",
                itemType: "profile",
                formula: "",
                qtyPerWindow: 1,
                weightPerMeter: 0,
                unit: "mm"
              });
            }} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-code">Item Code *</Label>
                  <Input
                    id="item-code"
                    value={newBOMItem.itemCode}
                    onChange={(e) => setNewBOMItem({...newBOMItem, itemCode: e.target.value})}
                    placeholder="e.g., PRF-350-HF"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="item-description">Description *</Label>
                  <Input
                    id="item-description"
                    value={newBOMItem.description}
                    onChange={(e) => setNewBOMItem({...newBOMItem, description: e.target.value})}
                    placeholder="e.g., 350 Series Head Frame"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="item-type">Item Type *</Label>
                  <Select 
                    value={newBOMItem.itemType}
                    onValueChange={(value) => setNewBOMItem({...newBOMItem, itemType: value})}
                  >
                    <SelectTrigger id="item-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profile">Profile</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="accessory">Accessory</SelectItem>
                      <SelectItem value="gasket">Gasket</SelectItem>
                      <SelectItem value="glass">Glass</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formula">Formula *</Label>
                  <Input
                    id="formula"
                    value={newBOMItem.formula}
                    onChange={(e) => setNewBOMItem({...newBOMItem, formula: e.target.value})}
                    placeholder="e.g., W - 40"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="qty-per-window">Qty/Window *</Label>
                  <Input
                    id="qty-per-window"
                    type="number"
                    min="1"
                    value={newBOMItem.qtyPerWindow}
                    onChange={(e) => setNewBOMItem({...newBOMItem, qtyPerWindow: parseInt(e.target.value)})}
                    required
                  />
                </div>
                {newBOMItem.itemType === "profile" && (
                  <div className="space-y-2">
                    <Label htmlFor="weight-per-meter">Weight/m (kg)</Label>
                    <Input
                      id="weight-per-meter"
                      type="number"
                      step="0.01"
                      value={newBOMItem.weightPerMeter}
                      onChange={(e) => setNewBOMItem({...newBOMItem, weightPerMeter: parseFloat(e.target.value)})}
                    />
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item to BOM
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current BOM Items */}
        <Card>
          <CardHeader>
            <CardTitle>
              Current BOM Structure ({bomItems.length > 0 ? bomItems.length : product.bomItems.length} items)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bomItems.length === 0 && product.bomItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p>No BOM items configured yet.</p>
                <p className="text-sm">Add items using the form above.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {["profile", "hardware", "accessory", "gasket", "glass"].map(type => {
                  const items = bomItems.length > 0 
                    ? bomItems.filter(item => item.itemType === type)
                    : product.bomItems.filter(item => item.itemType === type);
                  
                  if (items.length === 0) return null;
                  
                  return (
                    <div key={type}>
                      <h3 className="font-medium text-gray-900 mb-2 capitalize bg-gray-50 px-3 py-2 rounded">
                        {type}s ({items.length})
                      </h3>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div key={item.id} className="border rounded-lg p-4 hover:border-blue-300 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3">
                                <div>
                                  <p className="text-xs text-gray-500">Item Code</p>
                                  <p className="font-medium text-gray-900">{item.itemCode}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs text-gray-500">Description</p>
                                  <p className="font-medium text-gray-900">{item.description}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Formula</p>
                                  <code className="text-sm bg-blue-50 px-2 py-1 rounded text-blue-600">{item.formula}</code>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500">Qty/Window</p>
                                  <p className="font-medium text-gray-900">{item.qtyPerWindow}</p>
                                </div>
                                {item.itemType === "profile" && item.weightPerMeter > 0 && (
                                  <div>
                                    <p className="text-xs text-gray-500">Weight/m</p>
                                    <p className="font-medium text-gray-900">{item.weightPerMeter} kg</p>
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2 ml-4">
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => {
                                    if (bomItems.length > 0) {
                                      setBOMItems(bomItems.filter(i => i.id !== item.id));
                                    }
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formula Test Calculator */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Test BOM Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Width (mm)</Label>
                  <Input type="number" placeholder="1200" id="test-width" />
                </div>
                <div className="space-y-2">
                  <Label>Height (mm)</Label>
                  <Input type="number" placeholder="1500" id="test-height" />
                </div>
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input type="number" placeholder="10" id="test-qty" />
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  const W = parseFloat((document.getElementById('test-width') as HTMLInputElement)?.value || "0");
                  const H = parseFloat((document.getElementById('test-height') as HTMLInputElement)?.value || "0");
                  const qty = parseInt((document.getElementById('test-qty') as HTMLInputElement)?.value || "1");
                  const items = bomItems.length > 0 ? bomItems : product.bomItems;
                  
                  if (W > 0 && H > 0) {
                    let results = "BOM Calculation Results:\n\n";
                    items.forEach(item => {
                      try {
                        const formula = item.formula.replace(/W/g, W.toString()).replace(/H/g, H.toString());
                        const result = eval(formula);
                        results += `${item.itemCode}: ${result.toFixed(2)}mm x ${item.qtyPerWindow} = ${(result * item.qtyPerWindow).toFixed(2)}mm per window\n`;
                        results += `Total for ${qty} windows: ${(result * item.qtyPerWindow * qty).toFixed(2)}mm\n\n`;
                      } catch (e) {
                        results += `${item.itemCode}: Error in formula\n\n`;
                      }
                    });
                    alert(results);
                  } else {
                    alert("Please enter valid width and height values.");
                  }
                }}
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate BOM
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main BOM Structure List View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">BOM Structure Management</h2>
          <p className="text-gray-500">Configure and manage Bill of Materials for all products</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export BOM
          </Button>
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import BOM
          </Button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by product code, name, or series..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Windows">Windows</SelectItem>
            <SelectItem value="Doors">Doors</SelectItem>
            <SelectItem value="Curtain Walls">Curtain Walls</SelectItem>
            <SelectItem value="Storefronts">Storefronts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{productBOMs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Configured BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{productBOMs.filter(p => p.bomItems.length > 0).length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total BOM Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {productBOMs.reduce((acc, p) => acc + p.bomItems.length, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wrench className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Items/BOM</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {productBOMs.length > 0 
                    ? (productBOMs.reduce((acc, p) => acc + p.bomItems.length, 0) / productBOMs.length).toFixed(1)
                    : 0
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calculator className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product BOM List */}
      <Card>
        <CardHeader>
          <CardTitle>Product BOM Configurations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredProducts.map((product) => (
              <div key={product.productCode} className="p-4 hover:bg-gray-50 transition-colors">
                {/* Product Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleProduct(product.productCode)}
                      className="p-0 h-8 w-8"
                    >
                      {expandedProducts.has(product.productCode) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </Button>
                    <div className="flex-1 grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Product Code</p>
                        <p className="font-medium text-gray-900">{product.productCode}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Product Name</p>
                        <p className="font-medium text-gray-900">{product.productName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Series</p>
                        <p className="text-gray-600">{product.series}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">BOM Items</p>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          {product.bomItems.length} items
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => toggleProduct(product.productCode)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setConfiguringProduct(product.productCode);
                        setBOMItems([]);
                      }}
                    >
                      <Wrench className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                </div>

                {/* Expanded BOM Details */}
                {expandedProducts.has(product.productCode) && (
                  <div className="mt-4 pl-12 space-y-3">
                    {product.bomItems.length === 0 ? (
                      <p className="text-sm text-gray-500 italic py-4">No BOM items configured for this product.</p>
                    ) : (
                      <>
                        {/* Group by type */}
                        {["profile", "hardware", "accessory", "gasket", "glass"].map(type => {
                          const items = product.bomItems.filter(item => item.itemType === type);
                          if (items.length === 0) return null;

                          return (
                            <div key={type} className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700 capitalize bg-gray-100 px-3 py-1 rounded">
                                {type}s ({items.length})
                              </h4>
                              <div className="space-y-1">
                                {items.map((item) => (
                                  <div key={item.id} className="flex items-center gap-4 text-sm border-l-2 border-gray-200 pl-4 py-2">
                                    <Badge variant="secondary" className={getItemTypeColor(item.itemType)}>
                                      {item.itemType}
                                    </Badge>
                                    <div className="flex-1 grid grid-cols-4 gap-3">
                                      <div>
                                        <span className="text-gray-500">Code:</span>
                                        <span className="ml-2 font-medium">{item.itemCode}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Description:</span>
                                        <span className="ml-2">{item.description}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Formula:</span>
                                        <code className="ml-2 bg-blue-50 px-2 py-0.5 rounded text-blue-600">
                                          {item.formula}
                                        </code>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Qty:</span>
                                        <span className="ml-2 font-medium">{item.qtyPerWindow}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}