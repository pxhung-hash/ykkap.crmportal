import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  X, 
  ArrowLeft, 
  Save, 
  Upload, 
  FileText, 
  Settings,
  Image as ImageIcon,
  Plus,
  Edit,
  Trash2,
  Download,
  FileSpreadsheet
} from "lucide-react";
import * as XLSX from "xlsx";

interface AddNewBOMProps {
  onClose: () => void;
  onSave: (bomData: any) => void;
}

interface BOMPart {
  id: number;
  partCode: string;
  description: string;
  qty: number;
  materialType: "Profile" | "Hardware" | "Accessories" | "Gasket" | "Glass" | "Sealant";
  cutFormula: string;
  material: string;
  note: string;
  remarks: string;
  angle: string;
  fabNo: string;
  color?: string;
}

export function AddNewBOM({ onClose, onSave }: AddNewBOMProps) {
  const [bomType, setBomType] = useState<"outer" | "inner">("outer");
  const [bomCode, setBomCode] = useState("");
  const [seriesCode, setSeriesCode] = useState("");
  const [windowSystem, setWindowSystem] = useState("");
  const [frameDepth, setFrameDepth] = useState<number>(75);
  const [glassGroove, setGlassGroove] = useState<number>(18);
  const [openDirection, setOpenDirection] = useState<"L" | "R" | "LR">("L");
  const [handleType, setHandleType] = useState("");
  const [systemDrawingNo, setSystemDrawingNo] = useState("");
  const [approvedDesign, setApprovedDesign] = useState("");
  const [outsideViewImage, setOutsideViewImage] = useState<string>("");
  const [bomParts, setBomParts] = useState<BOMPart[]>([]);
  const [editingPartId, setEditingPartId] = useState<number | null>(null);
  const [showAddPartForm, setShowAddPartForm] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Form state for adding/editing parts
  const [partForm, setPartForm] = useState<Partial<BOMPart>>({
    partCode: "",
    description: "",
    qty: 1,
    materialType: "Profile",
    cutFormula: "",
    material: "",
    note: "",
    remarks: "",
    angle: "",
    fabNo: "",
    color: ""
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setOutsideViewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws);

          const importedParts: BOMPart[] = data.map((row: any, index) => ({
            id: Date.now() + index,
            partCode: row['Part Code'] || row['partCode'] || '',
            description: row['Description'] || row['description'] || '',
            qty: Number(row['Qty'] || row['qty'] || 1),
            materialType: row['Material Type'] || row['materialType'] || 'Profile',
            cutFormula: row['Cut Formula'] || row['cutFormula'] || '',
            material: row['Material'] || row['material'] || '',
            note: row['Note'] || row['note'] || '',
            remarks: row['Remarks'] || row['remarks'] || '',
            angle: row['Angle'] || row['angle'] || '',
            fabNo: row['FAB No.'] || row['fabNo'] || '',
            color: row['Color'] || row['color'] || ''
          }));

          setBomParts(importedParts);
          alert(`Successfully imported ${importedParts.length} parts from Excel!`);
        } catch (error) {
          alert("Error reading Excel file. Please ensure it has the correct format.");
          console.error(error);
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      bomParts.map((part, index) => ({
        '#': index + 1,
        'Part Code': part.partCode,
        'Description': part.description,
        'Qty': part.qty,
        'Material Type': part.materialType,
        'Cut Formula': part.cutFormula,
        'Material': part.material,
        'Note': part.note,
        'Remarks': part.remarks,
        'Angle': part.angle,
        'FAB No.': part.fabNo,
        ...(bomType === "inner" ? { 'Color': part.color } : {})
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BOM Parts');
    XLSX.writeFile(workbook, `${bomCode || 'BOM'}_Parts_Template.xlsx`);
    setExportMenuOpen(false);
  };

  const handleAddPart = () => {
    if (!partForm.partCode || !partForm.description) {
      alert("Part Code and Description are required!");
      return;
    }

    const newPart: BOMPart = {
      id: Date.now(),
      partCode: partForm.partCode || "",
      description: partForm.description || "",
      qty: partForm.qty || 1,
      materialType: partForm.materialType || "Profile",
      cutFormula: partForm.cutFormula || "",
      material: partForm.material || "",
      note: partForm.note || "",
      remarks: partForm.remarks || "",
      angle: partForm.angle || "",
      fabNo: partForm.fabNo || "",
      color: partForm.color || ""
    };

    setBomParts([...bomParts, newPart]);
    setPartForm({
      partCode: "",
      description: "",
      qty: 1,
      materialType: "Profile",
      cutFormula: "",
      material: "",
      note: "",
      remarks: "",
      angle: "",
      fabNo: "",
      color: ""
    });
    setShowAddPartForm(false);
    alert("Part added successfully!");
  };

  const handleEditPart = (part: BOMPart) => {
    setPartForm(part);
    setEditingPartId(part.id);
    setShowAddPartForm(true);
  };

  const handleUpdatePart = () => {
    if (!partForm.partCode || !partForm.description) {
      alert("Part Code and Description are required!");
      return;
    }

    setBomParts(prev => prev.map(p => 
      p.id === editingPartId 
        ? { ...p, ...partForm } as BOMPart
        : p
    ));
    
    setPartForm({
      partCode: "",
      description: "",
      qty: 1,
      materialType: "Profile",
      cutFormula: "",
      material: "",
      note: "",
      remarks: "",
      angle: "",
      fabNo: "",
      color: ""
    });
    setEditingPartId(null);
    setShowAddPartForm(false);
    alert("Part updated successfully!");
  };

  const handleDeletePart = (partId: number) => {
    if (confirm("Are you sure you want to delete this part?")) {
      setBomParts(prev => prev.filter(p => p.id !== partId));
      alert("Part deleted successfully!");
    }
  };

  const getMaterialTypeColor = (type: string) => {
    switch (type) {
      case "Profile":
        return "bg-blue-100 text-blue-700";
      case "Hardware":
        return "bg-purple-100 text-purple-700";
      case "Accessories":
        return "bg-orange-100 text-orange-700";
      case "Gasket":
        return "bg-green-100 text-green-700";
      case "Glass":
        return "bg-cyan-100 text-cyan-700";
      case "Sealant":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSave = () => {
    const bomData = {
      id: Date.now(),
      bomCode,
      seriesCode,
      windowSystem,
      bomType,
      frameDepth,
      ...(bomType === "inner" ? { glassGroove } : { outsideViewImage }),
      openDirection,
      handleType,
      systemDrawingNo,
      approvedDesign,
      parts: bomParts
    };

    onSave(bomData);
    alert(`${bomType === "inner" ? "Inner" : "Outer"} BOM "${bomCode}" created successfully with ${bomParts.length} parts!`);
    onClose();
  };

  const isFormValid = () => {
    return (
      bomCode.trim() !== "" &&
      seriesCode.trim() !== "" &&
      windowSystem.trim() !== "" &&
      handleType.trim() !== "" &&
      systemDrawingNo.trim() !== "" &&
      approvedDesign.trim() !== ""
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto py-8">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] mx-4 mb-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h2 className="text-gray-900 mb-1">Add New BOM</h2>
              <p className="text-sm text-gray-500">Configure a new BOM entry</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* BOM Type Selection */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                BOM Type
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <button
                  onClick={() => setBomType("outer")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    bomType === "outer"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ImageIcon className={`h-8 w-8 mx-auto mb-2 ${
                    bomType === "outer" ? "text-blue-600" : "text-gray-400"
                  }`} />
                  <p className={`font-medium ${
                    bomType === "outer" ? "text-blue-900" : "text-gray-600"
                  }`}>
                    Outer BOM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">With outside view image</p>
                </button>
                <button
                  onClick={() => setBomType("inner")}
                  className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                    bomType === "inner"
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <FileText className={`h-8 w-8 mx-auto mb-2 ${
                    bomType === "inner" ? "text-green-600" : "text-gray-400"
                  }`} />
                  <p className={`font-medium ${
                    bomType === "inner" ? "text-green-900" : "text-gray-600"
                  }`}>
                    Inner BOM
                  </p>
                  <p className="text-xs text-gray-500 mt-1">With glass groove specs</p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    BOM Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., U4E-41001"
                    value={bomCode}
                    onChange={(e) => setBomCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Series Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., U4ES"
                    value={seriesCode}
                    onChange={(e) => setSeriesCode(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Window System <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Outswing Casement"
                    value={windowSystem}
                    onChange={(e) => setWindowSystem(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Specifications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frame Depth (mm) <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={frameDepth}
                    onChange={(e) => setFrameDepth(Number(e.target.value))}
                  />
                </div>
                {bomType === "inner" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Glass Groove (mm) <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      value={glassGroove}
                      onChange={(e) => setGlassGroove(Number(e.target.value))}
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Open Direction <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={openDirection}
                    onChange={(e) => setOpenDirection(e.target.value as "L" | "R" | "LR")}
                  >
                    <option value="L">Left (L)</option>
                    <option value="R">Right (R)</option>
                    <option value="LR">Left & Right (LR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Handle Type <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Single Lock"
                    value={handleType}
                    onChange={(e) => setHandleType(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Details */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Drawing No. <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., DWG-U4E-001"
                    value={systemDrawingNo}
                    onChange={(e) => setSystemDrawingNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Approved Design <span className="text-red-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Ishihara"
                    value={approvedDesign}
                    onChange={(e) => setApprovedDesign(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Image Upload for Outer BOM */}
          {bomType === "outer" && (
            <Card>
              <CardHeader className="bg-gray-50">
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5 text-blue-600" />
                  Outside View Image
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    {outsideViewImage ? (
                      <div>
                        <img
                          src={outsideViewImage}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded"
                        />
                        <p className="text-sm text-gray-600 mt-2">Click to change image</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-600 mb-1">Click to upload image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* BOM Parts Detail Section */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  BOM Parts Detail ({bomParts.length} items)
                </CardTitle>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="hidden"
                    id="excel-import"
                  />
                  <label htmlFor="excel-import" className="cursor-pointer">
                    <Button size="sm" variant="outline" type="button">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Excel
                    </Button>
                  </label>
                  <div className="relative">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setExportMenuOpen(!exportMenuOpen)}
                      disabled={bomParts.length === 0}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    {exportMenuOpen && bomParts.length > 0 && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                        <button
                          onClick={exportToExcel}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                        >
                          <FileSpreadsheet className="h-4 w-4 text-green-600" />
                          Export to Excel
                        </button>
                      </div>
                    )}
                  </div>
                  <Button size="sm" onClick={() => setShowAddPartForm(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Part
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Add/Edit Part Form */}
              {showAddPartForm && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    {editingPartId ? "Edit Part" : "Add New Part"}
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Part Code <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="sm"
                        placeholder="e.g., P-FRM-001"
                        value={partForm.partCode}
                        onChange={(e) => setPartForm({...partForm, partCode: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Input
                        size="sm"
                        placeholder="e.g., Frame Top Profile"
                        value={partForm.description}
                        onChange={(e) => setPartForm({...partForm, description: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                      <Input
                        type="number"
                        size="sm"
                        value={partForm.qty}
                        onChange={(e) => setPartForm({...partForm, qty: Number(e.target.value)})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Material Type</label>
                      <select
                        className="w-full h-8 px-2 rounded-md border border-gray-300 bg-white text-xs"
                        value={partForm.materialType}
                        onChange={(e) => setPartForm({...partForm, materialType: e.target.value as any})}
                      >
                        <option value="Profile">Profile</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Accessories">Accessories</option>
                        <option value="Gasket">Gasket</option>
                        <option value="Glass">Glass</option>
                        <option value="Sealant">Sealant</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Cut Formula</label>
                      <Input
                        size="sm"
                        placeholder="e.g., W - 40"
                        value={partForm.cutFormula}
                        onChange={(e) => setPartForm({...partForm, cutFormula: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Material</label>
                      <Input
                        size="sm"
                        placeholder="e.g., A6063S-T5"
                        value={partForm.material}
                        onChange={(e) => setPartForm({...partForm, material: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Note</label>
                      <Input
                        size="sm"
                        placeholder="e.g., Main frame top"
                        value={partForm.note}
                        onChange={(e) => setPartForm({...partForm, note: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Remarks</label>
                      <Input
                        size="sm"
                        placeholder="e.g., Standard finish"
                        value={partForm.remarks}
                        onChange={(e) => setPartForm({...partForm, remarks: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Angle</label>
                      <Input
                        size="sm"
                        placeholder="e.g., 90°"
                        value={partForm.angle}
                        onChange={(e) => setPartForm({...partForm, angle: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">FAB No.</label>
                      <Input
                        size="sm"
                        placeholder="e.g., FAB-001"
                        value={partForm.fabNo}
                        onChange={(e) => setPartForm({...partForm, fabNo: e.target.value})}
                        className="h-8 text-xs"
                      />
                    </div>
                    {bomType === "inner" && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Color</label>
                        <Input
                          size="sm"
                          placeholder="e.g., Silver"
                          value={partForm.color}
                          onChange={(e) => setPartForm({...partForm, color: e.target.value})}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button 
                      size="sm" 
                      onClick={editingPartId ? handleUpdatePart : handleAddPart}
                    >
                      <Save className="h-3 w-3 mr-2" />
                      {editingPartId ? "Update Part" : "Add Part"}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setShowAddPartForm(false);
                        setEditingPartId(null);
                        setPartForm({
                          partCode: "",
                          description: "",
                          qty: 1,
                          materialType: "Profile",
                          cutFormula: "",
                          material: "",
                          note: "",
                          remarks: "",
                          angle: "",
                          fabNo: "",
                          color: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Parts Table */}
              {bomParts.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr className="border-b">
                          <th className="text-left p-3 font-medium text-gray-700">#</th>
                          <th className="text-left p-3 font-medium text-gray-700">Part Code</th>
                          <th className="text-left p-3 font-medium text-gray-700">Description</th>
                          <th className="text-left p-3 font-medium text-gray-700">Qty</th>
                          <th className="text-left p-3 font-medium text-gray-700">Material Type</th>
                          <th className="text-left p-3 font-medium text-gray-700">Cut Formula</th>
                          <th className="text-left p-3 font-medium text-gray-700">Material</th>
                          <th className="text-left p-3 font-medium text-gray-700">Note</th>
                          <th className="text-left p-3 font-medium text-gray-700">Remarks</th>
                          <th className="text-left p-3 font-medium text-gray-700">Angle</th>
                          <th className="text-left p-3 font-medium text-gray-700">FAB No.</th>
                          {bomType === "inner" && (
                            <th className="text-left p-3 font-medium text-gray-700">Color</th>
                          )}
                          <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {bomParts.map((part, index) => (
                          <tr key={part.id} className="hover:bg-gray-50">
                            <td className="p-3 text-gray-500">{index + 1}</td>
                            <td className="p-3">
                              <span className="font-mono text-xs text-gray-900">{part.partCode}</span>
                            </td>
                            <td className="p-3 text-gray-900">{part.description}</td>
                            <td className="p-3 text-center">
                              <Badge variant="secondary" className="bg-gray-100">
                                {part.qty}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary" className={getMaterialTypeColor(part.materialType)}>
                                {part.materialType}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700 font-mono">
                                {part.cutFormula || "N/A"}
                              </code>
                            </td>
                            <td className="p-3 text-xs text-gray-700">{part.material}</td>
                            <td className="p-3 text-xs text-gray-600 max-w-[150px] truncate" title={part.note}>
                              {part.note}
                            </td>
                            <td className="p-3 text-xs text-gray-600 max-w-[150px] truncate" title={part.remarks}>
                              {part.remarks}
                            </td>
                            <td className="p-3 text-center text-xs text-gray-700">{part.angle}</td>
                            <td className="p-3">
                              <span className="text-xs font-mono text-gray-600">{part.fabNo}</span>
                            </td>
                            {bomType === "inner" && (
                              <td className="p-3 text-xs text-gray-700">{part.color}</td>
                            )}
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditPart(part)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700"
                                  onClick={() => handleDeletePart(part.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600 mb-2">No parts added yet</p>
                  <p className="text-sm text-gray-500">Click "Add Part" or "Import Excel" to add BOM parts</p>
                </div>
              )}

              {/* Summary Statistics */}
              {bomParts.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Total Parts</p>
                    <p className="text-xl font-bold text-gray-900">{bomParts.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Profiles</p>
                    <p className="text-xl font-bold text-blue-600">
                      {bomParts.filter(p => p.materialType === "Profile").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Hardware</p>
                    <p className="text-xl font-bold text-purple-600">
                      {bomParts.filter(p => p.materialType === "Hardware").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Accessories</p>
                    <p className="text-xl font-bold text-orange-600">
                      {bomParts.filter(p => p.materialType === "Accessories").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Gaskets</p>
                    <p className="text-xl font-bold text-green-600">
                      {bomParts.filter(p => p.materialType === "Gasket").length}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-1">Glass</p>
                    <p className="text-xl font-bold text-cyan-600">
                      {bomParts.filter(p => p.materialType === "Glass").length}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid()}>
            <Save className="h-4 w-4 mr-2" />
            Create BOM
          </Button>
        </div>
      </div>
    </div>
  );
}