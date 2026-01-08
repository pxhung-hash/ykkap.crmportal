import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Filter,
  Image as ImageIcon,
  FileText,
  CheckCircle
} from "lucide-react";
import exampleImage from 'figma:asset/87bd3445bc75b11be1b1dd74f756b0a1eaa6f813.png';
import { OuterBOMDetail } from "./OuterBOMDetail";
import { InnerBOMDetail } from "./InnerBOMDetail";
import { AddNewBOM } from "./AddNewBOM";
import { ImportBOMModal } from "./ImportBOMModal";

interface OuterBOM {
  id: number;
  bomCode: string;
  outsideViewImage: string;
  seriesCode: string;
  windowSystem: string;
  bomType: "outer";
  frameDepth: number;
  openDirection: "L" | "R" | "LR";
  handleType: string;
  systemDrawingNo: string;
  approvedDesign: string;
}

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

export function ModuleBOM() {
  const [searchTermOuter, setSearchTermOuter] = useState("");
  const [searchTermInner, setSearchTermInner] = useState("");
  const [selectedOuterBOM, setSelectedOuterBOM] = useState<OuterBOM | null>(null);
  const [selectedInnerBOM, setSelectedInnerBOM] = useState<InnerBOM | null>(null);
  const [viewingOuterBOM, setViewingOuterBOM] = useState<OuterBOM | null>(null);
  const [viewingInnerBOM, setViewingInnerBOM] = useState<InnerBOM | null>(null);
  const [showAddNewBOM, setShowAddNewBOM] = useState(false);
  const [showImportBOMModal, setShowImportBOMModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"outer" | "inner">("outer");

  // Sample Outer BOM data
  const [outerBOMs, setOuterBOMs] = useState<OuterBOM[]>([
    {
      id: 1,
      bomCode: "U4E-41001",
      outsideViewImage: exampleImage,
      seriesCode: "U4ES",
      windowSystem: "Outswing Casement",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "L",
      handleType: "Single Lock",
      systemDrawingNo: "DWG-U4E-001",
      approvedDesign: "Ishihara"
    },
    {
      id: 2,
      bomCode: "U4E-41002",
      outsideViewImage: exampleImage,
      seriesCode: "U4ES",
      windowSystem: "Outswing Casement",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "R",
      handleType: "Single Lock",
      systemDrawingNo: "DWG-U4E-002",
      approvedDesign: "Ishihara"
    },
    {
      id: 3,
      bomCode: "U4E-41003",
      outsideViewImage: exampleImage,
      seriesCode: "U4ES",
      windowSystem: "Outswing Casement",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "L",
      handleType: "Multipoint Lock",
      systemDrawingNo: "DWG-U4E-003",
      approvedDesign: "Ishihara"
    },
    {
      id: 4,
      bomCode: "U4E-41004",
      outsideViewImage: exampleImage,
      seriesCode: "U4ES",
      windowSystem: "Outswing Casement",
      bomType: "outer",
      frameDepth: 90,
      openDirection: "R",
      handleType: "Multipoint Lock",
      systemDrawingNo: "DWG-U4E-004",
      approvedDesign: "Yamada"
    },
    {
      id: 5,
      bomCode: "U4E-42001",
      outsideViewImage: exampleImage,
      seriesCode: "U4ES",
      windowSystem: "Fixed Window",
      bomType: "outer",
      frameDepth: 75,
      openDirection: "LR",
      handleType: "N/A",
      systemDrawingNo: "DWG-U4E-005",
      approvedDesign: "Ishihara"
    }
  ]);

  // Sample Inner BOM data
  const [innerBOMs, setInnerBOMs] = useState<InnerBOM[]>([
    {
      id: 1,
      bomCode: "U4I-51001",
      seriesCode: "U4IS",
      windowSystem: "Outswing Casement",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "L",
      handleType: "Single Lock",
      systemDrawingNo: "DWG-U4I-001",
      approvedDesign: "Ishihara"
    },
    {
      id: 2,
      bomCode: "U4I-51002",
      seriesCode: "U4IS",
      windowSystem: "Outswing Casement",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "R",
      handleType: "Single Lock",
      systemDrawingNo: "DWG-U4I-002",
      approvedDesign: "Ishihara"
    },
    {
      id: 3,
      bomCode: "U4I-51003",
      seriesCode: "U4IS",
      windowSystem: "Outswing Casement",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 32,
      openDirection: "L",
      handleType: "Multipoint Lock",
      systemDrawingNo: "DWG-U4I-003",
      approvedDesign: "Ishihara"
    },
    {
      id: 4,
      bomCode: "U4I-51004",
      seriesCode: "U4IS",
      windowSystem: "Outswing Casement",
      bomType: "inner",
      frameDepth: 90,
      glassGroove: 32,
      openDirection: "R",
      handleType: "Multipoint Lock",
      systemDrawingNo: "DWG-U4I-004",
      approvedDesign: "Yamada"
    },
    {
      id: 5,
      bomCode: "U4I-52001",
      seriesCode: "U4IS",
      windowSystem: "Fixed Window",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "LR",
      handleType: "N/A",
      systemDrawingNo: "DWG-U4I-005",
      approvedDesign: "Ishihara"
    },
    {
      id: 6,
      bomCode: "U4I-51005",
      seriesCode: "U4IS",
      windowSystem: "Sliding Window",
      bomType: "inner",
      frameDepth: 75,
      glassGroove: 18,
      openDirection: "L",
      handleType: "Slide Lock",
      systemDrawingNo: "DWG-U4I-006",
      approvedDesign: "Tanaka"
    }
  ]);

  const filteredOuterBOMs = outerBOMs.filter(bom =>
    bom.bomCode.toLowerCase().includes(searchTermOuter.toLowerCase()) ||
    bom.seriesCode.toLowerCase().includes(searchTermOuter.toLowerCase()) ||
    bom.windowSystem.toLowerCase().includes(searchTermOuter.toLowerCase()) ||
    bom.systemDrawingNo.toLowerCase().includes(searchTermOuter.toLowerCase())
  );

  const filteredInnerBOMs = innerBOMs.filter(bom =>
    bom.bomCode.toLowerCase().includes(searchTermInner.toLowerCase()) ||
    bom.seriesCode.toLowerCase().includes(searchTermInner.toLowerCase()) ||
    bom.windowSystem.toLowerCase().includes(searchTermInner.toLowerCase()) ||
    bom.systemDrawingNo.toLowerCase().includes(searchTermInner.toLowerCase())
  );

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

  return (
    <div className="space-y-6">
      {/* Outer BOM Detail Modal */}
      {viewingOuterBOM && (
        <OuterBOMDetail
          bom={viewingOuterBOM}
          onClose={() => setViewingOuterBOM(null)}
        />
      )}

      {/* Inner BOM Detail Modal */}
      {viewingInnerBOM && (
        <InnerBOMDetail
          bom={viewingInnerBOM}
          onClose={() => setViewingInnerBOM(null)}
        />
      )}

      {/* Add New BOM Modal */}
      {showAddNewBOM && (
        <AddNewBOM
          onClose={() => setShowAddNewBOM(false)}
          onSave={(bomData) => {
            if (bomData.bomType === "outer") {
              setOuterBOMs([...outerBOMs, bomData]);
            } else {
              setInnerBOMs([...innerBOMs, bomData]);
            }
            setShowAddNewBOM(false);
          }}
        />
      )}

      {/* Import BOM Modal */}
      {showImportBOMModal && (
        <ImportBOMModal
          onClose={() => setShowImportBOMModal(false)}
          bomType="outer"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">Module BOM Management</h2>
          <p className="text-gray-500">Manage Outer and Inner BOM configurations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportBOMModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import BOM
          </Button>
          <Button onClick={() => setShowAddNewBOM(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New BOM
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Outer BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{outerBOMs.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Inner BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{innerBOMs.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total BOMs</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{outerBOMs.length + innerBOMs.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Window Systems</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {new Set([...outerBOMs.map(b => b.windowSystem), ...innerBOMs.map(b => b.windowSystem)]).size}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Filter className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabbed View: Outer BOM and Inner BOM */}
      <Card>
        {/* Tab Headers */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("outer")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
              activeTab === "outer"
                ? "border-blue-600 bg-blue-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <ImageIcon className={`h-5 w-5 ${activeTab === "outer" ? "text-blue-600" : "text-gray-400"}`} />
            <span className={activeTab === "outer" ? "text-blue-900 font-medium" : "text-gray-600"}>
              Outer BOM
            </span>
            <Badge className={activeTab === "outer" ? "bg-blue-600" : "bg-gray-400"}>
              {outerBOMs.length} BOMs
            </Badge>
          </button>
          <button
            onClick={() => setActiveTab("inner")}
            className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
              activeTab === "inner"
                ? "border-green-600 bg-green-50"
                : "border-transparent hover:bg-gray-50"
            }`}
          >
            <FileText className={`h-5 w-5 ${activeTab === "inner" ? "text-green-600" : "text-gray-400"}`} />
            <span className={activeTab === "inner" ? "text-green-900 font-medium" : "text-gray-600"}>
              Inner BOM
            </span>
            <Badge className={activeTab === "inner" ? "bg-green-600" : "bg-gray-400"}>
              {innerBOMs.length} BOMs
            </Badge>
          </button>
        </div>

        {/* Tab Content */}
        <CardContent className="p-4 space-y-4">
          {/* Outer BOM Tab */}
          {activeTab === "outer" && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search outer BOMs..."
                  className="pl-10"
                  value={searchTermOuter}
                  onChange={(e) => setSearchTermOuter(e.target.value)}
                />
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">No.</th>
                        <th className="text-left p-3 font-medium text-gray-700">Image</th>
                        <th className="text-left p-3 font-medium text-gray-700">BOM Code</th>
                        <th className="text-left p-3 font-medium text-gray-700">Series</th>
                        <th className="text-left p-3 font-medium text-gray-700">Window System</th>
                        <th className="text-left p-3 font-medium text-gray-700">Frame Depth</th>
                        <th className="text-left p-3 font-medium text-gray-700">Direction</th>
                        <th className="text-left p-3 font-medium text-gray-700">Handle Type</th>
                        <th className="text-left p-3 font-medium text-gray-700">Drawing No.</th>
                        <th className="text-left p-3 font-medium text-gray-700">Approved By</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredOuterBOMs.map((bom, index) => (
                        <tr key={bom.id} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{index + 1}</td>
                          <td className="p-3">
                            <div className="w-16 h-16 bg-gray-100 rounded border overflow-hidden">
                              <img 
                                src={bom.outsideViewImage} 
                                alt={bom.bomCode}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="font-medium text-gray-900">{bom.bomCode}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                              {bom.seriesCode}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">{bom.windowSystem}</td>
                          <td className="p-3 text-gray-600">{bom.frameDepth}mm</td>
                          <td className="p-3">
                            <Badge variant="secondary" className={getDirectionBadgeColor(bom.openDirection)}>
                              {bom.openDirection}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">{bom.handleType}</td>
                          <td className="p-3">
                            <span className="text-xs font-mono text-gray-500">{bom.systemDrawingNo}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {bom.approvedDesign}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => setViewingOuterBOM(bom)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredOuterBOMs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <ImageIcon className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No outer BOMs found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Inner BOM Tab */}
          {activeTab === "inner" && (
            <>
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search inner BOMs..."
                  className="pl-10"
                  value={searchTermInner}
                  onChange={(e) => setSearchTermInner(e.target.value)}
                />
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-gray-700">No.</th>
                        <th className="text-left p-3 font-medium text-gray-700">BOM Code</th>
                        <th className="text-left p-3 font-medium text-gray-700">Series</th>
                        <th className="text-left p-3 font-medium text-gray-700">Window System</th>
                        <th className="text-left p-3 font-medium text-gray-700">Frame Depth</th>
                        <th className="text-left p-3 font-medium text-gray-700">Glass Groove</th>
                        <th className="text-left p-3 font-medium text-gray-700">Direction</th>
                        <th className="text-left p-3 font-medium text-gray-700">Handle Type</th>
                        <th className="text-left p-3 font-medium text-gray-700">Drawing No.</th>
                        <th className="text-left p-3 font-medium text-gray-700">Approved By</th>
                        <th className="text-left p-3 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {filteredInnerBOMs.map((bom, index) => (
                        <tr key={bom.id} className="hover:bg-gray-50">
                          <td className="p-3 text-gray-500">{index + 1}</td>
                          <td className="p-3">
                            <span className="font-medium text-gray-900">{bom.bomCode}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className="bg-green-100 text-green-700">
                              {bom.seriesCode}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">{bom.windowSystem}</td>
                          <td className="p-3 text-gray-600">{bom.frameDepth}mm</td>
                          <td className="p-3">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                              {bom.glassGroove}mm
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="secondary" className={getDirectionBadgeColor(bom.openDirection)}>
                              {bom.openDirection}
                            </Badge>
                          </td>
                          <td className="p-3 text-gray-600">{bom.handleType}</td>
                          <td className="p-3">
                            <span className="text-xs font-mono text-gray-500">{bom.systemDrawingNo}</span>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs">
                              {bom.approvedDesign}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              onClick={() => setViewingInnerBOM(bom)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredInnerBOMs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p>No inner BOMs found</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}