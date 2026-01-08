import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  ArrowLeft, 
  BookmarkPlus, 
  Download, 
  Star,
  Thermometer,
  Shield,
  Droplet,
  Wrench,
  Check,
  FileText,
  Calculator
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [selectedVariation, setSelectedVariation] = useState("2-track-2-leaves");
  const [isQuotationDialogOpen, setIsQuotationDialogOpen] = useState(false);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [glassThickness, setGlassThickness] = useState("6");
  const [glassType, setGlassType] = useState("clear");

  // BOM Calculation Template
  const getBOMTemplate = () => {
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

  const calculateBOM = (w: number, h: number, qty: number, glassThick: string, glassT: string) => {
    const template = getBOMTemplate();
    const widthMM = w;
    const heightMM = h;
    const perimeterMM = (widthMM + heightMM) * 2;

    // Calculate profiles
    const profiles = template.profiles.map(profile => {
      let cuttingLength = 0;
      let qtyPerWindow = 0;
      let formula = "";

      if (profile.description.includes("Head Frame")) {
        cuttingLength = widthMM - 40;
        qtyPerWindow = 1;
        formula = "W - 40";
      } else if (profile.description.includes("Sill Frame")) {
        cuttingLength = widthMM - 40;
        qtyPerWindow = 1;
        formula = "W - 40";
      } else if (profile.description.includes("Jamb Frame")) {
        cuttingLength = heightMM - 40;
        qtyPerWindow = 2;
        formula = "H - 40";
      } else if (profile.description.includes("Sash Top")) {
        cuttingLength = (widthMM / 2) - 50;
        qtyPerWindow = 2;
        formula = "(W/2) - 50";
      } else if (profile.description.includes("Sash Bottom")) {
        cuttingLength = (widthMM / 2) - 50;
        qtyPerWindow = 2;
        formula = "(W/2) - 50";
      }

      const totalQuantity = qtyPerWindow * qty;
      const totalWeight = (cuttingLength / 1000) * profile.weightPerMeter * totalQuantity;

      return {
        itemCode: profile.itemCode,
        description: profile.description,
        cuttingLength: `${cuttingLength.toFixed(0)}mm`,
        formula,
        qtyPerWindow,
        totalQuantity,
        weightPerMeter: profile.weightPerMeter,
        totalWeight: totalWeight.toFixed(2)
      };
    });

    // Calculate hardware
    const hardware = template.hardware.map(hw => {
      const totalQuantity = hw.qtyPerUnit * qty;
      return {
        itemCode: hw.itemCode,
        description: hw.description,
        qtyPerWindow: hw.qtyPerUnit,
        totalQuantity
      };
    });

    // Calculate accessories
    const accessories = template.accessories.map(acc => {
      const totalQuantity = acc.qtyPerUnit * qty;
      return {
        itemCode: acc.itemCode,
        description: acc.description,
        qtyPerWindow: acc.qtyPerUnit,
        totalQuantity
      };
    });

    // Calculate gaskets
    const gaskets = template.gaskets.map(gasket => {
      const lengthPerWindow = perimeterMM;
      const totalLength = lengthPerWindow * qty;
      return {
        itemCode: gasket.itemCode,
        description: gasket.description,
        lengthPerWindow: `${lengthPerWindow.toFixed(0)}mm`,
        totalLength: `${totalLength.toFixed(0)}mm`,
        qtyPerWindow: 1,
        totalQuantity: qty
      };
    });

    // Calculate glass
    const glassWidth = (widthMM / 2) - 60;
    const glassHeight = heightMM - 60;
    const glassArea = (glassWidth * glassHeight) / 1000000; // Convert to m²
    const glass = [{
      itemCode: `GLS-350-${glassThick}`,
      description: `Insulated Glass Unit ${glassThick}mm - ${glassT}`,
      width: `${glassWidth.toFixed(0)}mm`,
      height: `${glassHeight.toFixed(0)}mm`,
      areaPerPane: glassArea.toFixed(4),
      qtyPerWindow: 2,
      totalQuantity: 2 * qty,
      totalArea: (glassArea * 2 * qty).toFixed(4)
    }];

    return { profiles, hardware, accessories, gaskets, glass };
  };

  const generatePDF = () => {
    if (!width || !height || !quantity) {
      alert("Please fill in all required fields");
      return;
    }

    const w = parseFloat(width);
    const h = parseFloat(height);
    const qty = parseInt(quantity);

    const bom = calculateBOM(w, h, qty, glassThickness, glassType);
    const variation = product.variations.find(v => v.id === selectedVariation);

    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("WINDOW QUOTATION", 105, 15, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("YKK AP - Architectural Products", 105, 22, { align: "center" });
    
    // Project Information
    doc.setFontSize(12);
    doc.text("Project Information", 14, 35);
    doc.setFontSize(10);
    
    const today = new Date().toLocaleDateString();
    doc.text(`Date: ${today}`, 14, 42);
    doc.text(`Product: ${product.name}`, 14, 48);
    doc.text(`Variation: ${variation?.label}`, 14, 54);
    doc.text(`Dimensions: ${width}mm (W) x ${height}mm (H)`, 14, 60);
    doc.text(`Quantity: ${quantity} units`, 14, 66);
    doc.text(`Glass: ${glassThickness}mm ${glassType}`, 14, 72);

    let yPos = 85;

    // Profiles Table
    doc.setFontSize(12);
    doc.text("1. PROFILES", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Item Code', 'Description', 'Length', 'Formula', 'Qty/Window', 'Total Qty', 'Weight/m', 'Total Wt (kg)']],
      body: bom.profiles.map(p => [
        p.itemCode,
        p.description,
        p.cuttingLength,
        p.formula,
        p.qtyPerWindow.toString(),
        p.totalQuantity.toString(),
        p.weightPerMeter.toString(),
        p.totalWeight
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Hardware Table
    doc.setFontSize(12);
    doc.text("2. HARDWARE", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Item Code', 'Description', 'Qty/Window', 'Total Qty']],
      body: bom.hardware.map(h => [
        h.itemCode,
        h.description,
        h.qtyPerWindow.toString(),
        h.totalQuantity.toString()
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Accessories Table
    doc.setFontSize(12);
    doc.text("3. ACCESSORIES", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Item Code', 'Description', 'Qty/Window', 'Total Qty']],
      body: bom.accessories.map(a => [
        a.itemCode,
        a.description,
        a.qtyPerWindow.toString(),
        a.totalQuantity.toString()
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    // Add new page for gaskets and glass
    doc.addPage();
    yPos = 20;

    // Gaskets Table
    doc.setFontSize(12);
    doc.text("4. GASKETS", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Item Code', 'Description', 'Length/Window', 'Total Length', 'Qty/Window', 'Total Qty']],
      body: bom.gaskets.map(g => [
        g.itemCode,
        g.description,
        g.lengthPerWindow,
        g.totalLength,
        g.qtyPerWindow.toString(),
        g.totalQuantity.toString()
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    yPos = (doc as any).lastAutoTable.finalY + 10;

    // Glass Table
    doc.setFontSize(12);
    doc.text("5. GLASS", 14, yPos);
    yPos += 5;

    autoTable(doc, {
      startY: yPos,
      head: [['Item Code', 'Description', 'Width', 'Height', 'Area/Pane', 'Qty/Window', 'Total Qty', 'Total Area (m²)']],
      body: bom.glass.map(g => [
        g.itemCode,
        g.description,
        g.width,
        g.height,
        g.areaPerPane,
        g.qtyPerWindow.toString(),
        g.totalQuantity.toString(),
        g.totalArea
      ]),
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] }
    });

    // Footer
    yPos = (doc as any).lastAutoTable.finalY + 20;
    doc.setFontSize(10);
    doc.text("Notes:", 14, yPos);
    doc.setFontSize(8);
    doc.text("- All dimensions are in millimeters unless specified", 14, yPos + 5);
    doc.text("- Glass dimensions include 5mm clearance on all sides", 14, yPos + 10);
    doc.text("- Profile lengths include standard cutting allowances", 14, yPos + 15);
    
    // Save PDF
    doc.save(`Window-Quotation-${today.replace(/\//g, '-')}.pdf`);
    setIsQuotationDialogOpen(false);
  };

  // Mock product data
  const product = {
    id: productId,
    name: "YKK AP 350 Series Window",
    category: "Windows",
    subcategory: "Sliding",
    type: "Window",
    rating: 4.8,
    reviewCount: 67,
    description: "High-performance aluminum window system designed for commercial and residential applications. Features advanced thermal break technology for superior energy efficiency.",
    image: "https://images.unsplash.com/photo-1740784448783-2d1e22e3cb73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwd2luZG93cyUyMGJ1aWxkaW5nfGVufDF8fHx8MTc2Njk4MTE5Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    specifications: {
      "U-Factor": "0.30",
      "Material": "Aluminum",
      "Water Resistance": "15 psf",
      "Frame Depth": "2.5\"",
      "Glass Thickness": "1 inch insulated",
      "Air Infiltration": "0.06 cfm/sq ft",
      "Wind Pressure": "60 psf",
      "Sound Insulation": "STC 35",
      "Finish Options": "Bronze, Black, White, Custom",
      "Installation Type": "New Construction & Retrofit"
    },
    variations: [
      { id: "2-track-2-leaves", label: "2 Tracks - 2 Leaves", tracks: 2, leaves: 2 },
      { id: "2-track-4-leaves", label: "2 Tracks - 4 Leaves", tracks: 2, leaves: 4 },
      { id: "3-track-3-leaves", label: "3 Tracks - 3 Leaves", tracks: 3, leaves: 3 },
      { id: "3-track-6-leaves", label: "3 Tracks - 6 Leaves", tracks: 3, leaves: 6 },
      { id: "corner-sliding", label: "Corner Sliding", tracks: 2, leaves: 2 },
      { id: "single-sliding", label: "Single Sliding (1 Fixed + 1 Move)", tracks: 1, leaves: 2 },
    ],
    features: [
      {
        title: "Advanced Thermal Break",
        description: "Superior insulation technology reduces heat transfer and improves energy efficiency",
        icon: "thermal",
        image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGVybWFsJTIwaW5zdWxhdGlvbiUyMHdpbmRvd3xlbnwxfHx8fDE3NjcwMDQ5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        title: "Energy Star Certified",
        description: "Meets stringent energy performance standards for maximum efficiency and savings",
        icon: "star",
        image: "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmVyZ3klMjBlZmZpY2llbnQlMjBidWlsZGluZ3xlbnwxfHx8fDE3NjcwMDQ5MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        title: "Weather-Tight Construction",
        description: "Multi-layer weatherstripping provides excellent protection against wind and water",
        icon: "weather",
        image: "https://images.unsplash.com/photo-1534088568595-a066f410bcda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwc2VhbGluZ3xlbnwxfHx8fDE3NjcwMDQ5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080"
      },
      {
        title: "Easy Installation System",
        description: "Pre-engineered components and detailed instructions make installation quick and efficient",
        icon: "install",
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBpbnN0YWxsYXRpb258ZW58MXx8fHwxNzY3MDA0OTA3fDA&ixlib=rb-4.1.0&q=80&w=1080"
      }
    ],
    documents: [
      { name: "Technical Specifications", type: "PDF", size: "2.4 MB" },
      { name: "Installation Guide", type: "PDF", size: "5.1 MB" },
      { name: "CAD Drawings", type: "DWG", size: "1.8 MB" },
    ],
    bom: {
      profiles: [
        { itemCode: "PRF-350-HF", description: "350 Series Head Frame", cuttingLength: "1200mm", quantity: 1, totalQuantity: 4, weightPerMeter: "1.85" },
        { itemCode: "PRF-350-SF", description: "350 Series Sill Frame", cuttingLength: "1200mm", quantity: 1, totalQuantity: 4, weightPerMeter: "2.15" },
        { itemCode: "PRF-350-JB", description: "350 Series Jamb Frame", cuttingLength: "1500mm", quantity: 2, totalQuantity: 8, weightPerMeter: "1.95" },
      ],
      hardware: [
        { itemCode: "HW-LK-350", description: "350 Series Multi-Point Lock", quantity: 2, totalQuantity: 8 },
        { itemCode: "HW-HN-350", description: "Friction Stay Hinge", quantity: 4, totalQuantity: 16 },
      ],
      accessories: [
        { itemCode: "ACC-DR-350", description: "Drainage Cap", quantity: 4, totalQuantity: 16 },
        { itemCode: "ACC-WB-350", description: "Weep Hole Cover", quantity: 4, totalQuantity: 16 },
      ],
      gaskets: [
        { itemCode: "GSK-350-GL", description: "Glass Glazing Gasket", cuttingLength: "4800mm", quantity: 4, totalQuantity: 16 },
        { itemCode: "GSK-350-WS", description: "Weather Strip Gasket", cuttingLength: "3200mm", quantity: 4, totalQuantity: 16 },
      ],
      glass: [
        { itemCode: "GLS-350-IG", description: "Insulated Glass Unit 6mm+12A+6mm", cuttingWidth: "550mm", cuttingLength: "1450mm", area: "0.7975 m²" },
      ],
    }
  };

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Catalog
      </Button>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left - Single Image */}
        <div className="space-y-4">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right - Product Info */}
        <div className="space-y-6">
          {/* Category and Subcategory */}
          <div className="flex items-center gap-2">
            <Badge className="bg-black text-white">{product.category}</Badge>
            <span className="text-gray-400">/</span>
            <Badge variant="secondary">{product.subcategory}</Badge>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'fill-gray-200 text-gray-200'
                  }`}
                />
              ))}
            </div>
            <span className="font-medium">{product.rating}</span>
            <span className="text-gray-500">({product.reviewCount} reviews)</span>
          </div>

          {/* Variations */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Variations</h3>
            <div className="grid grid-cols-2 gap-3">
              {product.variations.map((variation) => (
                <button
                  key={variation.id}
                  onClick={() => setSelectedVariation(variation.id)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    selectedVariation === variation.id
                      ? 'border-black bg-gray-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {variation.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Dialog open={isQuotationDialogOpen} onOpenChange={setIsQuotationDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex-1 bg-black text-white hover:bg-gray-800" size="lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Make Quotation
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Window Quotation</DialogTitle>
                  <DialogDescription>
                    Enter window dimensions and specifications to generate a quotation with BOM
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Product Info */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-black text-white">{product.category}</Badge>
                      <Badge variant="secondary">{product.subcategory}</Badge>
                    </div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Variation: {product.variations.find(v => v.id === selectedVariation)?.label}
                    </p>
                  </div>

                  {/* Dimensions Input */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (mm)</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="e.g. 1200"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (mm)</Label>
                      <Input
                        id="height"
                        type="number"
                        placeholder="e.g. 1500"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>

                  {/* Glass Specifications */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="glassThickness">Glass Thickness (mm)</Label>
                      <Select value={glassThickness} onValueChange={setGlassThickness}>
                        <SelectTrigger id="glassThickness">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5mm</SelectItem>
                          <SelectItem value="6">6mm</SelectItem>
                          <SelectItem value="8">8mm</SelectItem>
                          <SelectItem value="10">10mm</SelectItem>
                          <SelectItem value="12">12mm</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="glassType">Glass Type</Label>
                      <Select value={glassType} onValueChange={setGlassType}>
                        <SelectTrigger id="glassType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="clear">Clear Float</SelectItem>
                          <SelectItem value="tinted">Tinted</SelectItem>
                          <SelectItem value="reflective">Reflective</SelectItem>
                          <SelectItem value="low-e">Low-E</SelectItem>
                          <SelectItem value="tempered">Tempered</SelectItem>
                          <SelectItem value="laminated">Laminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      className="flex-1"
                      variant="outline"
                      onClick={() => setIsQuotationDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1 bg-black text-white hover:bg-gray-800"
                      onClick={generatePDF}
                    >
                      <Calculator className="h-4 w-4 mr-2" />
                      Generate Quotation
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="lg">
              <Download className="h-5 w-5 mr-2" />
              Download All
            </Button>
          </div>
        </div>
      </div>

      {/* Specifications Section - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Thermometer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">U-Factor</p>
                <p className="font-medium text-lg">{product.specifications["U-Factor"]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Material</p>
                <p className="font-medium text-lg">{product.specifications.Material}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Droplet className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Water Resistance</p>
                <p className="font-medium text-lg">{product.specifications["Water Resistance"]}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Frame Depth</p>
                <p className="font-medium text-lg">{product.specifications["Frame Depth"]}</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Glass Thickness</span>
                <span className="font-medium">{product.specifications["Glass Thickness"]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Air Infiltration</span>
                <span className="font-medium">{product.specifications["Air Infiltration"]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Wind Pressure</span>
                <span className="font-medium">{product.specifications["Wind Pressure"]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Sound Insulation</span>
                <span className="font-medium">{product.specifications["Sound Insulation"]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Finish Options</span>
                <span className="font-medium">{product.specifications["Finish Options"]}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Installation Type</span>
                <span className="font-medium">{product.specifications["Installation Type"]}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Features Section - Full Width with Images */}
      <div className="space-y-6">
        <div>
          <h2 className="text-gray-900 mb-2">Key Features</h2>
          <p className="text-gray-500">Advanced technologies and engineering excellence</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-32 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <ImageWithFallback
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="h-4 w-4 text-blue-600" />
                      </div>
                      <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="specifications" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="bom">Bill of Materials</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Technical Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bom" className="space-y-4">
          {/* Profiles */}
          <Card>
            <CardHeader>
              <CardTitle>Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cutting Length</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Weight/m</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.bom.profiles.map((profile, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{profile.itemCode}</td>
                        <td className="px-3 py-2">{profile.description}</td>
                        <td className="px-3 py-2">{profile.cuttingLength}</td>
                        <td className="px-3 py-2">{profile.quantity}</td>
                        <td className="px-3 py-2">{profile.totalQuantity}</td>
                        <td className="px-3 py-2">{profile.weightPerMeter} kg</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Hardware */}
          <Card>
            <CardHeader>
              <CardTitle>Hardware</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.bom.hardware.map((hw, idx) => (
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
            </CardContent>
          </Card>

          {/* Accessories */}
          <Card>
            <CardHeader>
              <CardTitle>Accessories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.bom.accessories.map((acc, idx) => (
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
            </CardContent>
          </Card>

          {/* Gaskets */}
          <Card>
            <CardHeader>
              <CardTitle>Gaskets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Cutting Length</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Qty</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Total Qty</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.bom.gaskets.map((gasket, idx) => (
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
            </CardContent>
          </Card>

          {/* Glass */}
          <Card>
            <CardHeader>
              <CardTitle>Glass</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Item Code</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Description</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Width</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Length</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Area</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {product.bom.glass.map((glass, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-3 py-2 font-medium">{glass.itemCode}</td>
                        <td className="px-3 py-2">{glass.description}</td>
                        <td className="px-3 py-2">{glass.cuttingWidth}</td>
                        <td className="px-3 py-2">{glass.cuttingLength}</td>
                        <td className="px-3 py-2">{glass.area}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {product.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Download className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}