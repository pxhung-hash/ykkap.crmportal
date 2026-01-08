import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { X, Send, CheckCircle2, AlertCircle, Package, DollarSign } from "lucide-react";

interface QuotationItem {
  id: string;
  windowCode: string;
  description: string;
  quantity: number;
  unitPrice: number;
  area: number;
  discountRate: number;
}

interface SubmitQuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (emailData: { recipientEmail: string; ccEmail: string; subject: string; message: string }) => void;
  quotationId: string;
  customerInfo?: {
    companyName: string;
    contactPerson: string;
    email: string;
    phone: string;
  };
  items?: QuotationItem[];
  grandTotal?: string;
}

export function SubmitQuotationModal({ isOpen, onClose, onSubmit, quotationId, customerInfo, items, grandTotal }: SubmitQuotationModalProps) {
  const [recipientEmail, setRecipientEmail] = useState("sales@ykkap.com");
  const [ccEmail, setCcEmail] = useState("");
  const [subject, setSubject] = useState(`Quotation Request - ${quotationId}`);
  const [message, setMessage] = useState(
    "Dear YKK AP Team,\n\nI would like to request a quotation for the products listed in this request. Please review the details and provide pricing at your earliest convenience.\n\nThank you for your assistance.\n\nBest regards"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    onSubmit({ recipientEmail, ccEmail, subject, message });
    setIsSubmitting(false);
    setSubmitSuccess(true);

    // Close modal after showing success
    setTimeout(() => {
      setSubmitSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {submitSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Quotation Submitted Successfully!</h3>
            <p className="text-gray-600">
              Your quotation request has been sent to YKK AP. You will receive a response within 24 hours.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Submit Quotation Request</h2>
                <p className="text-sm text-gray-500 mt-1">Configure email settings and submit your quotation</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Quotation Summary - NEW */}
              {(customerInfo || items) && (
                <div className="bg-gray-50 border rounded-lg p-4 space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Quotation Summary
                  </h3>
                  
                  {customerInfo && (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <p className="font-medium text-gray-900">{customerInfo.companyName || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Contact:</span>
                        <p className="font-medium text-gray-900">{customerInfo.contactPerson || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>
                        <p className="font-medium text-gray-900">{customerInfo.email || "N/A"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>
                        <p className="font-medium text-gray-900">{customerInfo.phone || "N/A"}</p>
                      </div>
                    </div>
                  )}

                  {items && items.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Products</span>
                        <span className="text-sm text-gray-500">{items.length} item(s)</span>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {items.slice(0, 5).map((item, index) => (
                          <div key={item.id} className="text-xs text-gray-600 flex justify-between">
                            <span>{index + 1}. {item.windowCode || "N/A"} - {item.description || "No description"}</span>
                            <span className="font-medium">Qty: {item.quantity}</span>
                          </div>
                        ))}
                        {items.length > 5 && (
                          <p className="text-xs text-gray-500 italic">+ {items.length - 5} more items...</p>
                        )}
                      </div>
                    </div>
                  )}

                  {grandTotal && (
                    <div className="pt-3 border-t flex justify-between items-center">
                      <span className="font-semibold text-gray-900 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Grand Total:
                      </span>
                      <span className="font-bold text-blue-600">{grandTotal}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quotation Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Quotation ID: {quotationId}</p>
                    <p className="text-sm text-blue-700">
                      This quotation will be sent to YKK AP for review and pricing. You'll receive a detailed quote via email.
                    </p>
                  </div>
                </div>
              </div>

              {/* Recipient Email */}
              <div className="space-y-2">
                <Label htmlFor="recipientEmail">
                  Recipient Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="sales@ykkap.com"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Primary email address to receive this quotation request</p>
              </div>

              {/* CC Email */}
              <div className="space-y-2">
                <Label htmlFor="ccEmail">CC Email (Optional)</Label>
                <Input
                  id="ccEmail"
                  type="email"
                  value={ccEmail}
                  onChange={(e) => setCcEmail(e.target.value)}
                  placeholder="manager@yourcompany.com"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500">Send a copy to additional email addresses (separate multiple emails with commas)</p>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">
                  Subject <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">
                  Message <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  required
                  disabled={isSubmitting}
                  placeholder="Enter your message to YKK AP..."
                />
                <p className="text-xs text-gray-500">This message will be included with your quotation request</p>
              </div>

              {/* Attachment Info */}
              <div className="bg-gray-50 border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">Attachments</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Quotation details (PDF)</li>
                  <li>• Product specifications</li>
                  <li>• Customer information</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Submit Quotation
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}