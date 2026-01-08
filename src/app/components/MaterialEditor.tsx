import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft, 
  Save, 
  X,
  Package,
  DollarSign,
  Warehouse,
  Truck,
  FileText,
  Upload
} from "lucide-react";

interface Material {
  id?: string;
  itemCode: string;
  description: string;
  sectionImage?: string;
  series: string;
  length?: string;
  category: "profiles" | "hardware" | "accessories";
  subcategory: string;
  typeOfWindow: string;
  packingQuantity: number;
  minPurchaseQuantity: number;
  unitPrice?: number;
  retailPrice: number;
  packingPrice: number;
  stock: number;
  supplier: string;
  leadTime: string;
  material?: string;
  finish?: string;
  weight?: string;
  color: string;
  surfaceCertification?: string;
  status: "available" | "low_stock" | "out_of_stock" | "discontinued";
}

interface MaterialEditorProps {
  material?: Material | null;
  onSave: (material: Material) => void;
  onCancel: () => void;
  mode: "add" | "edit";
}

export function MaterialEditor({ material, onSave, onCancel, mode }: MaterialEditorProps) {
  const [formData, setFormData] = useState<Material>({
    itemCode: "",
    description: "",
    series: "",
    length: "",
    category: "profiles",
    subcategory: "",
    typeOfWindow: "",
    packingQuantity: 0,
    minPurchaseQuantity: 0,
    unitPrice: 0,
    retailPrice: 0,
    packingPrice: 0,
    stock: 0,
    supplier: "",
    leadTime: "",
    material: "",
    finish: "",
    weight: "",
    color: "",
    surfaceCertification: "",
    status: "available"
  });

  const [imagePreview, setImagePreview] = useState<string>("");

  useEffect(() => {
    if (material) {
      setFormData(material);
      if (material.sectionImage) {
        setImagePreview(material.sectionImage);
      }
    }
  }, [material]);

  const handleSave = () => {
    // Validation
    if (!formData.itemCode || !formData.description || !formData.series) {
      alert("Please fill in all required fields (Item Code, Description, Series)");
      return;
    }

    onSave(formData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, sectionImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const isProfileCategory = formData.category === "profiles";

  // Subcategory options based on category
  const getSubcategoryOptions = () => {
    switch (formData.category) {
      case "profiles":
        return [
          "Frame Profiles",
          "Leave Profiles",
          "Connection Profiles",
          "Structural Profiles"
        ];
      case "hardware":
        return [
          "Handle",
          "Hinge",
          "Lock",
          "Cap"
        ];
      case "accessories":
        return [
          "Airtight",
          "Gasket",
          "Waterproof",
          "Wind Stopper",
          "Safety Stopper"
        ];
      default:
        return [];
    }
  };

  // Description options based on category
  const getDescriptionOptions = () => {
    if (formData.category === "profiles") {
      return [
        "Head",
        "Sill",
        "Jamb",
        "Top Rail",
        "Bottom Rail",
        "Stile",
        "Interlocking Stile",
        "Meeting Stile",
        "Glass Bead",
        "Attachment",
        "Muntin",
        "Transom",
        "Mullion"
      ];
    }
    // For hardware and accessories, allow free text
    return [];
  };

  const descriptionOptions = getDescriptionOptions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Catalog
          </Button>
          <div>
            <h1 className="text-gray-900">
              {mode === "add" ? "Add New Material" : "Edit Material"}
            </h1>
            <p className="text-gray-500">
              {mode === "add" 
                ? "Enter material details to add to catalog" 
                : `Editing: ${material?.itemCode || ""}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Material
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="itemCode">
                    Item Code <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="itemCode"
                    placeholder="e.g., 3K-97434"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">
                    Category <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ 
                      ...formData, 
                      category: value as any,
                      subcategory: "", // Reset subcategory when category changes
                      description: "" // Reset description when category changes
                    })}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profiles">Profiles</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  {descriptionOptions.length > 0 ? (
                    <Select
                      value={formData.description}
                      onValueChange={(value) => setFormData({ ...formData, description: value })}
                    >
                      <SelectTrigger id="description">
                        <SelectValue placeholder="Select description" />
                      </SelectTrigger>
                      <SelectContent>
                        {descriptionOptions.map(opt => (
                          <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="description"
                      placeholder="e.g., Aluminum Handle, EPDM Gasket"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">
                    Subcategory <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                  >
                    <SelectTrigger id="subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {getSubcategoryOptions().map(opt => (
                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="series">
                    Series <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.series}
                    onValueChange={(value) => setFormData({ ...formData, series: value })}
                  >
                    <SelectTrigger id="series">
                      <SelectValue placeholder="Select series" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IWIN S">IWIN S</SelectItem>
                      <SelectItem value="IWIN E">IWIN E</SelectItem>
                      <SelectItem value="Shopfront">Shopfront</SelectItem>
                      <SelectItem value="Stick CW">Stick CW</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isProfileCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="length">
                      Length <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.length || ""}
                      onValueChange={(value) => setFormData({ ...formData, length: value })}
                    >
                      <SelectTrigger id="length">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5.8m">5.8m</SelectItem>
                        <SelectItem value="5.2m">5.2m</SelectItem>
                        <SelectItem value="4.5m">4.5m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="typeOfWindow">
                    Type of Window <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.typeOfWindow}
                    onValueChange={(value) => setFormData({ ...formData, typeOfWindow: value })}
                  >
                    <SelectTrigger id="typeOfWindow">
                      <SelectValue placeholder="Select window type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sliding">Sliding</SelectItem>
                      <SelectItem value="door">Door</SelectItem>
                      <SelectItem value="top hung">Top Hung</SelectItem>
                      <SelectItem value="casement">Casement</SelectItem>
                      <SelectItem value="fix">Fix</SelectItem>
                      <SelectItem value="louver">Louver</SelectItem>
                      <SelectItem value="curtain wall">Curtain Wall</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="color">
                  Color <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="color"
                  placeholder="e.g., Silver, Bronze, Black"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                {isProfileCategory && (
                  <div className="space-y-2">
                    <Label htmlFor="unitPrice">
                      Unit Price (₫/m) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="unitPrice"
                      type="number"
                      placeholder="0"
                      value={formData.unitPrice || ""}
                      onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="retailPrice">
                    Retail Price (₫) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="retailPrice"
                    type="number"
                    placeholder="0"
                    value={formData.retailPrice || ""}
                    onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packingPrice">
                    Packing Price (₫) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="packingPrice"
                    type="number"
                    placeholder="0"
                    value={formData.packingPrice || ""}
                    onChange={(e) => setFormData({ ...formData, packingPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Inventory Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Warehouse className="h-5 w-5 text-purple-600" />
                Inventory Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">
                    Current Stock <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="packingQuantity">
                    Packing Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="packingQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.packingQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, packingQuantity: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minPurchaseQuantity">
                    Min Purchasing Qty <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="minPurchaseQuantity"
                    type="number"
                    placeholder="0"
                    value={formData.minPurchaseQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, minPurchaseQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    <SelectItem value="discontinued">Discontinued</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-orange-600" />
                Supplier Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">
                    Supplier <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger id="supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YKK AP Manufacturing">YKK AP Manufacturing</SelectItem>
                      <SelectItem value="YKK AP Suzhou">YKK AP Suzhou</SelectItem>
                      <SelectItem value="YKK AP Japan">YKK AP Japan</SelectItem>
                      <SelectItem value="BHO">BHO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leadTime">
                    Lead Time <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="leadTime"
                    placeholder="7-10 days if has stock, 45-60 days if has no stock"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications - Only for Profiles */}
          {isProfileCategory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Technical Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Select
                      value={formData.material || ""}
                      onValueChange={(value) => setFormData({ ...formData, material: value })}
                    >
                      <SelectTrigger id="material">
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aluminum Alloy 6063-T5">6063-T5</SelectItem>
                        <SelectItem value="Aluminum Alloy 6063-T6">6063-T6</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="finish">Finish</Label>
                    <Select
                      value={formData.finish || ""}
                      onValueChange={(value) => setFormData({ ...formData, finish: value })}
                    >
                      <SelectTrigger id="finish">
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mill Finish">Mill Finish</SelectItem>
                        <SelectItem value="Powder Coated">Powder Coated</SelectItem>
                        <SelectItem value="Anodized">Anodized</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <Input
                      id="weight"
                      placeholder="e.g., 1.2 kg/m"
                      value={formData.weight || ""}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="surfaceCertification">Surface Certification</Label>
                    <Input
                      id="surfaceCertification"
                      placeholder="e.g., ISO 9001, ASTM B221"
                      value={formData.surfaceCertification || ""}
                      onChange={(e) => setFormData({ ...formData, surfaceCertification: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Image Upload & Summary */}
        <div className="space-y-6">
          {/* Section Image Upload */}
          {isProfileCategory && (
            <Card>
              <CardHeader>
                <CardTitle>Section Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img 
                        src={imagePreview} 
                        alt="Section preview" 
                        className="w-full h-48 object-contain rounded"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setImagePreview("");
                          setFormData({ ...formData, sectionImage: undefined });
                        }}
                      >
                        Remove Image
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm text-gray-600">Upload section image</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                      </div>
                      <label htmlFor="imageUpload">
                        <Button variant="outline" size="sm" asChild>
                          <span>Choose File</span>
                        </Button>
                        <input
                          id="imageUpload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Material Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Material Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Item Code</Label>
                  <p className="font-medium">{formData.itemCode || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Description</Label>
                  <p className="font-medium">{formData.description || "-"}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Category</Label>
                  <Badge variant="secondary" className="capitalize">
                    {formData.category}
                  </Badge>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Series</Label>
                  <p className="font-medium">{formData.series || "-"}</p>
                </div>
                {isProfileCategory && (
                  <div>
                    <Label className="text-xs text-gray-500">Length</Label>
                    <p className="font-medium">{formData.length || "-"}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-gray-500">Stock Level</Label>
                  <p className={`font-medium ${formData.stock <= formData.minPurchaseQuantity ? 'text-red-600' : 'text-green-600'}`}>
                    {formData.stock || 0} {isProfileCategory ? "m" : "pcs"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Status</Label>
                  <Badge 
                    variant="secondary"
                    className={
                      formData.status === "available" ? "bg-green-100 text-green-700" :
                      formData.status === "low_stock" ? "bg-yellow-100 text-yellow-700" :
                      formData.status === "out_of_stock" ? "bg-red-100 text-red-700" :
                      "bg-gray-100 text-gray-700"
                    }
                  >
                    {formData.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Material
              </Button>
              <Button variant="outline" className="w-full" onClick={onCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
