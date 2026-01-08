import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  X,
  Edit,
  Download,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  Ruler,
  Settings,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface InnerBOM {
  id: number;
  bomCode: string;
  seriesCode: string;
  windowSystem: string;
  bomType: "inner";
  frameDepth: number;
  glassGroove: number;
  openDirection: "L" | "R" | "LR";
  handleType: string;
  systemDrawingNo: string;
  approvedDesign: string;
}

interface InnerBOMPart {
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
  color: string;
}

interface ChangeRecord {
  partCode: string;
  field: string;
  oldValue: string;
  newValue: string;
}

interface InnerBOMDetailProps {
  bom: InnerBOM;
  onClose: () => void;
}

export function InnerBOMDetail({ bom, onClose }: InnerBOMDetailProps) {
  const [widthParam, setWidthParam] = useState<number>(1200);
  const [heightParam, setHeightParam] = useState<number>(1500);
  const [isEditingParams, setIsEditingParams] = useState(false);
  const [isRevising, setIsRevising] = useState(false);
  const [showChangesPreview, setShowChangesPreview] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  // Sample Inner BOM parts data
  const [bomParts, setBomParts] = useState<InnerBOMPart[]>([
    {
      id: 1,
      partCode: "I-FRM-001",
      description: "Inner Frame Top Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "W - 35",
      material: "A6063S-T5",
      note: "Inner frame top",
      remarks: "Anodized finish",
      angle: "90°",
      fabNo: "FAB-I01",
      color: "Silver"
    },
    {
      id: 2,
      partCode: "I-FRM-002",
      description: "Inner Frame Bottom Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "W - 35",
      material: "A6063S-T5",
      note: "Inner frame bottom",
      remarks: "Anodized finish",
      angle: "90°",
      fabNo: "FAB-I01",
      color: "Silver"
    },
    {
      id: 3,
      partCode: "I-FRM-003",
      description: "Inner Frame Left Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "H - 70",
      material: "A6063S-T5",
      note: "Inner frame left",
      remarks: "Anodized finish",
      angle: "90°",
      fabNo: "FAB-I02",
      color: "Silver"
    },
    {
      id: 4,
      partCode: "I-FRM-004",
      description: "Inner Frame Right Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "H - 70",
      material: "A6063S-T5",
      note: "Inner frame right",
      remarks: "Anodized finish",
      angle: "90°",
      fabNo: "FAB-I02",
      color: "Silver"
    },
    {
      id: 5,
      partCode: "I-SSH-001",
      description: "Inner Sash Top Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "W - 110",
      material: "A6063S-T5",
      note: "Inner opening sash top",
      remarks: "Powder coating",
      angle: "45°",
      fabNo: "FAB-I03",
      color: "White"
    },
    {
      id: 6,
      partCode: "I-SSH-002",
      description: "Inner Sash Bottom Profile",
      qty: 1,
      materialType: "Profile",
      cutFormula: "W - 110",
      material: "A6063S-T5",
      note: "Inner opening sash bottom",
      remarks: "Powder coating",
      angle: "45°",
      fabNo: "FAB-I03",
      color: "White"
    },
    {
      id: 7,
      partCode: "H-HNG-I01",
      description: "Inner Casement Hinge",
      qty: 3,
      materialType: "Hardware",
      cutFormula: "N/A",
      material: "SUS304",
      note: "Top, middle, bottom",
      remarks: "Load capacity: 70kg",
      angle: "N/A",
      fabNo: "FAB-HI01",
      color: "Silver"
    },
    {
      id: 8,
      partCode: "H-LCK-I01",
      description: "Inner Lock Handle",
      qty: 1,
      materialType: "Hardware",
      cutFormula: "N/A",
      material: "SUS403J3",
      note: "Main lock mechanism",
      remarks: "Silver finish",
      angle: "N/A",
      fabNo: "FAB-HI02",
      color: "Silver"
    },
  ]);

  const [originalBomParts, setOriginalBomParts] = useState<InnerBOMPart[]>([]);
  const [editedBomParts, setEditedBomParts] = useState<InnerBOMPart[]>([]);
  const [changes, setChanges] = useState<ChangeRecord[]>([]);

  const calculateCutLength = (formula: string): string => {
    if (formula === "N/A") return "N/A";
    
    try {
      let calculation = formula
        .replace(/W/g, widthParam.toString())
        .replace(/H/g, heightParam.toString())
        .replace(/x/g, "×");
      
      return calculation;
    } catch {
      return formula;
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

  const getDirectionBadgeColor = (direction: string) => {
    switch (direction) {
      case "L":
        return "bg-blue-100 text-blue-700";
      case "R":
        return "bg-green-100 text-green-700";
      case "LR":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStartRevise = () => {
    setOriginalBomParts(JSON.parse(JSON.stringify(bomParts)));
    setEditedBomParts(JSON.parse(JSON.stringify(bomParts)));
    setIsRevising(true);
  };

  const handleCellEdit = (partId: number, field: keyof InnerBOMPart, value: any) => {
    setEditedBomParts(prev => 
      prev.map(part => 
        part.id === partId ? { ...part, [field]: value } : part
      )
    );
  };

  const handleSaveRevisions = () => {
    // Calculate changes
    const changesList: ChangeRecord[] = [];
    editedBomParts.forEach((editedPart, index) => {
      const originalPart = originalBomParts[index];
      if (originalPart) {
        Object.keys(editedPart).forEach(key => {
          const field = key as keyof InnerBOMPart;
          if (field !== 'id' && editedPart[field] !== originalPart[field]) {
            changesList.push({
              partCode: editedPart.partCode,
              field: field,
              oldValue: String(originalPart[field]),
              newValue: String(editedPart[field])
            });
          }
        });
      }
    });

    if (changesList.length === 0) {
      alert("No changes detected");
      setIsRevising(false);
      return;
    }

    setChanges(changesList);
    setShowChangesPreview(true);
  };

  const handleConfirmChanges = () => {
    setBomParts(editedBomParts);
    setShowChangesPreview(false);
    setIsRevising(false);
    alert(`${changes.length} changes saved successfully!`);
  };

  const handleCancelRevisions = () => {
    setEditedBomParts([]);
    setOriginalBomParts([]);
    setIsRevising(false);
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
        'Cut Length': calculateCutLength(part.cutFormula),
        'Material': part.material,
        'Note': part.note,
        'Remarks': part.remarks,
        'Angle': part.angle,
        'FAB No.': part.fabNo,
        'Color': part.color
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BOM Parts');
    XLSX.writeFile(workbook, `${bom.bomCode}_Inner_BOM.xlsx`);
    setExportMenuOpen(false);
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    
    // Add title
    doc.setFontSize(16);
    doc.text(`Inner BOM Detail - ${bom.bomCode}`, 14, 15);
    
    // Add BOM info
    doc.setFontSize(10);
    doc.text(`Series: ${bom.seriesCode} | Window System: ${bom.windowSystem}`, 14, 22);
    doc.text(`Frame Depth: ${bom.frameDepth}mm | Glass Groove: ${bom.glassGroove}mm | Open Direction: ${bom.openDirection}`, 14, 27);

    // Add table
    autoTable(doc, {
      startY: 32,
      head: [['#', 'Part Code', 'Description', 'Qty', 'Type', 'Cut Formula', 'Cut Length', 'Material', 'Angle', 'FAB No.', 'Color']],
      body: bomParts.map((part, index) => [
        index + 1,
        part.partCode,
        part.description,
        part.qty,
        part.materialType,
        part.cutFormula,
        calculateCutLength(part.cutFormula),
        part.material,
        part.angle,
        part.fabNo,
        part.color
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    doc.save(`${bom.bomCode}_Inner_BOM.pdf`);
    setExportMenuOpen(false);
  };

  const currentParts = isRevising ? editedBomParts : bomParts;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-auto py-8">
      {/* Changes Preview Modal */}
      {showChangesPreview && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70]">
          <Card className="w-full max-w-3xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
            <CardHeader className="bg-green-50 border-b">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Review Changes Before Saving
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 overflow-y-auto flex-1">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  You are about to save <strong>{changes.length} change(s)</strong>. Please review carefully.
                </p>
              </div>

              <div className="space-y-3">
                {changes.map((change, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-white">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 mb-1">
                          {change.partCode}
                        </Badge>
                        <p className="text-sm font-medium text-gray-700">Field: {change.field}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Old Value</p>
                        <div className="bg-red-50 border border-red-200 rounded p-2">
                          <p className="text-sm text-red-700 line-through">{change.oldValue}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">New Value</p>
                        <div className="bg-green-50 border border-green-200 rounded p-2">
                          <p className="text-sm text-green-700 font-medium">{change.newValue}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="flex items-center justify-between gap-3 p-6 border-t bg-gray-50">
              <Button variant="outline" onClick={() => setShowChangesPreview(false)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Edit
              </Button>
              <Button onClick={handleConfirmChanges} className="bg-green-600 hover:bg-green-700">
                <Save className="h-4 w-4 mr-2" />
                Confirm & Save
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-xl w-full max-w-[95vw] mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-green-50">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to List
            </Button>
            <div>
              <h2 className="text-gray-900 mb-1">Inner BOM Detail</h2>
              <p className="text-sm text-gray-500">Complete BOM specification and parts list</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Information Section */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">BOM Code</p>
                  <p className="font-medium text-gray-900">{bom.bomCode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Series Code</p>
                  <Badge className="bg-green-100 text-green-700">{bom.seriesCode}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Window System</p>
                  <p className="font-medium text-gray-900">{bom.windowSystem}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Type of BOM</p>
                  <Badge className="bg-purple-100 text-purple-700 capitalize">{bom.bomType}</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Frame Depth</p>
                  <p className="font-medium text-gray-900">{bom.frameDepth}mm</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Glass Groove</p>
                  <Badge className="bg-orange-100 text-orange-700">{bom.glassGroove}mm</Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Open Direction</p>
                  <Badge className={getDirectionBadgeColor(bom.openDirection)}>
                    {bom.openDirection}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Handle Type</p>
                  <p className="font-medium text-gray-900">{bom.handleType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">System Drawing No.</p>
                  <p className="text-sm font-mono text-gray-700">{bom.systemDrawingNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Approved Design</p>
                  <Badge variant="outline">{bom.approvedDesign}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parameters Section */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-green-600" />
                  BOM Parameters
                </CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditingParams(!isEditingParams)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {isEditingParams ? "Lock" : "Edit"} Parameters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Width (W) - mm
                  </label>
                  <Input
                    type="number"
                    value={widthParam}
                    onChange={(e) => setWidthParam(Number(e.target.value))}
                    disabled={!isEditingParams}
                    className="text-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (H) - mm
                  </label>
                  <Input
                    type="number"
                    value={heightParam}
                    onChange={(e) => setHeightParam(Number(e.target.value))}
                    disabled={!isEditingParams}
                    className="text-lg font-mono"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                These parameters are used in cut formulas to calculate actual cutting lengths for profiles.
              </p>
            </CardContent>
          </Card>

          {/* BOM Parts Detail Section */}
          <Card>
            <CardHeader className="bg-gray-50">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  BOM Parts Detail ({currentParts.length} items)
                </CardTitle>
                <div className="flex gap-2">
                  {!isRevising ? (
                    <>
                      <div className="relative">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setExportMenuOpen(!exportMenuOpen)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                        {exportMenuOpen && (
                          <div className="absolute right-0 top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                            <button
                              onClick={exportToExcel}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm"
                            >
                              <FileSpreadsheet className="h-4 w-4 text-green-600" />
                              Export to Excel
                            </button>
                            <button
                              onClick={exportToPDF}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-sm border-t"
                            >
                              <FileText className="h-4 w-4 text-red-600" />
                              Export to PDF
                            </button>
                          </div>
                        )}
                      </div>
                      <Button size="sm" onClick={handleStartRevise}>
                        <Edit className="h-4 w-4 mr-2" />
                        Revise
                      </Button>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Part
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={handleCancelRevisions}>
                        Cancel
                      </Button>
                      <Button size="sm" onClick={handleSaveRevisions}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Revisions
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {isRevising && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-green-800">
                    <Edit className="h-4 w-4 inline mr-2" />
                    Revise Mode: Click on any cell to edit. Changes will be tracked and shown before saving.
                  </p>
                </div>
              )}
              
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">#</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Part Code</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Description</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Qty</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Material Type</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Cut Formula</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Cut Length</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Material</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Note</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Remarks</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Angle</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">FAB No.</th>
                        <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Color</th>
                        {!isRevising && <th className="text-left p-3 font-medium text-gray-700 whitespace-nowrap">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {currentParts.map((part, index) => (
                        <tr key={part.id} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{index + 1}</td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.partCode}
                                onChange={(e) => handleCellEdit(part.id, 'partCode', e.target.value)}
                                className="h-8 text-xs font-mono"
                              />
                            ) : (
                              <span className="font-mono text-xs text-gray-900">{part.partCode}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.description}
                                onChange={(e) => handleCellEdit(part.id, 'description', e.target.value)}
                                className="h-8 text-xs"
                              />
                            ) : (
                              <span className="text-gray-900">{part.description}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                type="number"
                                value={part.qty}
                                onChange={(e) => handleCellEdit(part.id, 'qty', Number(e.target.value))}
                                className="h-8 text-xs w-20"
                              />
                            ) : (
                              <Badge variant="secondary" className="bg-gray-100">
                                {part.qty}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <select
                                value={part.materialType}
                                onChange={(e) => handleCellEdit(part.id, 'materialType', e.target.value)}
                                className="h-8 text-xs px-2 rounded border border-gray-300"
                              >
                                <option value="Profile">Profile</option>
                                <option value="Hardware">Hardware</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Gasket">Gasket</option>
                                <option value="Glass">Glass</option>
                                <option value="Sealant">Sealant</option>
                              </select>
                            ) : (
                              <Badge variant="secondary" className={getMaterialTypeColor(part.materialType)}>
                                {part.materialType}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.cutFormula}
                                onChange={(e) => handleCellEdit(part.id, 'cutFormula', e.target.value)}
                                className="h-8 text-xs font-mono"
                              />
                            ) : (
                              <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700 font-mono">
                                {part.cutFormula}
                              </code>
                            )}
                          </td>
                          <td className="p-3">
                            <span className="text-xs font-mono text-gray-700">
                              {calculateCutLength(part.cutFormula)}
                            </span>
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.material}
                                onChange={(e) => handleCellEdit(part.id, 'material', e.target.value)}
                                className="h-8 text-xs"
                              />
                            ) : (
                              <span className="text-xs text-gray-700">{part.material}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.note}
                                onChange={(e) => handleCellEdit(part.id, 'note', e.target.value)}
                                className="h-8 text-xs"
                              />
                            ) : (
                              <span className="text-xs text-gray-600 max-w-[150px] truncate block" title={part.note}>
                                {part.note}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.remarks}
                                onChange={(e) => handleCellEdit(part.id, 'remarks', e.target.value)}
                                className="h-8 text-xs"
                              />
                            ) : (
                              <span className="text-xs text-gray-600 max-w-[150px] truncate block" title={part.remarks}>
                                {part.remarks}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.angle}
                                onChange={(e) => handleCellEdit(part.id, 'angle', e.target.value)}
                                className="h-8 text-xs w-20"
                              />
                            ) : (
                              <span className="text-center text-xs text-gray-700">{part.angle}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.fabNo}
                                onChange={(e) => handleCellEdit(part.id, 'fabNo', e.target.value)}
                                className="h-8 text-xs font-mono"
                              />
                            ) : (
                              <span className="text-xs font-mono text-gray-600">{part.fabNo}</span>
                            )}
                          </td>
                          <td className="p-3">
                            {isRevising ? (
                              <Input
                                value={part.color}
                                onChange={(e) => handleCellEdit(part.id, 'color', e.target.value)}
                                className="h-8 text-xs"
                              />
                            ) : (
                              <span className="text-xs text-gray-700">{part.color}</span>
                            )}
                          </td>
                          {!isRevising && (
                            <td className="p-3">
                              <div className="flex gap-1">
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mt-6 pt-6 border-t">
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Total Parts</p>
                  <p className="text-xl font-bold text-gray-900">{currentParts.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Profiles</p>
                  <p className="text-xl font-bold text-blue-600">
                    {currentParts.filter(p => p.materialType === "Profile").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Hardware</p>
                  <p className="text-xl font-bold text-purple-600">
                    {currentParts.filter(p => p.materialType === "Hardware").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Accessories</p>
                  <p className="text-xl font-bold text-orange-600">
                    {currentParts.filter(p => p.materialType === "Accessories").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Gaskets</p>
                  <p className="text-xl font-bold text-green-600">
                    {currentParts.filter(p => p.materialType === "Gasket").length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500 mb-1">Glass</p>
                  <p className="text-xl font-bold text-cyan-600">
                    {currentParts.filter(p => p.materialType === "Glass").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
