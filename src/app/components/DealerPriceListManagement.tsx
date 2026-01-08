import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Upload,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  History,
  CheckCircle2,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  X,
  ChevronRight,
  RotateCcw,
  Eye,
  TrendingUp,
  TrendingDown,
  Package,
  Clock,
  Shield
} from "lucide-react";

interface PriceItem {
  id: string;
  materialId: string;
  materialName: string;
  description: string;
  unit: "Meter" | "Kg" | "Piece" | "Set";
  dealerPrice: number;
  category: "Profile" | "Hardware" | "Gasket" | "Glass" | "Accessory" | "Sealant";
  lastUpdated: string;
  priceChange?: number; // Percentage change from previous version
}

interface PriceVersion {
  versionNo: string;
  uploadDate: string;
  adminName: string;
  effectiveDate: string;
  documentUrl: string;
  itemCount: number;
  status: "Active" | "Scheduled" | "Historical";
}

const mockPriceItems: PriceItem[] = [
  {
    id: "1",
    materialId: "PRF-IWIN-S-001",
    materialName: "IWIN-S Frame Profile 50mm",
    description: "Aluminum frame profile for IWIN-S series, 50mm depth",
    unit: "Meter",
    dealerPrice: 125000,
    category: "Profile",
    lastUpdated: "2026-01-01",
    priceChange: 5.2
  },
  {
    id: "2",
    materialId: "HW-LOCK-CR-001",
    materialName: "Crescent Lock Assembly",
    description: "Standard crescent lock for sliding windows",
    unit: "Set",
    dealerPrice: 85000,
    category: "Hardware",
    lastUpdated: "2026-01-01",
    priceChange: 0
  },
  {
    id: "3",
    materialId: "GSK-EPDM-BK-001",
    materialName: "EPDM Gasket Black",
    description: "Weather sealing gasket, EPDM material, black color",
    unit: "Meter",
    dealerPrice: 15000,
    category: "Gasket",
    lastUpdated: "2026-01-01",
    priceChange: -3.5
  },
  {
    id: "4",
    materialId: "GLS-CLR-6MM-001",
    materialName: "Clear Glass 6mm",
    description: "Standard clear float glass, 6mm thickness",
    unit: "Kg",
    dealerPrice: 45000,
    category: "Glass",
    lastUpdated: "2026-01-01",
    priceChange: 12.8
  },
  {
    id: "5",
    materialId: "ACC-SCR-SS-001",
    materialName: "Stainless Steel Screw Kit",
    description: "Assorted stainless steel screws for window assembly",
    unit: "Set",
    dealerPrice: 25000,
    category: "Accessory",
    lastUpdated: "2026-01-01",
    priceChange: 0
  },
  {
    id: "6",
    materialId: "SEA-SIL-001",
    materialName: "Silicone Sealant Clear",
    description: "Clear silicone sealant for waterproofing",
    unit: "Piece",
    dealerPrice: 35000,
    category: "Sealant",
    lastUpdated: "2026-01-01",
    priceChange: 25.5
  }
];

const mockVersions: PriceVersion[] = [
  {
    versionNo: "v2.4",
    uploadDate: "2025-12-28",
    adminName: "Nguyen Van Admin",
    effectiveDate: "2026-01-01",
    documentUrl: "/docs/approval-v2.4.pdf",
    itemCount: 342,
    status: "Active"
  },
  {
    versionNo: "v2.3",
    uploadDate: "2025-10-15",
    adminName: "Tran Thi Manager",
    effectiveDate: "2025-11-01",
    documentUrl: "/docs/approval-v2.3.pdf",
    itemCount: 338,
    status: "Historical"
  },
  {
    versionNo: "v2.2",
    uploadDate: "2025-07-20",
    adminName: "Le Van Director",
    effectiveDate: "2025-08-01",
    documentUrl: "/docs/approval-v2.2.pdf",
    itemCount: 325,
    status: "Historical"
  }
];

