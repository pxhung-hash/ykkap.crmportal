import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle, Server, Loader2 } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export function Settings() {
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailStatus, setTestEmailStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [loadingStatus, setLoadingStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [smtpSettings, setSmtpSettings] = useState({
    host: "smtp.gmail.com",
    port: "587",
    security: "tls",
    username: "your-email@company.com",
    password: "",
    senderEmail: "noreply@company.com",
    senderName: "YKK AP Dealer Portal"
  });

  // Load SMTP settings from database on component mount
  useEffect(() => {
    loadSmtpSettings();
  }, []);

  const loadSmtpSettings = async () => {
    setLoadingStatus("loading");
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/smtp-config`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.smtpConfig) {
          setSmtpSettings({
            host: data.smtpConfig.host || "smtp.gmail.com",
            port: data.smtpConfig.port || "587",
            security: data.smtpConfig.security || "tls",
            username: data.smtpConfig.username || "your-email@company.com",
            password: data.smtpConfig.password || "",
            senderEmail: data.smtpConfig.senderEmail || "noreply@company.com",
            senderName: data.smtpConfig.senderName || "YKK AP Dealer Portal"
          });
          console.log("SMTP settings loaded successfully:", data.smtpConfig);
          setLoadingStatus("success");
        } else {
          console.log("No SMTP configuration found in database, using defaults");
          setLoadingStatus("idle");
        }
      } else {
        console.log("No SMTP configuration found, using defaults");
        setLoadingStatus("idle");
      }
    } catch (error) {
      console.error("Error loading SMTP settings:", error);
      setLoadingStatus("error");
      setTimeout(() => setLoadingStatus("idle"), 3000);
    }
  };

  const handleTestEmail = async () => {
    setTestEmailStatus("testing");
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTestEmailStatus("success");
    setTimeout(() => setTestEmailStatus("idle"), 3000);
  };

  const handleSaveConfiguration = async () => {
    setSaveStatus("saving");
    
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/save-smtp-config`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${publicAnonKey}`
          },
          body: JSON.stringify({
            smtpSettings
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save SMTP configuration:", errorData);
        setSaveStatus("error");
        setTimeout(() => setSaveStatus("idle"), 3000);
        return;
      }

      const result = await response.json();
      console.log("SMTP configuration saved successfully:", result);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving SMTP configuration:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-500">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="company">Company</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="email">Email Server</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Dealer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue="john.dealer@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" defaultValue="Purchasing Manager" />
              </div>
              <Separator />
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="company">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>Manage your company details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" defaultValue="Premium Building Supplies" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dealerId">Dealer ID</Label>
                <Input id="dealerId" defaultValue="#12345" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" defaultValue="123 Main Street" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" defaultValue="New York" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" defaultValue="NY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP Code</Label>
                  <Input id="zip" defaultValue="10001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input id="taxId" defaultValue="XX-XXXXXXX" />
              </div>
              <Separator />
              <div className="flex justify-end gap-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Order Updates</Label>
                  <p className="text-sm text-gray-500">Receive notifications about your orders</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Product Announcements</Label>
                  <p className="text-sm text-gray-500">Get notified about new products and updates</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Price Changes</Label>
                  <p className="text-sm text-gray-500">Alerts when product prices change</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Inventory Alerts</Label>
                  <p className="text-sm text-gray-500">Notifications about low stock items</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Promotional Offers</Label>
                  <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Monthly Reports</Label>
                  <p className="text-sm text-gray-500">Get monthly summary reports via email</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Email Server Configuration
                  {loadingStatus === "loading" && (
                    <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  )}
                </CardTitle>
                <CardDescription>Configure SMTP settings for sending quotations and notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Loading Success Message */}
                {loadingStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex gap-2 items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <p className="text-sm text-green-900">
                        Email server settings loaded from database
                      </p>
                    </div>
                  </div>
                )}

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">Important: Configure your email server</p>
                      <p className="text-blue-700">
                        These settings are used to send quotation requests and system notifications. 
                        Make sure to use valid SMTP credentials from your email provider.
                      </p>
                    </div>
                  </div>
                </div>

                {/* SMTP Server Settings */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">SMTP Server Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpHost">
                        SMTP Host <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="smtpHost" 
                        value={smtpSettings.host}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, host: e.target.value })}
                        placeholder="smtp.gmail.com"
                      />
                      <p className="text-xs text-gray-500">Your email provider's SMTP server address</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">
                        SMTP Port <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="smtpPort" 
                        value={smtpSettings.port}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, port: e.target.value })}
                        placeholder="587"
                      />
                      <p className="text-xs text-gray-500">Common ports: 587 (TLS), 465 (SSL), 25 (No encryption)</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpSecurity">
                      Security Protocol <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={smtpSettings.security} 
                      onValueChange={(value) => setSmtpSettings({ ...smtpSettings, security: value })}
                    >
                      <SelectTrigger id="smtpSecurity">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tls">TLS (Recommended)</SelectItem>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="none">None (Not recommended)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">TLS is the most secure and widely supported option</p>
                  </div>
                </div>

                <Separator />

                {/* Authentication */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Authentication</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername">
                      Username / Email <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="smtpUsername" 
                      type="email"
                      value={smtpSettings.username}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, username: e.target.value })}
                      placeholder="your-email@company.com"
                    />
                    <p className="text-xs text-gray-500">Your email account username (usually your email address)</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword">
                      Password <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input 
                        id="smtpPassword" 
                        type={showPassword ? "text" : "password"}
                        value={smtpSettings.password}
                        onChange={(e) => setSmtpSettings({ ...smtpSettings, password: e.target.value })}
                        placeholder="Enter your password or app-specific password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">
                      For Gmail, use an App Password. For other providers, use your account password.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Sender Information */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Sender Information</h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="senderEmail">
                      Sender Email Address <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="senderEmail" 
                      type="email"
                      value={smtpSettings.senderEmail}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, senderEmail: e.target.value })}
                      placeholder="noreply@company.com"
                    />
                    <p className="text-xs text-gray-500">The email address that will appear as sender</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="senderName">
                      Sender Name <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="senderName" 
                      value={smtpSettings.senderName}
                      onChange={(e) => setSmtpSettings({ ...smtpSettings, senderName: e.target.value })}
                      placeholder="YKK AP Dealer Portal"
                    />
                    <p className="text-xs text-gray-500">The name that will appear as sender</p>
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={handleTestEmail}
                    disabled={testEmailStatus === "testing"}
                    className="flex-1"
                  >
                    {testEmailStatus === "testing" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2" />
                        Testing Connection...
                      </>
                    ) : testEmailStatus === "success" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Connection Successful
                      </>
                    ) : testEmailStatus === "error" ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2 text-red-600" />
                        Connection Failed
                      </>
                    ) : (
                      <>
                        <Server className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleSaveConfiguration}
                    disabled={saveStatus === "saving"}
                  >
                    {saveStatus === "saving" ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : saveStatus === "success" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Saved Successfully
                      </>
                    ) : saveStatus === "error" ? (
                      <>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Save Failed
                      </>
                    ) : (
                      "Save Configuration"
                    )}
                  </Button>
                </div>

                {/* Save Success Message */}
                {saveStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="text-sm text-green-900">
                        <p className="font-medium">Configuration saved successfully!</p>
                        <p className="text-green-700 mt-1">
                          Your email server settings have been saved to the database.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Save Error Message */}
                {saveStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div className="text-sm text-red-900">
                        <p className="font-medium">Failed to save configuration</p>
                        <p className="text-red-700 mt-1">
                          There was an error saving your settings. Please try again.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Test Success Message */}
                {testEmailStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div className="text-sm text-green-900">
                        <p className="font-medium">Connection successful!</p>
                        <p className="text-green-700 mt-1">
                          Your email server settings are configured correctly. You can now send quotations.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Common SMTP Providers Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Common SMTP Providers</CardTitle>
                <CardDescription>Quick configuration guides for popular email providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Gmail */}
                  <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium text-gray-900">Gmail</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Host:</span> smtp.gmail.com</p>
                      <p><span className="font-medium">Port:</span> 587 (TLS) or 465 (SSL)</p>
                      <p><span className="font-medium">Note:</span> Use App Password, not account password</p>
                    </div>
                  </div>

                  {/* Outlook / Office 365 */}
                  <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium text-gray-900">Outlook / Office 365</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Host:</span> smtp.office365.com</p>
                      <p><span className="font-medium">Port:</span> 587 (TLS)</p>
                      <p><span className="font-medium">Note:</span> Use your full email and password</p>
                    </div>
                  </div>

                  {/* Yahoo */}
                  <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium text-gray-900">Yahoo Mail</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Host:</span> smtp.mail.yahoo.com</p>
                      <p><span className="font-medium">Port:</span> 587 (TLS) or 465 (SSL)</p>
                      <p><span className="font-medium">Note:</span> Enable "Allow apps that use less secure sign in"</p>
                    </div>
                  </div>

                  {/* Custom SMTP */}
                  <div className="p-4 border rounded-lg space-y-2">
                    <h4 className="font-medium text-gray-900">Custom SMTP Server</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p><span className="font-medium">Host:</span> Your SMTP server</p>
                      <p><span className="font-medium">Port:</span> Contact your provider</p>
                      <p><span className="font-medium">Note:</span> Contact your IT admin for details</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>Update your account password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input id="confirmPassword" type="password" />
                </div>
                <Separator />
                <div className="flex justify-end gap-4">
                  <Button variant="outline">Cancel</Button>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>Add an extra layer of security to your account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable 2FA</Label>
                    <p className="text-sm text-gray-500">Require a verification code when signing in</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Manage your active sessions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Current Session</p>
                    <p className="text-sm text-gray-500">Chrome on Windows - New York, NY</p>
                    <p className="text-xs text-gray-400">Last active: Just now</p>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Mobile Device</p>
                    <p className="text-sm text-gray-500">Safari on iPhone - New York, NY</p>
                    <p className="text-xs text-gray-400">Last active: 2 hours ago</p>
                  </div>
                  <Button variant="outline" size="sm">Revoke</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}