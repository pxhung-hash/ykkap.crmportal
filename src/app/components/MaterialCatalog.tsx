import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Filter,
  Package,
  Wrench,
  Shapes,
  Grid,
  List,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Loader2
} from "lucide-react";
import exampleImage from 'figma:asset/44d6ebe405016870990a0bcfc5317095372e8c7d.png';
import { MaterialEditor } from "./MaterialEditor";
import * as materialApi from "../utils/materialApi";
import type { Material } from "../utils/materialApi";

type MaterialCategory = "all" | "profiles" | "hardware" | "accessories";
type ViewMode = "grid" | "list";

interface MaterialCatalogProps {
  isAdmin?: boolean;
}

export function MaterialCatalog({ isAdmin = false }: MaterialCatalogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<MaterialCategory>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showEditorPage, setShowEditorPage] = useState(false);
  const [editorMode, setEditorMode] = useState<"add" | "edit">("add");
  const [isLoading, setIsLoading] = useState(false);
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const fetchMaterials = async () => {
      setIsLoading(true);
      try {
        const fetchedMaterials = await materialApi.getAllMaterials();
        setMaterials(fetchedMaterials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const [formData, setFormData] = useState<Partial<Material>>({
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

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = 
      material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryStats = () => {
    return {
      all: materials.length,
      profiles: materials.filter(m => m.category === "profiles").length,
      hardware: materials.filter(m => m.category === "hardware").length,
      accessories: materials.filter(m => m.category === "accessories").length,
      lowStock: materials.filter(m => m.stock <= m.minPurchaseQuantity).length,
      totalValue: materials.reduce((sum, m) => sum + (m.unitPrice * m.stock), 0)
    };
  };

  const stats = getCategoryStats();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "low_stock":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "out_of_stock":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "discontinued":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "profiles":
        return <Shapes className="h-4 w-4" />;
      case "hardware":
        return <Wrench className="h-4 w-4" />;
      case "accessories":
        return <Package className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const handleAddMaterial = () => {
    const newMaterial: Material = {
      id: `M${(materials.length + 1).toString().padStart(3, '0')}`,
      itemCode: formData.itemCode || "",
      description: formData.description || "",
      series: formData.series || "",
      length: formData.length || "",
      category: formData.category as "profiles" | "hardware" | "accessories",
      subcategory: formData.subcategory || "",
      typeOfWindow: formData.typeOfWindow || "",
      packingQuantity: formData.packingQuantity || 0,
      minPurchaseQuantity: formData.minPurchaseQuantity || 0,
      unitPrice: formData.unitPrice || 0,
      retailPrice: formData.retailPrice || 0,
      packingPrice: formData.packingPrice || 0,
      stock: formData.stock || 0,
      supplier: formData.supplier || "",
      leadTime: formData.leadTime || "",
      material: formData.material || "",
      finish: formData.finish || "",
      weight: formData.weight || "",
      color: formData.color || "",
      surfaceCertification: formData.surfaceCertification || "",
      status: formData.status as any || "available",
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };

    setMaterials([...materials, newMaterial]);
    setShowAddDialog(false);
    resetForm();
    alert("Material added successfully!");
  };

  const handleUpdateMaterial = () => {
    if (selectedMaterial) {
      const updatedMaterials = materials.map(m =>
        m.id === selectedMaterial.id
          ? { ...m, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : m
      );
      setMaterials(updatedMaterials);
      setShowEditDialog(false);
      setSelectedMaterial(null);
      resetForm();
      alert("Material updated successfully!");
    }
  };

  const handleDeleteMaterial = async () => {
    if (selectedMaterial) {
      setIsLoading(true);
      try {
        const result = await materialApi.deleteMaterial(selectedMaterial.id);
        if (result.success) {
          // Refresh materials list
          const fetchedMaterials = await materialApi.getAllMaterials();
          setMaterials(fetchedMaterials);
          alert("Material deleted successfully!");
        } else {
          alert(`Error: ${result.error || "Failed to delete material"}`);
        }
      } catch (error) {
        console.error("Error deleting material:", error);
        alert("An error occurred while deleting the material.");
      } finally {
        setIsLoading(false);
        setShowDeleteDialog(false);
        setSelectedMaterial(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
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
  };

  const openEditDialog = (material: Material) => {
    setSelectedMaterial(material);
    setFormData(material);
    setShowEditDialog(true);
  };

  const openDetailDialog = (material: Material) => {
    setSelectedMaterial(material);
    setShowDetailDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Handler for saving material from editor page
  const handleSaveFromEditor = async (material: Material) => {
    setIsLoading(true);
    try {
      if (editorMode === "add") {
        // Create new material via API
        const result = await materialApi.createMaterial(material);
        if (result.success) {
          // Refresh materials list
          const fetchedMaterials = await materialApi.getAllMaterials();
          setMaterials(fetchedMaterials);
          alert("Material added successfully!");
        } else {
          alert(`Error: ${result.error || "Failed to create material"}`);
        }
      } else {
        // Update existing material via API
        if (selectedMaterial) {
          const result = await materialApi.updateMaterial(selectedMaterial.id, material);
          if (result.success) {
            // Refresh materials list
            const fetchedMaterials = await materialApi.getAllMaterials();
            setMaterials(fetchedMaterials);
            alert("Material updated successfully!");
          } else {
            alert(`Error: ${result.error || "Failed to update material"}`);
          }
        }
      }
    } catch (error) {
      console.error("Error saving material:", error);
      alert("An error occurred while saving the material.");
    } finally {
      setIsLoading(false);
      setShowEditorPage(false);
      setSelectedMaterial(null);
    }
  };

  const handleCancelEditor = () => {
    setShowEditorPage(false);
    setSelectedMaterial(null);
  };

  // If editor page is shown, render only the editor
  if (showEditorPage) {
    return (
      <MaterialEditor
        material={selectedMaterial}
        onSave={handleSaveFromEditor}
        onCancel={handleCancelEditor}
        mode={editorMode}
      />
    );
  }

  const renderMaterialCard = (material: Material) => (
    <Card key={material.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                {getCategoryIcon(material.category)}
              </div>
              <div>
                <p className="font-medium text-gray-900">{material.description}</p>
                <p className="text-sm text-gray-500">{material.itemCode}</p>
              </div>
            </div>
            <Badge variant="secondary" className={getStatusColor(material.status)}>
              {material.status.replace('_', ' ')}
            </Badge>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Series</p>
              <p className="font-medium">{material.series}</p>
            </div>
            <div>
              <p className="text-gray-500">Length</p>
              <p className="font-medium">{material.length}</p>
            </div>
            <div>
              <p className="text-gray-500">Unit Price</p>
              <p className="font-medium text-blue-600">{formatCurrency(material.unitPrice)}/m</p>
            </div>
            <div>
              <p className="text-gray-500">Stock</p>
              <p className={`font-medium ${material.stock <= material.minPurchaseQuantity ? 'text-red-600' : 'text-green-600'}`}>
                {material.stock} m
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => openDetailDialog(material)}
            >
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1"
              onClick={() => openEditDialog(material)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                setSelectedMaterial(material);
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderMaterialList = (material: Material) => (
    <tr key={material.id} className="border-b hover:bg-gray-50">
      <td className="py-4 px-4 font-medium">{material.itemCode}</td>
      <td className="py-4 px-4">{material.description}</td>
      <td className="py-4 px-4">{material.series}</td>
      <td className="py-4 px-4 text-gray-600">{material.subcategory}</td>
      <td className="py-4 px-4 font-medium text-blue-600">
        {formatCurrency(material.unitPrice)}/m
      </td>
      <td className="py-4 px-4">
        <span className={material.stock <= material.minPurchaseQuantity ? 'text-red-600 font-medium' : ''}>
          {material.stock} m
        </span>
      </td>
      <td className="py-4 px-4">{material.supplier}</td>
      <td className="py-4 px-4">
        <Badge variant="secondary" className={getStatusColor(material.status)}>
          {material.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => openDetailDialog(material)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => openEditDialog(material)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => {
              setSelectedMaterial(material);
              setShowDeleteDialog(true);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Material Catalog</h1>
          <p className="text-gray-500">Manage profiles, hardware, and accessories for window and door manufacturing</p>
        </div>
        {isAdmin && (
          <Button 
            onClick={() => {
              setEditorMode("add");
              setSelectedMaterial(null);
              setShowEditorPage(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Materials</p>
                <p className="text-2xl font-bold text-gray-900">{stats.all}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Profiles</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profiles}</p>
              </div>
              <Shapes className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Hardware</p>
                <p className="text-2xl font-bold text-gray-900">{stats.hardware}</p>
              </div>
              <Wrench className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Accessories</p>
                <p className="text-2xl font-bold text-gray-900">{stats.accessories}</p>
              </div>
              <Package className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div>
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search materials by name, code..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as MaterialCategory)}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="profiles">Profiles</SelectItem>
                <SelectItem value="hardware">Hardware</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Materials Display */}
      {isLoading ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Loader2 className="h-12 w-12 text-blue-600 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading materials...</p>
          </CardContent>
        </Card>
      ) : filteredMaterials.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {materials.length === 0 
                ? "No materials in catalog yet. Add materials to get started." 
                : "No materials found matching your criteria"}
            </p>
            {isAdmin && materials.length === 0 && (
              <Button 
                className="mt-4"
                onClick={() => {
                  setEditorMode("add");
                  setShowEditorPage(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Material
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(renderMaterialCard)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Item Code</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Series</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Subcategory</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Unit Price</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Supplier</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMaterials.map(renderMaterialList)}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Material Dialog - COMPREHENSIVE WITH ALL 20 FIELDS */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Material</DialogTitle>
            <DialogDescription>Update material details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Basic Information */}
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-code">Item Code *</Label>
                  <Input
                    id="edit-code"
                    placeholder="e.g., 3K-97434"
                    value={formData.itemCode}
                    onChange={(e) => setFormData({ ...formData, itemCode: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-description">Description *</Label>
                  <Select
                    value={formData.description}
                    onValueChange={(value) => setFormData({ ...formData, description: value })}
                  >
                    <SelectTrigger id="edit-description">
                      <SelectValue placeholder="Select description" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Head">Head</SelectItem>
                      <SelectItem value="Sill">Sill</SelectItem>
                      <SelectItem value="Jamb">Jamb</SelectItem>
                      <SelectItem value="Top Rail">Top Rail</SelectItem>
                      <SelectItem value="Bottom Rail">Bottom Rail</SelectItem>
                      <SelectItem value="Stile">Stile</SelectItem>
                      <SelectItem value="Interlocking Stile">Interlocking Stile</SelectItem>
                      <SelectItem value="Meeting Stile">Meeting Stile</SelectItem>
                      <SelectItem value="Glass Bead">Glass Bead</SelectItem>
                      <SelectItem value="Attachment">Attachment</SelectItem>
                      <SelectItem value="Muntin">Muntin</SelectItem>
                      <SelectItem value="Transom">Transom</SelectItem>
                      <SelectItem value="Mullion">Mullion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-series">Series *</Label>
                  <Select
                    value={formData.series}
                    onValueChange={(value) => setFormData({ ...formData, series: value })}
                  >
                    <SelectTrigger id="edit-series">
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
                <div className="space-y-2">
                  <Label htmlFor="edit-length">Length *</Label>
                  <Select
                    value={formData.length}
                    onValueChange={(value) => setFormData({ ...formData, length: value })}
                  >
                    <SelectTrigger id="edit-length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5.8m">5.8m</SelectItem>
                      <SelectItem value="5.2m">5.2m</SelectItem>
                      <SelectItem value="4.5m">4.5m</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value as any })}
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="profiles">Profiles</SelectItem>
                      <SelectItem value="hardware">Hardware</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-subcategory">Subcategory *</Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                  >
                    <SelectTrigger id="edit-subcategory">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Frame Profiles">Frame Profiles</SelectItem>
                      <SelectItem value="Leave Profiles">Leave Profiles</SelectItem>
                      <SelectItem value="Connection Profiles">Connection Profiles</SelectItem>
                      <SelectItem value="Structural Profiles">Structural Profiles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="edit-typeOfWindow">Type of Window *</Label>
                <Select
                  value={formData.typeOfWindow}
                  onValueChange={(value) => setFormData({ ...formData, typeOfWindow: value })}
                >
                  <SelectTrigger id="edit-typeOfWindow">
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

            {/* Pricing Information */}
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Pricing Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-unitPrice">Unit Price (₫) *</Label>
                  <Input
                    id="edit-unitPrice"
                    type="number"
                    value={formData.unitPrice}
                    onChange={(e) => setFormData({ ...formData, unitPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-retailPrice">Retail Price (₫) *</Label>
                  <Input
                    id="edit-retailPrice"
                    type="number"
                    value={formData.retailPrice}
                    onChange={(e) => setFormData({ ...formData, retailPrice: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-packingPrice">Packing Price (₫) *</Label>
                  <Input
                    id="edit-packingPrice"
                    type="number"
                    value={formData.packingPrice}
                    onChange={(e) => setFormData({ ...formData, packingPrice: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Inventory Information */}
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Inventory Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Current Stock *</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-packingQuantity">Packing Quantity *</Label>
                  <Input
                    id="edit-packingQuantity"
                    type="number"
                    value={formData.packingQuantity}
                    onChange={(e) => setFormData({ ...formData, packingQuantity: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-minPurchaseQty">Min Purchasing Qty *</Label>
                  <Input
                    id="edit-minPurchaseQty"
                    type="number"
                    value={formData.minPurchaseQuantity}
                    onChange={(e) => setFormData({ ...formData, minPurchaseQuantity: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as any })}
                >
                  <SelectTrigger id="edit-status">
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
            </div>

            {/* Supplier Information */}
            <div className="border-b pb-4">
              <h3 className="font-medium text-gray-900 mb-3">Supplier Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-supplier">Supplier *</Label>
                  <Select
                    value={formData.supplier}
                    onValueChange={(value) => setFormData({ ...formData, supplier: value })}
                  >
                    <SelectTrigger id="edit-supplier">
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="YKK AP Manufacturing">YKK AP Manufacturing</SelectItem>
                      <SelectItem value="BHO">BHO</SelectItem>
                      <SelectItem value="YKK AP Suzhou">YKK AP Suzhou</SelectItem>
                      <SelectItem value="YKK AP Japan">YKK AP Japan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-leadTime">Lead Time *</Label>
                  <Input
                    id="edit-leadTime"
                    placeholder="7-10 days if has stock, 45-60 days if has no stock"
                    value={formData.leadTime}
                    onChange={(e) => setFormData({ ...formData, leadTime: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Technical Specifications */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-material">Material *</Label>
                  <Select
                    value={formData.material}
                    onValueChange={(value) => setFormData({ ...formData, material: value })}
                  >
                    <SelectTrigger id="edit-material">
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aluminum Alloy 6063-T5">6063-T5</SelectItem>
                      <SelectItem value="Aluminum Alloy 6063-T6">6063-T6</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-finish">Finish *</Label>
                  <Select
                    value={formData.finish}
                    onValueChange={(value) => setFormData({ ...formData, finish: value })}
                  >
                    <SelectTrigger id="edit-finish">
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

              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-weight">Weight *</Label>
                  <Input
                    id="edit-weight"
                    placeholder="e.g., 1.2 kg/m"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-color">Color *</Label>
                  <Input
                    id="edit-color"
                    placeholder="e.g., Silver, Bronze, Black"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="edit-certification">Surface Certification *</Label>
                <Input
                  id="edit-certification"
                  placeholder="e.g., ISO 9001, ASTM B221"
                  value={formData.surfaceCertification}
                  onChange={(e) => setFormData({ ...formData, surfaceCertification: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setSelectedMaterial(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMaterial}>Update Material</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Material Details</DialogTitle>
          </DialogHeader>
          {selectedMaterial && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMaterial.description}</h3>
                  <p className="text-gray-500">{selectedMaterial.itemCode}</p>
                </div>
                <Badge variant="secondary" className={getStatusColor(selectedMaterial.status)}>
                  {selectedMaterial.status.replace('_', ' ')}
                </Badge>
              </div>

              {/* Section Image */}
              {selectedMaterial.sectionImage && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <Label className="mb-2 block">Section Image</Label>
                  <div className="flex justify-center">
                    <img 
                      src={selectedMaterial.sectionImage} 
                      alt={selectedMaterial.description}
                      className="max-h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <Label className="mb-3 block text-base">Basic Information</Label>
                <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Item Code</p>
                    <p className="font-medium">{selectedMaterial.itemCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="font-medium">{selectedMaterial.description}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Series</p>
                    <p className="font-medium">{selectedMaterial.series}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Length</p>
                    <p className="font-medium">{selectedMaterial.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Subcategory</p>
                    <p className="font-medium">{selectedMaterial.subcategory}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type of Window</p>
                    <p className="font-medium capitalize">{selectedMaterial.typeOfWindow}</p>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div>
                <Label className="mb-3 block text-base">Pricing Information</Label>
                <div className="grid grid-cols-3 gap-4 bg-blue-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Unit Price</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(selectedMaterial.unitPrice)}/meter
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Retail Price</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(selectedMaterial.retailPrice)}/meter
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Packing Price</p>
                    <p className="font-bold text-blue-600 text-lg">
                      {formatCurrency(selectedMaterial.packingPrice)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Inventory Information */}
              <div>
                <Label className="mb-3 block text-base">Inventory Information</Label>
                <div className="grid grid-cols-3 gap-4 bg-green-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Current Stock</p>
                    <p className={`font-bold text-lg ${selectedMaterial.stock <= selectedMaterial.minPurchaseQuantity ? 'text-red-600' : 'text-green-600'}`}>
                      {selectedMaterial.stock} meters
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Packing Quantity</p>
                    <p className="font-medium">{selectedMaterial.packingQuantity} pieces/pack</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Minimum Purchasing Quantity</p>
                    <p className="font-medium">{selectedMaterial.minPurchaseQuantity} meters</p>
                  </div>
                </div>
              </div>

              {/* Supplier Information */}
              <div>
                <Label className="mb-3 block text-base">Supplier Information</Label>
                <div className="grid grid-cols-2 gap-4 bg-purple-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Supplier</p>
                    <p className="font-medium">{selectedMaterial.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lead Time</p>
                    <p className="font-medium">{selectedMaterial.leadTime}</p>
                  </div>
                </div>
              </div>

              {/* Technical Specifications */}
              <div>
                <Label className="mb-3 block text-base">Technical Specifications</Label>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Material</p>
                    <p className="font-medium">{selectedMaterial.material}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Finish</p>
                    <p className="font-medium capitalize">{selectedMaterial.finish}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Weight</p>
                    <p className="font-medium">{selectedMaterial.weight}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Color</p>
                    <p className="font-medium">{selectedMaterial.color}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Surface Certification</p>
                    <p className="font-medium">{selectedMaterial.surfaceCertification}</p>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4 text-sm border-t pt-4">
                <div>
                  <Label>Created Date</Label>
                  <p className="text-gray-600 mt-1">{selectedMaterial.createdAt}</p>
                </div>
                <div>
                  <Label>Last Updated</Label>
                  <p className="text-gray-600 mt-1">{selectedMaterial.updatedAt}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDetailDialog(false);
              setSelectedMaterial(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedMaterial?.description}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false);
              setSelectedMaterial(null);
            }}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteMaterial}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}