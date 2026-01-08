import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { X, Save, History, User } from "lucide-react";

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

interface ChangeHistory {
  timestamp: string;
  user: string;
  field: string;
  oldValue: string;
  newValue: string;
}

interface EditBOMPartProps {
  part: BOMPart;
  onClose: () => void;
  onSave: (updatedPart: BOMPart, changes: ChangeHistory[]) => void;
  hasColorField?: boolean;
}

export function EditBOMPart({ part, onClose, onSave, hasColorField = false }: EditBOMPartProps) {
  const [editedPart, setEditedPart] = useState<BOMPart>({ ...part });
  const [currentUser] = useState("John Smith"); // In production, this would come from auth context

  const materialTypes: Array<"Profile" | "Hardware" | "Accessories" | "Gasket" | "Glass" | "Sealant"> = [
    "Profile",
    "Hardware",
    "Accessories",
    "Gasket",
    "Glass",
    "Sealant"
  ];

  const handleSave = () => {
    const changes: ChangeHistory[] = [];
    const timestamp = new Date().toISOString();

    // Track all changes
    Object.keys(editedPart).forEach((key) => {
      const fieldKey = key as keyof BOMPart;
      if (editedPart[fieldKey] !== part[fieldKey]) {
        changes.push({
          timestamp,
          user: currentUser,
          field: key,
          oldValue: String(part[fieldKey]),
          newValue: String(editedPart[fieldKey])
        });
      }
    });

    if (changes.length > 0) {
      onSave(editedPart, changes);
    } else {
      onClose();
    }
  };

  const updateField = (field: keyof BOMPart, value: any) => {
    setEditedPart(prev => ({ ...prev, [field]: value }));
  };

  const hasChanges = () => {
    return Object.keys(editedPart).some((key) => {
      const fieldKey = key as keyof BOMPart;
      return editedPart[fieldKey] !== part[fieldKey];
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-gray-900 mb-1">Edit BOM Part</h2>
              <p className="text-sm text-gray-500">Part Code: {part.partCode}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current User Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Editing as</p>
                  <p className="font-medium text-gray-900">{currentUser}</p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader className="bg-gray-50">
              <CardTitle>Part Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Row 1: Part Code, Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Part Code <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={editedPart.partCode}
                    onChange={(e) => updateField('partCode', e.target.value)}
                    placeholder="Enter part code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={editedPart.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>

              {/* Row 2: Qty, Material Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="number"
                    value={editedPart.qty}
                    onChange={(e) => updateField('qty', Number(e.target.value))}
                    placeholder="Enter quantity"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={editedPart.materialType}
                    onChange={(e) => updateField('materialType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {materialTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Cut Formula, Material */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cut Formula
                  </label>
                  <Input
                    value={editedPart.cutFormula}
                    onChange={(e) => updateField('cutFormula', e.target.value)}
                    placeholder="e.g., W - 40, H - 80, N/A"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use W for width, H for height (e.g., W - 40, 2W + 2H)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={editedPart.material}
                    onChange={(e) => updateField('material', e.target.value)}
                    placeholder="e.g., A6063S-T5, EPDM, SUS304"
                  />
                </div>
              </div>

              {/* Row 4: Angle, FAB No. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Angle
                  </label>
                  <Input
                    value={editedPart.angle}
                    onChange={(e) => updateField('angle', e.target.value)}
                    placeholder="e.g., 90°, 45°, N/A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    FAB No.
                  </label>
                  <Input
                    value={editedPart.fabNo}
                    onChange={(e) => updateField('fabNo', e.target.value)}
                    placeholder="e.g., FAB-001"
                  />
                </div>
              </div>

              {/* Row 5: Note, Remarks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <Input
                    value={editedPart.note}
                    onChange={(e) => updateField('note', e.target.value)}
                    placeholder="Enter note"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </label>
                  <Input
                    value={editedPart.remarks}
                    onChange={(e) => updateField('remarks', e.target.value)}
                    placeholder="Enter remarks"
                  />
                </div>
              </div>

              {/* Row 6: Color (if applicable) */}
              {hasColorField && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <Input
                      value={editedPart.color || ''}
                      onChange={(e) => updateField('color', e.target.value)}
                      placeholder="e.g., Silver, White, Black"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Change Summary */}
          {hasChanges() && (
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader className="bg-yellow-100 border-b border-yellow-200">
                <CardTitle className="flex items-center gap-2 text-yellow-900">
                  <History className="h-5 w-5" />
                  Pending Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {Object.keys(editedPart).map((key) => {
                    const fieldKey = key as keyof BOMPart;
                    if (editedPart[fieldKey] !== part[fieldKey]) {
                      return (
                        <div key={key} className="flex items-center gap-3 text-sm">
                          <Badge variant="outline" className="bg-white">
                            {key}
                          </Badge>
                          <span className="text-gray-500 line-through">
                            {String(part[fieldKey])}
                          </span>
                          <span className="text-gray-400">→</span>
                          <span className="font-medium text-gray-900">
                            {String(editedPart[fieldKey])}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
                <p className="text-xs text-yellow-700 mt-3">
                  These changes will be saved and recorded in the audit log.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t bg-gray-50 sticky bottom-0">
          <div className="text-sm text-gray-500">
            {hasChanges() ? (
              <span className="text-yellow-600 font-medium">● Unsaved changes</span>
            ) : (
              <span>No changes made</span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges()}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
