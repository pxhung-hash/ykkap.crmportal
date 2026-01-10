import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { UserPlus, Loader2, CheckCircle, XCircle } from "lucide-react";
import { projectId, publicAnonKey } from "../../../utils/supabase/info";

interface UserSetupProps {
  onClose: () => void;
  onUserCreated?: () => void;
}

export function UserSetup({ onClose, onUserCreated }: UserSetupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"Admin" | "Sales" | "Dealer" | "Viewer">("Dealer");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const createUser = async () => {
    if (!email || !password) {
      setMessage({ type: "error", text: "Email and password are required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            email,
            password,
            full_name: fullName,
            role,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setMessage({ 
          type: "success", 
          text: `User created successfully! You can now log in with ${email}` 
        });
        setEmail("");
        setPassword("");
        setFullName("");
        setRole("Dealer");
        
        if (onUserCreated) {
          onUserCreated();
        }
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create user" });
      }
    } catch (error: any) {
      console.error("Error creating user:", error);
      setMessage({ type: "error", text: error.message || "Failed to create user" });
    } finally {
      setLoading(false);
    }
  };

  const createDefaultUsers = async () => {
    setLoading(true);
    setMessage(null);

    const defaultUsers = [
      { email: "admin@ykkap.com", password: "admin123", full_name: "Admin User", role: "Admin" as const },
      { email: "sales@ykkap.com", password: "sales123", full_name: "Sales Manager", role: "Sales" as const },
      { email: "dealer@company.com", password: "dealer123", full_name: "Dealer User", role: "Dealer" as const },
    ];

    let successCount = 0;
    let failCount = 0;

    for (const user of defaultUsers) {
      try {
        const response = await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-04d82a51/signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${publicAnonKey}`,
            },
            body: JSON.stringify(user),
          }
        );

        const data = await response.json();
        if (data.success) {
          successCount++;
        } else {
          failCount++;
          console.error(`Failed to create ${user.email}:`, data.error);
        }
      } catch (error) {
        failCount++;
        console.error(`Error creating ${user.email}:`, error);
      }
    }

    setLoading(false);
    
    if (successCount > 0) {
      setMessage({ 
        type: "success", 
        text: `Created ${successCount} test user(s). ${failCount > 0 ? `(${failCount} already existed)` : ""}`
      });
      
      if (onUserCreated) {
        onUserCreated();
      }
    } else {
      setMessage({ 
        type: "error", 
        text: "All test users already exist or failed to create" 
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              <CardTitle>User Setup</CardTitle>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
          <CardDescription>
            Create test users to get started with the CRM Portal
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={message.type === "error" ? "destructive" : "default"}>
              {message.type === "success" ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="John Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                disabled={loading}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Admin">Admin</option>
                <option value="Sales">Sales</option>
                <option value="Dealer">Dealer</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>

            <Button
              onClick={createUser}
              disabled={loading || !email || !password}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create User
                </>
              )}
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-500">OR</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={createDefaultUsers}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Default Test Users"
              )}
            </Button>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-semibold text-blue-900 mb-2">Default Test Users:</p>
              <div className="space-y-1 text-xs text-blue-700">
                <p>• <strong>admin@ykkap.com</strong> / admin123 (Admin)</p>
                <p>• <strong>sales@ykkap.com</strong> / sales123 (Sales)</p>
                <p>• <strong>dealer@company.com</strong> / dealer123 (Dealer)</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onClose} variant="ghost" className="w-full">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}