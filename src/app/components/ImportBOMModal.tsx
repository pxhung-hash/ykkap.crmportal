import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Download, ArrowRight, ArrowLeft } from "lucide-react";
import * as XLSX from "xlsx";

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

interface ImportBOMModalProps {
  onClose: () => void;
  onImport?: (parts: BOMPart[]) => void;
  bomType?: "outer" | "inner";
}

type Step = "upload" | "mapping" | "preview";

export function ImportBOMModal({ onClose, onImport, bomType = "outer" }: ImportBOMModalProps) {
  const [currentStep, setCurrentStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
  // Column mapping state
  const [columnMapping, setColumnMapping] = useState<{[key: string]: string}>({
    partCode: "",
    description: "",
    qty: "",
    materialType: "",
    cutFormula: "",
    material: "",
    note: "",
    remarks: "",
    angle: "",
    fabNo: "",
    color: ""
  });

  const [previewData, setPreviewData] = useState<BOMPart[]>([]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      const data = await selectedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("The Excel file is empty!");
        setIsProcessing(false);
        return;
      }

      // Extract column names from first row
      const columns = Object.keys(jsonData[0] as any);
      setExcelColumns(columns);
      setExcelData(jsonData);
      
      // Auto-map columns if they match exactly
      const autoMapping: {[key: string]: string} = {};
      const fieldMappings = {
        'Part Code': 'partCode',
        'Description': 'description',
        'Qty': 'qty',
        'Material Type': 'materialType',
        'Cut Formula': 'cutFormula',
        'Material': 'material',
        'Note': 'note',
        'Remarks': 'remarks',
        'Angle': 'angle',
        'FAB No.': 'fabNo',
        'Color': 'color'
      };

      columns.forEach(col => {
        const mappedField = fieldMappings[col as keyof typeof fieldMappings];
        if (mappedField) {
          autoMapping[mappedField] = col;
        }
      });

      setColumnMapping(prev => ({ ...prev, ...autoMapping }));
      setUploadSuccess(true);
    } catch (error) {
      alert(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const droppedFile = event.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!droppedFile.name.match(/\.(xlsx|xls)$/)) {
      alert("Please drop an Excel file (.xlsx or .xls)");
      return;
    }

    // Simulate file input
    const input = document.getElementById('file-upload') as HTMLInputElement;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(droppedFile);
    input.files = dataTransfer.files;
    
    // Trigger file processing
    const changeEvent = new Event('change', { bubbles: true });
    input.dispatchEvent(changeEvent);
    
    setFile(droppedFile);
    setIsProcessing(true);
    setUploadSuccess(false);

    try {
      const data = await droppedFile.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        alert("The Excel file is empty!");
        setIsProcessing(false);
        return;
      }

      const columns = Object.keys(jsonData[0] as any);
      setExcelColumns(columns);
      setExcelData(jsonData);
      
      // Auto-map columns
      const autoMapping: {[key: string]: string} = {};
      const fieldMappings = {
        'Part Code': 'partCode',
        'Description': 'description',
        'Qty': 'qty',
        'Material Type': 'materialType',
        'Cut Formula': 'cutFormula',
        'Material': 'material',
        'Note': 'note',
        'Remarks': 'remarks',
        'Angle': 'angle',
        'FAB No.': 'fabNo',
        'Color': 'color'
      };

      columns.forEach(col => {
        const mappedField = fieldMappings[col as keyof typeof fieldMappings];
        if (mappedField) {
          autoMapping[mappedField] = col;
        }
      });

      setColumnMapping(prev => ({ ...prev, ...autoMapping }));
      setUploadSuccess(true);
    } catch (error) {
      alert(`Error reading file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const proceedToMapping = () => {
    if (!uploadSuccess) {
      alert("Please upload a file first!");
      return;
    }
    setCurrentStep("mapping");
  };

  const proceedToPreview = () => {
    // Validate required mappings
    const required = ['partCode', 'description', 'qty', 'materialType', 'material'];
    const missingFields = required.filter(field => !columnMapping[field]);
    
    if (missingFields.length > 0) {
      alert(`Please map the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Generate preview data
    const parsedParts: BOMPart[] = excelData.map((row: any, index: number) => ({
      id: Date.now() + index,
      partCode: String(row[columnMapping.partCode] || ''),
      description: String(row[columnMapping.description] || ''),
      qty: Number(row[columnMapping.qty]) || 1,
      materialType: row[columnMapping.materialType] as any || 'Profile',
      cutFormula: String(row[columnMapping.cutFormula] || 'N/A'),
      material: String(row[columnMapping.material] || ''),
      note: String(row[columnMapping.note] || ''),
      remarks: String(row[columnMapping.remarks] || ''),
      angle: String(row[columnMapping.angle] || 'N/A'),
      fabNo: String(row[columnMapping.fabNo] || 'N/A'),
      ...(bomType === "inner" && columnMapping.color ? { color: String(row[columnMapping.color] || '') } : {})
    }));

    setPreviewData(parsedParts);
    setCurrentStep("preview");
  };

  const handleFinalImport = () => {
    if (onImport) {
      onImport(previewData);
    }
    onClose();
  };

  const downloadTemplate = () => {
    const headers = bomType === "inner" 
      ? ["Part Code", "Description", "Qty", "Material Type", "Cut Formula", "Material", "Note", "Remarks", "Angle", "FAB No.", "Color"]
      : ["Part Code", "Description", "Qty", "Material Type", "Cut Formula", "Material", "Note", "Remarks", "Angle", "FAB No."];
    
    const sampleData = bomType === "inner"
      ? [["I-FRM-001", "Inner Frame Top Profile", 1, "Profile", "W - 35", "A6063S-T5", "Inner frame top", "Anodized finish", "90°", "FAB-I01", "Silver"]]
      : [["O-FRM-001", "Outer Frame Top Profile", 1, "Profile", "W", "A6063S-T5", "Outer frame top", "Anodized finish", "90°", "FAB-O01"]];

    const ws = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "BOM Template");
    XLSX.writeFile(wb, `${bomType}_bom_template.xlsx`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <Card className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="bg-blue-50 border-b sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-blue-600" />
              Import {bomType === "inner" ? "Inner" : "Outer"} BOM from Excel
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step 1: Upload */}
          {currentStep === "upload" && (
            <div className="space-y-6">
              {/* Download Template */}
              <Card className="bg-gray-50 border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-1">Need a template?</h3>
                      <p className="text-sm text-gray-600">Download our Excel template to get started</p>
                    </div>
                    <Button variant="outline" onClick={downloadTemplate}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Excel File (.xlsx, .xls)
                </label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-600 mb-1">
                      {file ? file.name : "Click to select an Excel file"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports .xlsx and .xls formats
                    </p>
                  </label>
                </div>
              </div>

              {/* Processing State */}
              {isProcessing && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Processing file...</p>
                </div>
              )}

              {/* Success Message */}
              {uploadSuccess && (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                      <div>
                        <h3 className="font-medium text-green-900">File uploaded successfully!</h3>
                        <p className="text-sm text-green-700">
                          {file?.name} - {excelData.length} rows found
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Required Fields Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Required Excel Columns:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-800">
                    <span>• Part Code</span>
                    <span>• Description</span>
                    <span>• Qty</span>
                    <span>• Material Type</span>
                    <span>• Material</span>
                  </div>
                  <p className="text-xs text-blue-700 mt-2">
                    Optional: Cut Formula, Note, Remarks, Angle, FAB No.
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Material Type must be: Profile, Hardware, Accessories, Gasket, Glass, or Sealant
                  </p>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={proceedToMapping}
                  disabled={!uploadSuccess}
                >
                  Next: Map Columns
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Column Mapping */}
          {currentStep === "mapping" && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Map Excel Columns to BOM Fields</h3>
                <p className="text-sm text-blue-700">
                  Select the Excel column that corresponds to each BOM field. Required fields are marked with *
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Part Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Code <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.partCode}
                    onChange={(e) => setColumnMapping({...columnMapping, partCode: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.description}
                    onChange={(e) => setColumnMapping({...columnMapping, description: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Qty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Qty <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.qty}
                    onChange={(e) => setColumnMapping({...columnMapping, qty: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Material Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.materialType}
                    onChange={(e) => setColumnMapping({...columnMapping, materialType: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Material */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.material}
                    onChange={(e) => setColumnMapping({...columnMapping, material: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Cut Formula */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cut Formula
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.cutFormula}
                    onChange={(e) => setColumnMapping({...columnMapping, cutFormula: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.note}
                    onChange={(e) => setColumnMapping({...columnMapping, note: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Remarks */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.remarks}
                    onChange={(e) => setColumnMapping({...columnMapping, remarks: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Angle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Angle
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.angle}
                    onChange={(e) => setColumnMapping({...columnMapping, angle: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* FAB No */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FAB No.
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                    value={columnMapping.fabNo}
                    onChange={(e) => setColumnMapping({...columnMapping, fabNo: e.target.value})}
                  >
                    <option value="">-- Select Column --</option>
                    {excelColumns.map(col => (
                      <option key={col} value={col}>{col}</option>
                    ))}
                  </select>
                </div>

                {/* Color (Inner BOM only) */}
                {bomType === "inner" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm"
                      value={columnMapping.color}
                      onChange={(e) => setColumnMapping({...columnMapping, color: e.target.value})}
                    >
                      <option value="">-- Select Column --</option>
                      {excelColumns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep("upload")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button onClick={proceedToPreview}>
                  Preview Data
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {currentStep === "preview" && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">Preview Import Data</h3>
                    <p className="text-sm text-green-700">
                      Review the data below. If everything looks correct, click Import to add these parts to the BOM.
                    </p>
                  </div>
                </div>
              </div>

              <Card>
                <CardHeader className="bg-gray-50">
                  <CardTitle className="text-base">
                    {previewData.length} Parts Ready to Import
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr className="border-b">
                            <th className="text-left p-3 font-medium">#</th>
                            <th className="text-left p-3 font-medium">Part Code</th>
                            <th className="text-left p-3 font-medium">Description</th>
                            <th className="text-left p-3 font-medium">Qty</th>
                            <th className="text-left p-3 font-medium">Type</th>
                            <th className="text-left p-3 font-medium">Material</th>
                            <th className="text-left p-3 font-medium">Cut Formula</th>
                            {bomType === "inner" && (
                              <th className="text-left p-3 font-medium">Color</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {previewData.map((part, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="p-3 text-gray-500">{index + 1}</td>
                              <td className="p-3 font-mono text-xs">{part.partCode}</td>
                              <td className="p-3">{part.description}</td>
                              <td className="p-3 text-center">
                                <Badge variant="secondary" className="bg-gray-100">
                                  {part.qty}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <Badge variant="secondary" className="text-xs">
                                  {part.materialType}
                                </Badge>
                              </td>
                              <td className="p-3 text-xs">{part.material}</td>
                              <td className="p-3">
                                <code className="text-xs bg-blue-50 px-2 py-1 rounded text-blue-700">
                                  {part.cutFormula}
                                </code>
                              </td>
                              {bomType === "inner" && (
                                <td className="p-3">{part.color}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <Button variant="outline" onClick={() => setCurrentStep("mapping")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Edit
                </Button>
                <Button onClick={handleFinalImport} className="bg-green-600 hover:bg-green-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Import {previewData.length} Parts
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
