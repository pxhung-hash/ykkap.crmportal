import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Save,
  Home,
  ChevronRight,
  CheckCircle,
  ExternalLink,
  Layers,
  Settings,
  Shield,
  Lock,
  Gauge,
  Box,
  Info
} from "lucide-react";

type WindowCategory = "Sliding" | "Door" | "Casement" | "Top Hung" | "Louver" | "";

export function ProductConfigurationMaster() {
  // Basic Specification
  const [series, setSeries] = useState<string>("");
  const [windowCategory, setWindowCategory] = useState<WindowCategory>("");
  const [depth, setDepth] = useState<string>("");
  const [numberOfLeaves, setNumberOfLeaves] = useState<number>(2);
  const [bigOpening, setBigOpening] = useState<boolean>(false);

  // Performance Criteria
  const [windPressure, setWindPressure] = useState<string>("");
  const [waterproof, setWaterproof] = useState<string>("");

  // Detailed Specs & Hardware
  const [glassGroove, setGlassGroove] = useState<string>("18mm");
  const [interlockingStile, setInterlockingStile] = useState<string>("");
  const [hingePosition, setHingePosition] = useState<string>("");
  const [openDirection, setOpenDirection] = useState<string>("");

  // Lock System Configuration
  const [lockType, setLockType] = useState<string>("");

  // BOM Mapping
  const [outerBomId, setOuterBomId] = useState<string>("");
  const [innerBomId, setInnerBomId] = useState<string>("");
  const [outerBomStatus, setOuterBomStatus] = useState<"Matched" | "Not Found" | "Searching">("Searching");
  const [innerBomStatus, setInnerBomStatus] = useState<"Matched" | "Not Found" | "Searching">("Searching");
  const [totalWeight, setTotalWeight] = useState<number>(0);

  // Lock type options based on window category
  const getLockTypeOptions = () => {
    if (windowCategory === "Sliding") {
      return [
        { value: "crescent", label: "Crescent Lock" },
        { value: "multipoint", label: "Multi-point Lock" },
        { value: "hook", label: "Hook Lock" }
      ];
    } else if (windowCategory === "Door") {
      return [
        { value: "no_latch_4pt", label: "Lock w/ no latch + 4 points" },
        { value: "latch_4pt", label: "Lock w/ latch + 4 points" },
        { value: "latch_5pt", label: "Lock w/ latch + 5 points" }
      ];
    } else {
      return [
        { value: "standard", label: "Standard Lock" },
        { value: "security", label: "Security Lock" },
        { value: "multipoint", label: "Multi-point Lock" }
      ];
    }
  };

  // Check if hinge/direction fields should be disabled
  const isSlidingCategory = windowCategory === "Sliding";

  // Auto-generate BOM IDs based on configuration
  useEffect(() => {
    if (series && windowCategory && depth) {
      // Generate Outer BOM ID
      const seriesCode = series.replace(/\s+/g, "-");
      const categoryCode = windowCategory === "Sliding" ? "SL" : 
                          windowCategory === "Door" ? "DR" : 
                          windowCategory === "Casement" ? "CS" :
                          windowCategory === "Top Hung" ? "TH" : "LV";
      const depthCode = depth.replace("mm", "");
      
      const generatedOuterBOM = `BOM-OUT-${seriesCode}-${categoryCode}-${depthCode}`;
      setOuterBomId(generatedOuterBOM);
      setOuterBomStatus("Matched");

      // Generate Inner BOM ID
      const lockCode = lockType ? lockType.substring(0, 3).toUpperCase() : "STD";
      const leavesCode = `${numberOfLeaves}L`;
      
      const generatedInnerBOM = `BOM-INN-${categoryCode}-${leavesCode}-${lockCode}`;
      setInnerBomId(generatedInnerBOM);
      setInnerBomStatus("Matched");

      // Calculate weight (simplified calculation)
      const baseWeight = numberOfLeaves * 15;
      const depthWeight = parseInt(depthCode) / 10;
      const categoryWeight = windowCategory === "Door" ? 10 : 5;
      setTotalWeight(baseWeight + depthWeight + categoryWeight);
    } else {
      setOuterBomStatus("Searching");
      setInnerBomStatus("Searching");
    }
  }, [series, windowCategory, depth, numberOfLeaves, lockType]);

  const handleSaveConfiguration = () => {
    const config = {
      series,
      windowCategory,
      depth,
      numberOfLeaves,
      bigOpening,
      windPressure,
      waterproof,
      glassGroove,
      interlockingStile,
      hingePosition,
      openDirection,
      lockType,
      outerBomId,
      innerBomId,
      totalWeight
    };
    
    console.log("Saving configuration:", config);
    alert(`Configuration saved successfully!\n\nOuter BOM: ${outerBomId}\nInner BOM: ${innerBomId}\nTotal Weight: ${totalWeight.toFixed(2)} kg`);
  };

  const isFormValid = () => {
    return series && windowCategory && depth && windPressure && waterproof && interlockingStile && lockType;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Matched":
        return "bg-green-100 text-green-700 border-green-300";
      case "Not Found":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="px-8 py-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Home className="h-4 w-4" />
            <span>Home</span>
            <ChevronRight className="h-4 w-4" />
            <span>Product Management</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Configuration Setup</span>
          </div>

          {/* Title and Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-1">Product Configuration Master</h1>
              <p className="text-sm text-gray-500">
                Define product specifications to automatically link BOM components
              </p>
            </div>
            <Button 
              onClick={handleSaveConfiguration}
              disabled={!isFormValid()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Configuration Form (70%) */}
          <div className="lg:col-span-7 space-y-6">
            <Card>
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  Configuration Attributes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                {/* Section 1: Basic Specification */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <Box className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">1. Basic Specification</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Series <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={series}
                        onChange={(e) => setSeries(e.target.value)}
                      >
                        <option value="">Select Series...</option>
                        <option value="IWIN S">IWIN S</option>
                        <option value="IWIN E">IWIN E</option>
                        <option value="U4E">U4E</option>
                        <option value="U4ES">U4ES</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Window Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={windowCategory}
                        onChange={(e) => {
                          setWindowCategory(e.target.value as WindowCategory);
                          // Reset dependent fields
                          setLockType("");
                          if (e.target.value === "Sliding") {
                            setHingePosition("N/A");
                            setOpenDirection("N/A");
                          } else {
                            setHingePosition("");
                            setOpenDirection("");
                          }
                        }}
                      >
                        <option value="">Select Category...</option>
                        <option value="Sliding">Sliding</option>
                        <option value="Door">Door</option>
                        <option value="Casement">Casement</option>
                        <option value="Top Hung">Top Hung</option>
                        <option value="Louver">Louver</option>
                      </select>
                      {windowCategory && (
                        <p className="text-xs text-blue-600 mt-1">
                          <Info className="h-3 w-3 inline mr-1" />
                          Category affects lock type and hardware options
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Depth <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={depth}
                        onChange={(e) => setDepth(e.target.value)}
                      >
                        <option value="">Select Depth...</option>
                        <option value="50mm">50mm</option>
                        <option value="62.5mm">62.5mm</option>
                        <option value="92.5mm">92.5mm</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Leaves <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNumberOfLeaves(Math.max(1, numberOfLeaves - 1))}
                          className="h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
                        >
                          −
                        </button>
                        <Input
                          type="number"
                          min="1"
                          max="6"
                          value={numberOfLeaves}
                          onChange={(e) => setNumberOfLeaves(Math.max(1, Math.min(6, parseInt(e.target.value) || 1)))}
                          className="text-center h-10"
                        />
                        <button
                          type="button"
                          onClick={() => setNumberOfLeaves(Math.min(6, numberOfLeaves + 1))}
                          className="h-10 w-10 rounded-md border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center text-gray-600"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={bigOpening}
                            onChange={(e) => setBigOpening(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-700">Enable Big Opening Support</span>
                          <p className="text-xs text-gray-500">For openings wider than 2000mm</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Section 2: Performance Criteria */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <Gauge className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium text-gray-900">2. Performance Criteria</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wind Pressure <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={windPressure}
                        onChange={(e) => setWindPressure(e.target.value)}
                      >
                        <option value="">Select Wind Pressure...</option>
                        <option value="1200Pa">1200 Pa</option>
                        <option value="2000Pa">2000 Pa</option>
                        <option value="2500Pa">2500 Pa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Waterproof <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={waterproof}
                        onChange={(e) => setWaterproof(e.target.value)}
                      >
                        <option value="">Select Waterproof Rating...</option>
                        <option value="300Pa">300 Pa</option>
                        <option value="350Pa">350 Pa</option>
                        <option value="600Pa">600 Pa</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Detailed Specs & Hardware */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <Layers className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-gray-900">3. Detailed Specs & Hardware</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Glass Groove
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="glassGroove"
                            value="18mm"
                            checked={glassGroove === "18mm"}
                            onChange={(e) => setGlassGroove(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">18mm</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="glassGroove"
                            value="32mm"
                            checked={glassGroove === "32mm"}
                            onChange={(e) => setGlassGroove(e.target.value)}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700">32mm</span>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Interlocking Stile <span className="text-red-500">*</span>
                        </label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={interlockingStile}
                          onChange={(e) => setInterlockingStile(e.target.value)}
                        >
                          <option value="">Select Stile Type...</option>
                          <option value="A">Type A</option>
                          <option value="B">Type B</option>
                          <option value="C">Type C</option>
                          <option value="D">Type D</option>
                          <option value="E">Type E</option>
                          <option value="F">Type F</option>
                          <option value="SC">SC</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Hinge Position
                          {isSlidingCategory && (
                            <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-500">
                              N/A for Sliding
                            </Badge>
                          )}
                        </label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={hingePosition}
                          onChange={(e) => setHingePosition(e.target.value)}
                          disabled={isSlidingCategory}
                        >
                          <option value="">Select Position...</option>
                          <option value="Left">Left</option>
                          <option value="Right">Right</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Open Direction
                          {isSlidingCategory && (
                            <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-500">
                              N/A for Sliding
                            </Badge>
                          )}
                        </label>
                        <select
                          className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                          value={openDirection}
                          onChange={(e) => setOpenDirection(e.target.value)}
                          disabled={isSlidingCategory}
                        >
                          <option value="">Select Direction...</option>
                          <option value="Inswing">Inswing</option>
                          <option value="Outswing">Outswing</option>
                          <option value="N/A">N/A</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 4: Lock System Configuration */}
                <div>
                  <div className="flex items-center gap-2 mb-4 pb-2 border-b">
                    <Lock className="h-5 w-5 text-orange-600" />
                    <h3 className="font-medium text-gray-900">4. Lock System Configuration</h3>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lock Type <span className="text-red-500">*</span>
                      {windowCategory && (
                        <Badge variant="secondary" className="ml-2 bg-blue-100 text-blue-700">
                          Options for {windowCategory}
                        </Badge>
                      )}
                    </label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={lockType}
                      onChange={(e) => setLockType(e.target.value)}
                      disabled={!windowCategory}
                    >
                      <option value="">
                        {windowCategory ? "Select Lock Type..." : "Select Window Category First"}
                      </option>
                      {getLockTypeOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {windowCategory && (
                      <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-xs text-blue-800">
                          <Info className="h-3 w-3 inline mr-1" />
                          <strong>Conditional Options:</strong> Lock types are filtered based on your selected window category.
                          {windowCategory === "Sliding" && " Sliding windows support Crescent, Multi-point, and Hook locks."}
                          {windowCategory === "Door" && " Doors support multi-point locking systems with various latch configurations."}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - BOM Mapping Result (30%) */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-4">
              <Card className="border-2 border-blue-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Shield className="h-5 w-5 text-blue-600" />
                    BOM Mapping Result
                  </CardTitle>
                  <p className="text-xs text-gray-600 mt-1">
                    Linked Bill of Materials
                  </p>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {/* Outer BOM Card */}
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Box className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          Outer BOM
                        </h4>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(outerBomStatus)}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {outerBomStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Frame System</p>
                    <div className="relative">
                      <Input
                        value={outerBomId || "Awaiting configuration..."}
                        readOnly
                        className="text-xs font-mono bg-white border-green-200 pr-8"
                      />
                      {outerBomId && (
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600 hover:text-green-700">
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {outerBomId && (
                      <button className="text-xs text-green-700 hover:text-green-800 font-medium mt-2 flex items-center gap-1">
                        View Details
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Inner BOM Card */}
                  <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-purple-600" />
                        <h4 className="text-sm font-semibold text-gray-900">
                          Inner BOM
                        </h4>
                      </div>
                      <Badge className={`text-xs ${getStatusColor(innerBomStatus)}`}>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {innerBomStatus}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">Sash & Hardware</p>
                    <div className="relative">
                      <Input
                        value={innerBomId || "Awaiting configuration..."}
                        readOnly
                        className="text-xs font-mono bg-white border-purple-200 pr-8"
                      />
                      {innerBomId && (
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600 hover:text-purple-700">
                          <ExternalLink className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                    {innerBomId && (
                      <button className="text-xs text-purple-700 hover:text-purple-800 font-medium mt-2 flex items-center gap-1">
                        View Details
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="border-t pt-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4">
                      <p className="text-xs opacity-90 mb-1">Total Configured Weight</p>
                      <p className="text-2xl font-bold">
                        {totalWeight > 0 ? totalWeight.toFixed(2) : "—"} <span className="text-sm font-normal">kg</span>
                      </p>
                    </div>
                  </div>

                  {/* Configuration Status */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-gray-700 mb-2">Configuration Status</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Basic Spec</span>
                        <Badge variant={series && windowCategory ? "default" : "secondary"} className="text-xs">
                          {series && windowCategory ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Performance</span>
                        <Badge variant={windPressure && waterproof ? "default" : "secondary"} className="text-xs">
                          {windPressure && waterproof ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Lock System</span>
                        <Badge variant={lockType ? "default" : "secondary"} className="text-xs">
                          {lockType ? "Complete" : "Incomplete"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