export function DealerPriceListManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [priceItems, setPriceItems] = useState<PriceItem[]>(mockPriceItems);
  const [versions, setVersions] = useState<PriceVersion[]>(mockVersions);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [approvalDoc, setApprovalDoc] = useState<File | null>(null);
  const [effectiveDate, setEffectiveDate] = useState("");
  const [showVersionHistory, setShowVersionHistory] = useState(false);

  // KPIs
  const totalSKUs = priceItems.length;
  const latestUpdate = "2026-01-01";
  const exchangeRate = 24850; // USD to VND
  const activeVersion = versions.find(v => v.status === "Active");

  // Filter items
  const filteredItems = priceItems.filter(item => {
    const matchesSearch = 
      item.materialId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || item.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.xlsx') || file.name.endsWith('.csv')) {
        setUploadedFile(file);
      } else {
        alert("Please upload an Excel (.xlsx) or CSV (.csv) file");
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  const handleApprovalDocInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setApprovalDoc(e.target.files[0]);
    }
  };

  const handleImportComplete = () => {
    alert("Price list imported successfully! New version v2.5 will be effective on " + effectiveDate);
    setShowImportModal(false);
    setImportStep(1);
    setUploadedFile(null);
    setApprovalDoc(null);
    setEffectiveDate("");
  };

  const handleRevertVersion = (version: string) => {
    if (confirm(`Are you sure you want to revert to ${version}? This will replace the current active price list.`)) {
      alert(`Successfully reverted to ${version}`);
    }
  };

  const getPriceChangeColor = (change?: number) => {
    if (!change || change === 0) return "text-gray-600";
    if (change > 20) return "text-red-600";
    if (change > 0) return "text-orange-600";
    return "text-green-600";
  };

  const getPriceChangeIcon = (change?: number) => {
    if (!change || change === 0) return null;
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    return <TrendingDown className="h-3 w-3" />;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Profile":
        return "bg-blue-100 text-blue-700";
      case "Hardware":
        return "bg-purple-100 text-purple-700";
      case "Gasket":
        return "bg-green-100 text-green-700";
      case "Glass":
        return "bg-cyan-100 text-cyan-700";
      case "Accessory":
        return "bg-orange-100 text-orange-700";
      case "Sealant":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-gray-900 mb-1">Price List Management</h1>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-600">
                  Current Active Version: 
                  <span className="font-semibold text-blue-600 ml-1">
                    {activeVersion?.versionNo}
                  </span>
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Effective: 
                  <span className="font-medium ml-1">
                    {activeVersion?.effectiveDate}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowVersionHistory(!showVersionHistory)}
              >
                <History className="h-4 w-4 mr-2" />
                Version History
              </Button>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowImportModal(true)}
              >
                <Upload className="h-4 w-4 mr-2" />
                Import New Price List
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by Material ID, Name, or Description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 bg-gray-50"
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Priced Items (SKUs)</p>
                  <p className="text-3xl font-bold text-gray-900">{totalSKUs}</p>
                  <p className="text-xs text-gray-500 mt-1">Active in current version</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Latest Update</p>
                  <p className="text-2xl font-bold text-gray-900">{latestUpdate}</p>
                  <p className="text-xs text-gray-500 mt-1">by {activeVersion?.adminName}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Exchange Rate (USD/VND)</p>
                  <p className="text-3xl font-bold text-gray-900">{exchangeRate.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">Updated daily</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Filter className="h-4 w-4 text-gray-600" />
              <select
                className="h-9 px-3 rounded-md border border-gray-300 bg-white text-sm"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="Profile">Profile</option>
                <option value="Hardware">Hardware</option>
                <option value="Gasket">Gasket</option>
                <option value="Glass">Glass</option>
                <option value="Accessory">Accessory</option>
                <option value="Sealant">Sealant</option>
              </select>
              <Button size="sm" variant="outline" className="ml-auto">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Active Price Table */}
          <div className={showVersionHistory ? "lg:col-span-8" : "lg:col-span-12"}>
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-blue-600" />
                  Active Price Table
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b sticky top-0">
                      <tr>
                        <th className="p-3 text-left font-medium text-gray-700">Material ID</th>
                        <th className="p-3 text-left font-medium text-gray-700">Material Name & Description</th>
                        <th className="p-3 text-left font-medium text-gray-700">Unit</th>
                        <th className="p-3 text-left font-medium text-gray-700">Dealer Price (VND)</th>
                        <th className="p-3 text-left font-medium text-gray-700">Category</th>
                        <th className="p-3 text-left font-medium text-gray-700">Last Updated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredItems.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 mb-1">No price items found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                          </td>
                        </tr>
                      ) : (
                        filteredItems.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50">
                            <td className="p-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-blue-600 font-medium">
                                  {item.materialId}
                                </span>
                                {item.priceChange && Math.abs(item.priceChange) > 20 && (
                                  <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300 text-xs">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    High Change
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="font-medium text-gray-900">{item.materialName}</p>
                                <p className="text-xs text-gray-500">{item.description}</p>
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary" className="text-xs">
                                {item.unit}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {formatCurrency(item.dealerPrice)}
                                </p>
                                {item.priceChange !== undefined && item.priceChange !== 0 && (
                                  <div className={`flex items-center gap-1 text-xs mt-1 ${getPriceChangeColor(item.priceChange)}`}>
                                    {getPriceChangeIcon(item.priceChange)}
                                    <span>
                                      {item.priceChange > 0 ? '+' : ''}{item.priceChange.toFixed(1)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <Badge className={`text-xs ${getCategoryColor(item.category)}`}>
                                {item.category}
                              </Badge>
                            </td>
                            <td className="p-3 text-gray-600 text-xs">
                              {item.lastUpdated}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Table Footer */}
                {filteredItems.length > 0 && (
                  <div className="border-t p-4 flex items-center justify-between text-sm text-gray-600 bg-gray-50">
                    <span>Showing {filteredItems.length} of {totalSKUs} items</span>
                    <span className="text-xs">
                      <Shield className="h-3 w-3 inline mr-1 text-green-600" />
                      All prices verified and approved
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Version History Sidebar */}
          {showVersionHistory && (
            <div className="lg:col-span-4">
              <Card className="sticky top-24 border-2 border-purple-200">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <History className="h-5 w-5 text-purple-600" />
                      Version History
                    </CardTitle>
                    <button
                      onClick={() => setShowVersionHistory(false)}
                      className="p-1 hover:bg-white rounded"
                    >
                      <X className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Audit trail & compliance records
                  </p>
                </CardHeader>
                <CardContent className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
                  {versions.map((version) => (
                    <div
                      key={version.versionNo}
                      className={`border rounded-lg p-3 ${
                        version.status === "Active"
                          ? "bg-green-50 border-green-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{version.versionNo}</h4>
                          {version.status === "Active" && (
                            <Badge className="bg-green-100 text-green-700 text-xs mt-1">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Active
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{version.itemCount} items</span>
                      </div>

                      <div className="space-y-1 text-xs text-gray-600 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>Uploaded: {version.uploadDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{version.adminName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          <span>Effective: {version.effectiveDate}</span>
                        </div>
                      </div>

                      <div className="border-t pt-2 space-y-2">
                        <button className="w-full text-left flex items-center gap-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                          <FileText className="h-3 w-3" />
                          <span>Download Approval Document</span>
                          <Download className="h-3 w-3 ml-auto" />
                        </button>
                        {version.status !== "Active" && (
                          <button
                            onClick={() => handleRevertVersion(version.versionNo)}
                            className="w-full text-left flex items-center gap-2 text-xs text-orange-600 hover:text-orange-700 font-medium"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Revert to this version</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5 text-blue-600" />
                    Import New Price List
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Step {importStep} of 4
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportStep(1);
                    setUploadedFile(null);
                    setApprovalDoc(null);
                  }}
                  className="p-1 hover:bg-white rounded"
                >
                  <X className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex items-center ${step < 4 ? 'flex-1' : ''}`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          importStep >= step
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {importStep > step ? <CheckCircle2 className="h-5 w-5" /> : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-1 flex-1 mx-2 ${
                            importStep > step ? "bg-blue-600" : "bg-gray-200"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Upload</span>
                  <span>Document</span>
                  <span>Mapping</span>
                  <span>Schedule</span>
                </div>
              </div>

              {/* Step 1: Upload Zone */}
              {importStep === 1 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Step 1: Upload Excel File</h3>
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    <FileSpreadsheet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    {uploadedFile ? (
                      <div>
                        <p className="text-green-600 font-medium mb-2">
                          <CheckCircle2 className="h-5 w-5 inline mr-2" />
                          File uploaded successfully!
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{uploadedFile.name}</p>
                        <Button size="sm" variant="outline" onClick={() => setUploadedFile(null)}>
                          Remove File
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-2">
                          Drag and drop your Excel file here
                        </p>
                        <p className="text-sm text-gray-500 mb-4">or</p>
                        <label>
                          <input
                            type="file"
                            accept=".xlsx,.csv"
                            onChange={handleFileInput}
                            className="hidden"
                          />
                          <Button size="sm" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Browse Files
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-4">
                          Supported formats: .xlsx, .csv (Max 10MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      onClick={() => setImportStep(2)}
                      disabled={!uploadedFile}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next: Upload Approval Document
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Document Attachment */}
              {importStep === 2 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Step 2: Director's Signed Approval
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upload a signed and sealed approval document (Required for compliance)
                  </p>
                  <div className="border-2 border-orange-200 rounded-lg p-6 bg-orange-50 mb-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-orange-900 mb-1">
                          Compliance Requirement
                        </p>
                        <p className="text-xs text-orange-700">
                          All price list updates must be accompanied by an official approval document 
                          signed by the Director. This document will be stored for audit purposes.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    {approvalDoc ? (
                      <div>
                        <p className="text-green-600 font-medium mb-2">
                          <CheckCircle2 className="h-5 w-5 inline mr-2" />
                          Document uploaded!
                        </p>
                        <p className="text-sm text-gray-600 mb-4">{approvalDoc.name}</p>
                        <Button size="sm" variant="outline" onClick={() => setApprovalDoc(null)}>
                          Remove Document
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-700 mb-4">Upload Approval Document</p>
                        <label>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleApprovalDocInput}
                            className="hidden"
                          />
                          <Button size="sm" variant="outline" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </Button>
                        </label>
                        <p className="text-xs text-gray-500 mt-3">
                          Accepted formats: PDF, JPG, PNG (Max 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep(1)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setImportStep(3)}
                      disabled={!approvalDoc}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next: Data Mapping
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Data Mapping */}
              {importStep === 3 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Step 3: Data Mapping Preview
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Verify that Excel columns map correctly to database fields
                  </p>
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="p-3 text-left font-medium text-gray-700">Excel Column</th>
                          <th className="p-3 text-left font-medium text-gray-700">Database Field</th>
                          <th className="p-3 text-left font-medium text-gray-700">Sample Data</th>
                          <th className="p-3 text-center font-medium text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr>
                          <td className="p-3 font-mono text-xs">Material_ID</td>
                          <td className="p-3 text-gray-600">materialId</td>
                          <td className="p-3 text-gray-600">PRF-IWIN-S-001</td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">Material_Name</td>
                          <td className="p-3 text-gray-600">materialName</td>
                          <td className="p-3 text-gray-600">IWIN-S Frame Profile</td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">Unit</td>
                          <td className="p-3 text-gray-600">unit</td>
                          <td className="p-3 text-gray-600">Meter</td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">Dealer_Price_VND</td>
                          <td className="p-3 text-gray-600">dealerPrice</td>
                          <td className="p-3 text-gray-600">125000</td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          </td>
                        </tr>
                        <tr>
                          <td className="p-3 font-mono text-xs">Category</td>
                          <td className="p-3 text-gray-600">category</td>
                          <td className="p-3 text-gray-600">Profile</td>
                          <td className="p-3 text-center">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mx-auto" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">All fields mapped correctly</p>
                      <p className="text-xs text-green-700 mt-1">
                        342 rows detected • Ready to import
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep(2)}>
                      Back
                    </Button>
                    <Button
                      onClick={() => setImportStep(4)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Next: Set Effective Date
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Schedule */}
              {importStep === 4 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Step 4: Schedule Effective Date
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Set when this price list should become active
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Effective Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        value={effectiveDate}
                        onChange={(e) => setEffectiveDate(e.target.value)}
                        className="w-full"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        The price list will automatically become active at 00:00 on this date
                      </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">Import Summary</h4>
                      <div className="space-y-1 text-xs text-blue-700">
                        <p>• File: {uploadedFile?.name}</p>
                        <p>• Approval: {approvalDoc?.name}</p>
                        <p>• Total Items: 342</p>
                        <p>• New Version: v2.5</p>
                        {effectiveDate && <p>• Effective: {effectiveDate}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <Button variant="outline" onClick={() => setImportStep(3)}>
                      Back
                    </Button>
                    <Button
                      onClick={handleImportComplete}
                      disabled={!effectiveDate}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Complete Import
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
