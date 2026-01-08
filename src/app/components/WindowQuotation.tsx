import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  Plus, 
  Trash2, 
  Calculator, 
  Download, 
  Save,
  Package,
  Ruler,
  Layers,
  Hash
} from "lucide-react";

interface QuotationItem {
  id: string;
  productId: string;
  productName: string;
  productSeries: string;
  width: number;
  height: number;
  quantity: number;
  glassThickness: string;
  glassType: string;
  calculatedBOM: any;
}

export function WindowQuotation() {
  const [quotationItems, setQuotationItems] = useState<QuotationItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [glassThickness, setGlassThickness] = useState("6");
  const [glassType, setGlassType] = useState("float");

  // Mock product list - in production this would come from API
  const products = [
    { id: "P001", name: "YKK AP 350 Series Window", series: "350 Series", category: "Windows" },
    { id: "P002", name: "YKK AP 450 Series Window", series: "450 Series", category: "Windows" },
    { id: "P003", name: "YKK AP 550 Series Window", series: "550 Series", category: "Windows" },
  ];

  // Mock BOM template
  const getBOMTemplate = (productId: string) => {
    return {
      profiles: [
        { itemCode: "PRF-350-HF", description: "350 Series Head Frame", unitLength: 1, weightPerMeter: 1.85 },
        { itemCode: "PRF-350-SF", description: "350 Series Sill Frame", unitLength: 1, weightPerMeter: 2.15 },
        { itemCode: "PRF-350-JB", description: "350 Series Jamb Frame", unitLength: 1, weightPerMeter: 1.95 },
        { itemCode: "PRF-350-ST", description: "350 Series Sash Top", unitLength: 0.5, weightPerMeter: 1.45 },
        { itemCode: "PRF-350-SB", description: "350 Series Sash Bottom", unitLength: 0.5, weightPerMeter: 1.55 },
      ],
      hardware: [
        { itemCode: "HW-LK-350", description: "Multi-Point Lock", qtyPerUnit: 1 },
        { itemCode: "HW-HN-350", description: "Friction Stay Hinge", qtyPerUnit: 4 },
        { itemCode: "HW-HD-350", description: "Aluminum Handle", qtyPerUnit: 1 },
        { itemCode: "HW-SC-350", description: "Sash Corner Connector", qtyPerUnit: 4 },
      ],
      accessories: [
        { itemCode: "ACC-DR-350", description: "Drainage Cap", qtyPerUnit: 2 },
        { itemCode: "ACC-WB-350", description: "Weep Hole Cover", qtyPerUnit: 2 },
        { itemCode: "ACC-SC-350", description: "Sealant (Cartridge)", qtyPerUnit: 1 },
        { itemCode: "ACC-SS-350", description: "Stainless Steel Screws #8", qtyPerUnit: 20 },
      ],
      gaskets: [
        { itemCode: "GSK-350-GL", description: "Glass Glazing Gasket", perimeter: true },
        { itemCode: "GSK-350-WS", description: "Weather Strip Gasket", perimeter: true },
      ],
    };
  };

  const calculateBOM = (productId: string, w: number, h: number, qty: number, glassThick: string, glassT: string) => {
    const template = getBOMTemplate(productId);
    const widthMM = w;
    const heightMM = h;
    const perimeterMM = (widthMM + heightMM) * 2;

    // Calculate profiles with proper cutting length rules
    const profiles = template.profiles.map(profile => {
      let cuttingLength = 0;
      let qtyPerWindow = 0;
      let formula = "";

      // Head Frame and Sash Top
      if (profile.description.includes("Head Frame")) {
        cuttingLength = widthMM - 40; // W - 40
        qtyPerWindow = 1;
        formula = "W - 40";
      } 
      // Sill Frame
      else if (profile.description.includes("Sill Frame")) {
        cuttingLength = widthMM - 40; // W - 40
        qtyPerWindow = 1;
        formula = "W - 40";
      }
      // Jamb Frame
      else if (profile.description.includes("Jamb Frame")) {
        cuttingLength = heightMM - 40; // H - 40
        qtyPerWindow = 2;
        formula = "H - 40";
      }
      // Sash Top
      else if (profile.description.includes("Sash Top")) {
        cuttingLength = (widthMM - 40) / 2 - 40; // (W - 40) / 2 - 40
        qtyPerWindow = 2;
        formula = "(W - 40) / 2 - 40";
      }
      // Sash Bottom
      else if (profile.description.includes("Sash Bottom")) {
        cuttingLength = (widthMM - 40) / 2 - 40; // (W - 40) / 2 - 40
        qtyPerWindow = 2;
        formula = "(W - 40) / 2 - 40";
      }
      // Mullion
      else if (profile.description.includes("Mullion")) {
        cuttingLength = heightMM - 40; // H - 40
        qtyPerWindow = 1;
        formula = "H - 40";
      }

      return {
        ...profile,
        cuttingLength: Math.round(cuttingLength),
        quantity: qtyPerWindow,
        totalQuantity: qtyPerWindow * qty,
        totalWeight: ((cuttingLength / 1000) * profile.weightPerMeter * qtyPerWindow * qty).toFixed(2),
        formula: formula
      };
    });

    // Calculate hardware
    const hardware = template.hardware.map(hw => ({
      ...hw,
      quantity: hw.qtyPerUnit,
      totalQuantity: hw.qtyPerUnit * qty,
    }));

    // Calculate accessories
    const accessories = template.accessories.map(acc => ({
      ...acc,
      quantity: acc.qtyPerUnit,
      totalQuantity: acc.qtyPerUnit * qty,
    }));

    // Calculate gaskets
    const gaskets = template.gaskets.map(gasket => ({
      ...gasket,
      cuttingLength: gasket.perimeter ? perimeterMM : 0,
      quantity: 1,
      totalQuantity: qty,
    }));

    // Calculate glass
    const glassArea = ((widthMM * heightMM) / 1000000).toFixed(4); // Convert to m²
    const glass = {
      itemCode: `GLS-${glassThick}MM-${glassT.toUpperCase()}`,
      description: `${glassThick}mm ${glassT.charAt(0).toUpperCase() + glassT.slice(1)} Glass`,
      cuttingWidth: widthMM - 40, // Allowing 40mm for frame
      cuttingLength: heightMM - 40,
      area: glassArea,
      totalArea: (parseFloat(glassArea) * qty).toFixed(4),
      quantity: 1,
      totalQuantity: qty,
    };

    return {
      profiles,
      hardware,
      accessories,
      gaskets,
      glass: [glass],
    };
  };

  const handleAddItem = () => {
    if (!selectedProduct || !width || !height || !quantity) {
      alert("Please fill in all required fields");
      return;
    }

    const product = products.find(p => p.id === selectedProduct);
    if (!product) return;

    const newItem: QuotationItem = {
      id: `QI-${Date.now()}`,
      productId: selectedProduct,
      productName: product.name,
      productSeries: product.series,
      width: parseFloat(width),
      height: parseFloat(height),
      quantity: parseInt(quantity),
      glassThickness: glassThickness,
      glassType: glassType,
      calculatedBOM: calculateBOM(
        selectedProduct,
        parseFloat(width),
        parseFloat(height),
        parseInt(quantity),
        glassThickness,
        glassType
      ),
    };

    setQuotationItems([...quotationItems, newItem]);

    // Reset form
    setSelectedProduct("");
    setWidth("");
    setHeight("");
    setQuantity("1");
    setGlassThickness("6");
    setGlassType("float");
  };

  const handleRemoveItem = (id: string) => {
    setQuotationItems(quotationItems.filter(item => item.id !== id));
  };

  const exportQuotation = () => {
    alert("Quotation export functionality - would generate PDF/Excel");
  };

  const saveQuotation = () => {
    alert("Quotation saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-gray-900 mb-2">Window Quotation</h2>
        <p className="text-gray-500">Create custom window quotations with automatic BOM calculation</p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add Product to Quotation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">
                <Package className="h-4 w-4 inline mr-1" />
                Product
              </Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger id="product">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Width */}
            <div className="space-y-2">
              <Label htmlFor="width">
                <Ruler className="h-4 w-4 inline mr-1" />
                Width (mm)
              </Label>
              <Input
                id="width"
                type="number"
                placeholder="e.g., 1200"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>

            {/* Height */}
            <div className="space-y-2">
              <Label htmlFor="height">
                <Ruler className="h-4 w-4 inline mr-1" />
                Height (mm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="e.g., 1500"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">
                <Hash className="h-4 w-4 inline mr-1" />
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                placeholder="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            {/* Glass Thickness */}
            <div className="space-y-2">
              <Label htmlFor="glass-thickness">
                <Layers className="h-4 w-4 inline mr-1" />
                Glass Thickness (mm)
              </Label>
              <Select value={glassThickness} onValueChange={setGlassThickness}>
                <SelectTrigger id="glass-thickness">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6mm</SelectItem>
                  <SelectItem value="8">8mm</SelectItem>
                  <SelectItem value="10">10mm</SelectItem>
                  <SelectItem value="12">12mm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Glass Type */}
            <div className="space-y-2">
              <Label htmlFor="glass-type">
                <Layers className="h-4 w-4 inline mr-1" />
                Glass Type
              </Label>
              <Select value={glassType} onValueChange={setGlassType}>
                <SelectTrigger id="glass-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="tempered">Tempered</SelectItem>
                  <SelectItem value="laminated">Laminated</SelectItem>
                  <SelectItem value="double">Double Glazed</SelectItem>
                  <SelectItem value="low-e">Low-E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleAddItem} className="w-full md:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add to Quotation
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quotation Items List */}
      {quotationItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Quotation Items ({quotationItems.length})</h3>
            <div className="flex gap-2">
              <Button variant="outline" onClick={saveQuotation}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={exportQuotation}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {quotationItems.map((item, index) => (
            <Card key={item.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Item {index + 1}: {item.productName}
                      <Badge variant="secondary">{item.productSeries}</Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.width}mm (W) × {item.height}mm (H) | Qty: {item.quantity} | 
                      Glass: {item.glassThickness}mm {item.glassType}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* BOM Parameters */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">BOM Parameters</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-blue-600">Width (W)</p>
                        <p className="text-lg font-bold text-blue-900">{item.width} mm</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Height (H)</p>
                        <p className="text-lg font-bold text-blue-900">{item.height} mm</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Quantity</p>
                        <p className="text-lg font-bold text-blue-900">{item.quantity} units</p>
                      </div>
                      <div>
                        <p className="text-xs text-blue-600">Glass</p>
                        <p className="text-lg font-bold text-blue-900">{item.glassThickness}mm {item.glassType}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profiles */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Profiles</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cutting Length (mm)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty/Unit</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Weight (kg)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Formula</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {item.calculatedBOM.profiles.map((profile: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{profile.itemCode}</td>
                              <td className="px-3 py-2">{profile.description}</td>
                              <td className="px-3 py-2">{profile.cuttingLength}</td>
                              <td className="px-3 py-2">{profile.quantity}</td>
                              <td className="px-3 py-2">{profile.totalQuantity}</td>
                              <td className="px-3 py-2">{profile.totalWeight}</td>
                              <td className="px-3 py-2">{profile.formula}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Hardware */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Hardware</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty/Unit</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {item.calculatedBOM.hardware.map((hw: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{hw.itemCode}</td>
                              <td className="px-3 py-2">{hw.description}</td>
                              <td className="px-3 py-2">{hw.quantity}</td>
                              <td className="px-3 py-2">{hw.totalQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Accessories */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Accessories</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty/Unit</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {item.calculatedBOM.accessories.map((acc: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{acc.itemCode}</td>
                              <td className="px-3 py-2">{acc.description}</td>
                              <td className="px-3 py-2">{acc.quantity}</td>
                              <td className="px-3 py-2">{acc.totalQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Gaskets */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Gaskets</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cutting Length (mm)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty/Unit</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {item.calculatedBOM.gaskets.map((gasket: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{gasket.itemCode}</td>
                              <td className="px-3 py-2">{gasket.description}</td>
                              <td className="px-3 py-2">{gasket.cuttingLength}</td>
                              <td className="px-3 py-2">{gasket.quantity}</td>
                              <td className="px-3 py-2">{gasket.totalQuantity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Glass */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Glass</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Width (mm)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Length (mm)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Area (m²)</th>
                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Area (m²)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {item.calculatedBOM.glass.map((glass: any, idx: number) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="px-3 py-2 font-medium">{glass.itemCode}</td>
                              <td className="px-3 py-2">{glass.description}</td>
                              <td className="px-3 py-2">{glass.cuttingWidth}</td>
                              <td className="px-3 py-2">{glass.cuttingLength}</td>
                              <td className="px-3 py-2">{glass.area}</td>
                              <td className="px-3 py-2">{glass.totalArea}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Calculator className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-blue-600">Total Items</p>
                    <p className="text-2xl font-bold text-blue-900">{quotationItems.length}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-blue-600">Total Windows</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {quotationItems.reduce((sum, item) => sum + item.quantity, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {quotationItems.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No items added yet. Add products above to start creating your quotation.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}