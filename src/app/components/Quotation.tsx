import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { SubmitQuotationModal } from "./SubmitQuotationModal";
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
  projectId,
  publicAnonKey,
} from "../../../utils/supabase/info";
import {
  Plus,
  Trash2,
  Send,
  Download,
  Eye,
  Calendar,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Upload,
  FileSpreadsheet,
  ImagePlus,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface QuotationItem {
  id: string;
  windowCode: string;
  image: string;
  description: string;
  series: string;
  width: number;
  height: number;
  area: number;
  quantity: number;
  unitPrice: number;
  discountRate: number;
}

export function Quotation() {
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
  });
  const [additionalInfo, setAdditionalInfo] = useState({
    projectType: "",
    deliveryDate: "",
    notes: "",
  });
  const [salesStatus, setSalesStatus] = useState("estimating"); // New field for sales status
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingQuotations, setIsLoadingQuotations] =
    useState(false);
  const [quotations, setQuotations] = useState([
    {
      id: "QT-176698909192",
      customerName: "Draft",
      date: "2025-12-29",
      items: 3,
      status: "draft",
      salesStatus: "estimating",
      total: "23,440,000 ₫",
    },
    {
      id: "QT-2024-005",
      customerName: "Draft",
      date: "2025-12-29",
      items: 2,
      status: "draft",
      salesStatus: "estimating",
      total: "19,440,000 ₫",
    },
    {
      id: "QT-176699248866",
      customerName: "YKK AP",
      date: "2025-12-29",
      items: 1,
      status: "estimating",
      salesStatus: "estimating",
      total: "1,080,000 ₫",
    },
    {
      id: "QT-2024-004",
      customerName: "Metro Construction LLC",
      date: "2025-12-28",
      items: 5,
      status: "submitted",
      salesStatus: "submitted",
      total: "12,450,000 ₫",
    },
    {
      id: "QT-2024-003",
      customerName: "BuildRight Solutions",
      date: "2025-12-27",
      items: 3,
      status: "negotiation",
      salesStatus: "negotiation",
      total: "8,200,000 ₫",
    },
    {
      id: "QT-2024-002",
      customerName: "Prime Windows & Doors",
      date: "2025-12-26",
      items: 8,
      status: "approved",
      salesStatus: "approved",
      total: "15,680,000 ₫",
    },
  ]);

  const [showNewQuotation, setShowNewQuotation] =
    useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] =
    useState(false);
  const [showDeleteDialog, setShowDeleteDialog] =
    useState(false);
  const [quotationToDelete, setQuotationToDelete] = useState<
    string | null
  >(null);
  const [currentQuotationId, setCurrentQuotationId] =
    useState("");
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Removed automatic database loading on mount
  // Quotations will only load when manually clicking Refresh button

  const loadQuotations = async () => {
    setIsLoadingQuotations(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        console.log(
          "No quotations found in database, using default list",
        );
        return;
      }

      const data = await response.json();

      if (
        data.success &&
        data.quotations &&
        data.quotations.length > 0
      ) {
        setQuotations(data.quotations);
        console.log(
          "Quotations loaded successfully:",
          data.quotations,
        );
      } else {
        console.log("No quotations available in database");
      }
    } catch (error) {
      console.log(
        "Could not connect to database, using default quotations list",
      );
    } finally {
      setIsLoadingQuotations(false);
    }
  };

  const loadQuotationDetail = async (quotationId: string) => {
    setIsLoadingDetail(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations/${quotationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      if (!response.ok) {
        alert(
          "Quotation not found in database. It may be a sample quotation.",
        );
        return;
      }

      const data = await response.json();

      if (data.success && data.quotation) {
        console.log(
          "Quotation details loaded:",
          data.quotation,
        );

        // Populate form with quotation data
        setCurrentQuotationId(data.quotation.id);
        setCustomerInfo(
          data.quotation.customerInfo || {
            companyName: "",
            contactPerson: "",
            email: "",
            phone: "",
            address: "",
          },
        );
        setItems(data.quotation.items || []);
        setAdditionalInfo(
          data.quotation.additionalInfo || {
            projectType: "",
            deliveryDate: "",
            notes: "",
          },
        );

        // Load sales status
        setSalesStatus(
          data.quotation.salesStatus || "estimating",
        );

        // Switch to new quotation view to show the details
        setShowNewQuotation(true);
      } else {
        alert("Failed to load quotation details");
      }
    } catch (error) {
      console.log(
        "Could not load quotation details from database",
      );
      alert(
        "This quotation is not available in the database. It may be a sample quotation.",
      );
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleViewQuotation = (quotationId: string) => {
    loadQuotationDetail(quotationId);
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: Date.now().toString(),
      windowCode: "",
      image: "",
      description: "",
      series: "",
      width: 0,
      height: 0,
      area: 0,
      quantity: 1,
      unitPrice: 0,
      discountRate: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof QuotationItem,
    value: string | number,
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };

          // Auto-calculate area when width or height changes
          if (field === "width" || field === "height") {
            updatedItem.area =
              (updatedItem.width * updatedItem.height) /
              1000000; // Convert mm² to m²
          }

          return updatedItem;
        }
        return item;
      }),
    );
  };

  const calculateTotalAmount = (item: QuotationItem) => {
    const subtotal = item.area * item.quantity * item.unitPrice;
    const discount = subtotal * (item.discountRate / 100);
    return subtotal - discount;
  };

  const calculateSubtotalBeforeDiscount = (
    item: QuotationItem,
  ) => {
    return item.area * item.quantity * item.unitPrice;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const handleDownloadTemplate = () => {
    // Create CSV content for Excel template
    const headers = [
      "Window Code",
      "Description",
      "Series",
      "Width (mm)",
      "Height (mm)",
      "Quantity",
      "Unit Price (VND/m²)",
      "Discount Rate (%)",
    ];

    const sampleData = [
      "YKK-350",
      "Sliding Window",
      "350",
      "1200",
      "1500",
      "5",
      "500000",
      "10",
      "YKK-450",
      "Casement Window",
      "450",
      "1000",
      "1400",
      "3",
      "600000",
      "5",
    ];

    const csvContent =
      headers.join(",") +
      "\n" +
      sampleData.slice(0, 8).join(",") +
      "\n" +
      sampleData.slice(8).join(",");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "quotation_template.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportExcel = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = text.split("\n").filter((row) => row.trim());

      // Skip header row
      const dataRows = rows.slice(1);

      const importedItems: QuotationItem[] = dataRows.map(
        (row, index) => {
          const columns = row
            .split(",")
            .map((col) => col.trim());
          const width = parseFloat(columns[3]) || 0;
          const height = parseFloat(columns[4]) || 0;
          const area = (width * height) / 1000000;

          return {
            id: `imported-${Date.now()}-${index}`,
            windowCode: columns[0] || "",
            description: columns[1] || "",
            series: columns[2] || "",
            width: width,
            height: height,
            area: area,
            quantity: parseInt(columns[5]) || 1,
            unitPrice: parseFloat(columns[6]) || 0,
            discountRate: parseFloat(columns[7]) || 0,
            image: "",
          };
        },
      );

      setItems([...items, ...importedItems]);
    };

    reader.readAsText(file);
    // Reset input so same file can be imported again
    event.target.value = "";
  };

  const handleImageUpload = (
    itemId: string,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageDataUrl = e.target?.result as string;
      updateItem(itemId, "image", imageDataUrl);
    };

    reader.readAsDataURL(file);
    // Reset input
    event.target.value = "";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 hover:bg-green-100";
      case "submitted":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100";
      case "negotiation":
        return "bg-orange-100 text-orange-700 hover:bg-orange-100";
      case "estimating":
        return "bg-purple-100 text-purple-700 hover:bg-purple-100";
      case "pending":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      case "draft":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
      case "rejected":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  const handleSubmitQuotation = (emailData: {
    recipientEmail: string;
    ccEmail: string;
    subject: string;
    message: string;
  }) => {
    console.log(
      "Submitting quotation with email data:",
      emailData,
    );
    // Here you would typically make an API call to submit the quotation
    // For now, we'll just close the modal and show success
  };

  const handleSaveDraft = async () => {
    // Validate required fields
    if (
      !customerInfo.companyName ||
      !customerInfo.contactPerson ||
      !customerInfo.email ||
      !customerInfo.phone
    ) {
      alert(
        "Please fill in all required fields: Company Name, Contact Person, Email Address, and Phone Number",
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSaving(true);

    try {
      const grandTotal = items.reduce(
        (sum, item) => sum + calculateTotalAmount(item),
        0,
      );
      // Keep the current quotation ID if it exists, otherwise create a new one
      const quotationId =
        currentQuotationId || `QT-${Date.now()}`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            id: quotationId,
            customerInfo,
            items,
            additionalInfo,
            total: formatCurrency(grandTotal),
            createdAt: new Date().toISOString(),
            salesStatus,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Show success message
        alert("Quotation draft saved successfully!");

        // Update local quotations list - check if quotation already exists
        const existingIndex = quotations.findIndex(
          (q) => q.id === quotationId,
        );
        const updatedQuotation = {
          id: quotationId,
          customerName: customerInfo.companyName || "Draft",
          date: new Date().toISOString(),
          items: items.length,
          status: "draft",
          salesStatus,
          total: formatCurrency(grandTotal),
        };

        if (existingIndex >= 0) {
          // Update existing quotation
          const newQuotations = [...quotations];
          newQuotations[existingIndex] = updatedQuotation;
          setQuotations(newQuotations);
        } else {
          // Add new quotation to the list
          setQuotations([updatedQuotation, ...quotations]);
        }

        // Keep the current quotation ID for future saves
        setCurrentQuotationId(quotationId);
      } else {
        throw new Error(
          data.error || "Failed to save quotation",
        );
      }
    } catch (error) {
      console.error("Error saving quotation draft:", error);
      alert(
        "Failed to save quotation draft. Please try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndClose = async () => {
    // Validate required fields
    if (
      !customerInfo.companyName ||
      !customerInfo.contactPerson ||
      !customerInfo.email ||
      !customerInfo.phone
    ) {
      alert(
        "Please fill in all required fields: Company Name, Contact Person, Email Address, and Phone Number",
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerInfo.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSaving(true);

    try {
      const grandTotal = items.reduce(
        (sum, item) => sum + calculateTotalAmount(item),
        0,
      );
      // Keep the current quotation ID if it exists, otherwise create a new one
      const quotationId =
        currentQuotationId || `QT-${Date.now()}`;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations/draft`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            id: quotationId,
            customerInfo,
            items,
            additionalInfo,
            total: formatCurrency(grandTotal),
            createdAt: new Date().toISOString(),
            salesStatus,
          }),
        },
      );

      const data = await response.json();

      if (data.success) {
        // Update local quotations list - check if quotation already exists
        const existingIndex = quotations.findIndex(
          (q) => q.id === quotationId,
        );
        const updatedQuotation = {
          id: quotationId,
          customerName: customerInfo.companyName || "Draft",
          date: new Date().toISOString(),
          items: items.length,
          status: "draft",
          salesStatus,
          total: formatCurrency(grandTotal),
        };

        if (existingIndex >= 0) {
          // Update existing quotation
          const newQuotations = [...quotations];
          newQuotations[existingIndex] = updatedQuotation;
          setQuotations(newQuotations);
        } else {
          // Add new quotation to the list
          setQuotations([updatedQuotation, ...quotations]);
        }

        // Close the quotation page and return to list view
        setShowNewQuotation(false);

        // Show success message
        alert("Quotation saved successfully!");
      } else {
        throw new Error(
          data.error || "Failed to save quotation",
        );
      }
    } catch (error) {
      console.error("Error saving quotation:", error);
      alert("Failed to save quotation. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNewQuotation = () => {
    // Clear all form fields and generate new quotation ID
    setCurrentQuotationId(`QT-${Date.now()}`);
    setCustomerInfo({
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
    });
    setItems([]);
    setAdditionalInfo({
      projectType: "",
      deliveryDate: "",
      notes: "",
    });
  };

  const handleDeleteQuotation = async () => {
    if (!quotationToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/quotations/${quotationToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
        },
      );

      const data = await response.json();

      if (data.success) {
        // Remove from local state
        setQuotations(
          quotations.filter((q) => q.id !== quotationToDelete),
        );
        alert("Quotation deleted successfully!");
      } else {
        // Even if server deletion fails, still remove from local state
        setQuotations(
          quotations.filter((q) => q.id !== quotationToDelete),
        );
        console.log("Quotation removed from local list");
      }
    } catch (error) {
      console.error("Error deleting quotation:", error);
      // Still remove from local state even if API call fails
      setQuotations(
        quotations.filter((q) => q.id !== quotationToDelete),
      );
      alert("Quotation removed from list");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setQuotationToDelete(null);
    }
  };

  const confirmDeleteQuotation = (quotationId: string) => {
    setQuotationToDelete(quotationId);
    setShowDeleteDialog(true);
  };

  if (showNewQuotation) {
    return (
      <div className="space-y-6">
        {/* Cancel Confirmation Dialog */}
        <AlertDialog
          open={showCancelDialog}
          onOpenChange={setShowCancelDialog}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Cancel Quotation?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel? Any unsaved
                changes will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowCancelDialog(false);
                  setShowNewQuotation(false);
                  // Reset form
                  setItems([]);
                  setCustomerInfo({
                    companyName: "",
                    contactPerson: "",
                    email: "",
                    phone: "",
                    address: "",
                  });
                  setAdditionalInfo({
                    projectType: "",
                    deliveryDate: "",
                    notes: "",
                  });
                  setSalesStatus("estimating");
                  setCurrentQuotationId("");
                }}
              >
                Yes
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">
              New Quotation Request
            </h2>
            <p className="text-gray-500">
              Create a new quotation request for YKK AP products
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleCreateNewQuotation}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Quotation
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      Company Name *
                    </Label>
                    <Input
                      id="companyName"
                      placeholder="Enter company name"
                      value={customerInfo.companyName}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          companyName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">
                      Contact Person *
                    </Label>
                    <Input
                      id="contactPerson"
                      placeholder="Enter contact name"
                      value={customerInfo.contactPerson}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          contactPerson: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="contact@company.com"
                      value={customerInfo.email}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={customerInfo.phone}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">
                    Project Address
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Enter project address"
                    rows={2}
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Products */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <CardTitle>Products</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownloadTemplate}
                      size="sm"
                      variant="outline"
                    >
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <label htmlFor="import-excel">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <span className="cursor-pointer">
                          <Upload className="h-4 w-4 mr-2" />
                          Import from Excel
                        </span>
                      </Button>
                      <input
                        id="import-excel"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleImportExcel}
                        className="hidden"
                      />
                    </label>
                    <Button onClick={addItem} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No products added yet</p>
                    <p className="text-sm mt-1">
                      Click "Add Product" to get started
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            No.
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Window Code
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Image
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Description
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Series
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Width (mm)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Height (mm)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Area (m²)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Qty
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Unit Price (VND/m²)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Total Amount (VND)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Discount (%)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Amount After Discount (VND)
                          </th>
                          <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr
                            key={item.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-2 text-sm">
                              {index + 1}
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                value={item.windowCode}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "windowCode",
                                    e.target.value,
                                  )
                                }
                                placeholder="YKK-350"
                                className="w-32 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="relative">
                                <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center overflow-hidden">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt="Product"
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs text-gray-400">
                                      No image
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="file"
                                  accept="image/*"
                                  id={`image-upload-${item.id}`}
                                  onChange={(e) =>
                                    handleImageUpload(
                                      item.id,
                                      e,
                                    )
                                  }
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`image-upload-${item.id}`}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="mt-1 w-16 h-7 p-0"
                                    type="button"
                                    asChild
                                  >
                                    <span className="cursor-pointer flex items-center justify-center">
                                      <ImagePlus className="h-3 w-3" />
                                    </span>
                                  </Button>
                                </label>
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                value={item.description}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "description",
                                    e.target.value,
                                  )
                                }
                                placeholder="Window description"
                                className="w-40 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Select
                                value={item.series}
                                onValueChange={(value) =>
                                  updateItem(
                                    item.id,
                                    "series",
                                    value,
                                  )
                                }
                              >
                                <SelectTrigger className="w-32 h-8 text-sm">
                                  <SelectValue placeholder="Series" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="350">
                                    350 Series
                                  </SelectItem>
                                  <SelectItem value="450">
                                    450 Series
                                  </SelectItem>
                                  <SelectItem value="550">
                                    550 Series
                                  </SelectItem>
                                  <SelectItem value="750">
                                    750 Series
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={item.width || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "width",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                placeholder="1200"
                                className="w-24 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={item.height || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "height",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                placeholder="1500"
                                className="w-24 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="w-20 h-8 bg-gray-50 rounded border flex items-center justify-center text-sm">
                                {item.area.toFixed(2)}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                min="1"
                                value={item.quantity || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "quantity",
                                    parseInt(e.target.value) ||
                                      1,
                                  )
                                }
                                className="w-20 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                value={item.unitPrice || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "unitPrice",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                placeholder="500000"
                                className="w-32 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="w-32 h-8 bg-gray-50 rounded border flex items-center justify-center text-sm font-medium">
                                {formatCurrency(
                                  calculateSubtotalBeforeDiscount(
                                    item,
                                  ),
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discountRate || ""}
                                onChange={(e) =>
                                  updateItem(
                                    item.id,
                                    "discountRate",
                                    parseFloat(
                                      e.target.value,
                                    ) || 0,
                                  )
                                }
                                placeholder="0"
                                className="w-20 h-8 text-sm"
                              />
                            </td>
                            <td className="py-3 px-2">
                              <div className="w-32 h-8 bg-blue-50 rounded border border-blue-200 flex items-center justify-center text-sm font-semibold text-blue-700">
                                {formatCurrency(
                                  calculateTotalAmount(item),
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  removeItem(item.id)
                                }
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Summary Row */}
                    {items.length > 0 && (
                      <div className="mt-6 flex justify-end">
                        <div className="w-96 space-y-2 border-t pt-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Subtotal:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(
                                items.reduce(
                                  (sum, item) =>
                                    sum +
                                    item.area *
                                      item.quantity *
                                      item.unitPrice,
                                  0,
                                ),
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Total Discount:
                            </span>
                            <span className="font-medium text-red-600">
                              -
                              {formatCurrency(
                                items.reduce(
                                  (sum, item) =>
                                    sum +
                                    (item.area *
                                      item.quantity *
                                      item.unitPrice *
                                      item.discountRate) /
                                      100,
                                  0,
                                ),
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between text-base border-t pt-2">
                            <span className="font-semibold text-gray-900">
                              Grand Total:
                            </span>
                            <span className="font-bold text-blue-600">
                              {formatCurrency(
                                items.reduce(
                                  (sum, item) =>
                                    sum +
                                    calculateTotalAmount(item),
                                  0,
                                ),
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Additional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="projectType">
                      Project Type
                    </Label>
                    <Select
                      value={additionalInfo.projectType}
                      onValueChange={(value) =>
                        setAdditionalInfo({
                          ...additionalInfo,
                          projectType: value,
                        })
                      }
                    >
                      <SelectTrigger id="projectType">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="commercial">
                          Commercial
                        </SelectItem>
                        <SelectItem value="residential">
                          Residential
                        </SelectItem>
                        <SelectItem value="industrial">
                          Industrial
                        </SelectItem>
                        <SelectItem value="government">
                          Government
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="deliveryDate">
                      Required Delivery Date
                    </Label>
                    <Input
                      id="deliveryDate"
                      type="date"
                      value={additionalInfo.deliveryDate}
                      onChange={(e) =>
                        setAdditionalInfo({
                          ...additionalInfo,
                          deliveryDate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">
                    Additional Notes
                  </Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Any additional information or special requests"
                    rows={4}
                    value={additionalInfo.notes}
                    onChange={(e) =>
                      setAdditionalInfo({
                        ...additionalInfo,
                        notes: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotation Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Quotation ID:
                    </span>
                    <span className="font-medium">
                      {currentQuotationId || `QT-${Date.now()}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Total Products:
                    </span>
                    <span className="font-medium">
                      {items.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Total Quantity:
                    </span>
                    <span className="font-medium">
                      {items.reduce(
                        (sum, item) => sum + item.quantity,
                        0,
                      )}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="salesStatus">
                      Status of Sales
                    </Label>
                    <Select
                      value={salesStatus}
                      onValueChange={(value) =>
                        setSalesStatus(value)
                      }
                    >
                      <SelectTrigger id="salesStatus">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estimating">
                          Estimating
                        </SelectItem>
                        <SelectItem value="submitted">
                          Submitted
                        </SelectItem>
                        <SelectItem value="negotiation">
                          Negotiation
                        </SelectItem>
                        <SelectItem value="approved">
                          Approved
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-4 border-t space-y-2">
                  <Button
                    className="w-full"
                    onClick={() => {
                      // Validate required fields before opening submission modal
                      if (
                        !customerInfo.companyName ||
                        !customerInfo.contactPerson ||
                        !customerInfo.email ||
                        !customerInfo.phone
                      ) {
                        alert(
                          "Please fill in all required fields: Company Name, Contact Person, Email Address, and Phone Number",
                        );
                        return;
                      }

                      // Validate email format
                      const emailRegex =
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                      if (
                        !emailRegex.test(customerInfo.email)
                      ) {
                        alert(
                          "Please enter a valid email address",
                        );
                        return;
                      }

                      // Use current quotation ID or generate new one if not exists
                      const quotationId =
                        currentQuotationId ||
                        `QT-${Date.now()}`;
                      setCurrentQuotationId(quotationId);
                      setShowSubmitModal(true);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submission
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSaveDraft}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Save as Draft
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleSaveAndClose}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-2" />
                    )}
                    Save and Close
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Your quotation request will be reviewed by
                    our team within 24 hours. You'll receive a
                    detailed quote with pricing via email.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-700">
                <p className="mb-2">Contact our sales team:</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3" />
                    <span>1-800-YKK-APAP</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>sales@ykkap.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SubmitQuotationModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmit={handleSubmitQuotation}
        quotationId={currentQuotationId}
        customerInfo={customerInfo}
        items={items}
        grandTotal={formatCurrency(
          items.reduce(
            (sum, item) => sum + calculateTotalAmount(item),
            0,
          ),
        )}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Quotation?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete quotation{" "}
              {quotationToDelete}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowDeleteDialog(false);
                setQuotationToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteQuotation}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 mb-2">
            Quotation Requests
          </h2>
          <p className="text-gray-500">
            Manage your product quotation requests
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={loadQuotations}
            disabled={isLoadingQuotations}
          >
            {isLoadingQuotations ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button onClick={() => setShowNewQuotation(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Quotation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Total Requests
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {quotations.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {
                    quotations.filter(
                      (q) => q.status === "pending",
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Approved
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {
                    quotations.filter(
                      (q) => q.status === "approved",
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Drafts</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {
                    quotations.filter(
                      (q) => q.status === "draft",
                    ).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Send className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quotations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Quotations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">
                    Quotation ID
                  </th>
                  <th className="text-left py-3 px-4">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Items</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">
                    Status of Sales
                  </th>
                  <th className="text-left py-3 px-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {quotations.map((quotation) => (
                  <tr
                    key={quotation.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td
                      className="py-4 px-4 font-medium cursor-pointer hover:text-blue-600 transition-colors"
                      onDoubleClick={() =>
                        handleViewQuotation(quotation.id)
                      }
                      title="Double-click to view details"
                    >
                      {quotation.id}
                    </td>
                    <td className="py-4 px-4">
                      {quotation.customerName}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(
                        quotation.date,
                      ).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {quotation.items} items
                    </td>
                    <td className="py-4 px-4 font-medium">
                      {quotation.total}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="secondary"
                        className={getStatusColor(
                          quotation.salesStatus ||
                            quotation.status,
                        )}
                      >
                        {quotation.salesStatus
                          ? quotation.salesStatus
                              .charAt(0)
                              .toUpperCase() +
                            quotation.salesStatus.slice(1)
                          : quotation.status
                              .charAt(0)
                              .toUpperCase() +
                            quotation.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleViewQuotation(quotation.id)
                          }
                          disabled={isLoadingDetail}
                        >
                          {isLoadingDetail ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            confirmDeleteQuotation(quotation.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}