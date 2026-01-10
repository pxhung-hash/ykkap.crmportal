import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ProductCatalog } from "./components/ProductCatalog";
import { ProductDetail } from "./components/ProductDetail";
import { Orders } from "./components/Orders";
import { Quotation } from "./components/Quotation";
import { WindowQuotation } from "./components/WindowQuotation";
import { Inventory } from "./components/Inventory";
import { Documents } from "./components/Documents";
import { Messages } from "./components/Messages";
import { Analytics } from "./components/Analytics";
import { Settings } from "./components/Settings";
import { AdminBackend } from "./components/AdminBackend";
import { MaterialCatalog } from "./components/MaterialCatalog";
import { UserManagement } from "./components/UserManagement";
import { LoginPage } from "./components/LoginPage";
import { SystemAdminLogin } from "./components/SystemAdminLogin";
import { ProfileSetup, ProfileData } from "./components/ProfileSetup";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { auth } from "./utils/supabaseHelpers";
import { supabase } from "./utils/supabaseClient";
import type { UserRole } from "./types/database.types";

// CRM Portal Application
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("Dealer");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [loginMode, setLoginMode] = useState<"dealer" | "admin">("dealer");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // User is logged in, get their profile
        const profile = await auth.getCurrentUserProfile();
        
        if (profile) {
          setIsLoggedIn(true);
          setHasProfile(true);
          setUserEmail(profile.email);
          setUserRole(profile.role);
          setUserId(profile.id);
          
          // Map profile data if exists
          if (profile.full_name || profile.phone) {
            setProfileData({
              fullName: profile.full_name || "",
              company: profile.company_name || "",
              phone: profile.phone || "",
              country: "",
              city: "",
              address: "",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking session:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load email server settings after login
  useEffect(() => {
    if (isLoggedIn && hasProfile) {
      loadEmailServerSettings();
    }
  }, [isLoggedIn, hasProfile]);

  const loadEmailServerSettings = async () => {
    try {
      console.log("Loading email server settings after login...");
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
          console.log("Email server settings loaded successfully after login:", data.smtpConfig);
        } else {
          console.log("No email server settings found in database");
        }
      } else {
        console.log("Could not load email server settings");
      }
    } catch (error) {
      console.error("Error loading email server settings after login:", error);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Sign in with Supabase
      const { user } = await auth.signIn(email, password);
      
      if (user) {
        // Get user profile from database
        const profile = await auth.getCurrentUserProfile();
        
        if (profile) {
          setIsLoggedIn(true);
          setHasProfile(true);
          setUserEmail(profile.email);
          setUserRole(profile.role);
          setUserId(profile.id);
          
          // Map profile data if exists
          if (profile.full_name || profile.phone) {
            setProfileData({
              fullName: profile.full_name || "",
              company: profile.company_name || "",
              phone: profile.phone || "",
              country: "",
              city: "",
              address: "",
            });
          }
          
          console.log("Login successful:", { email: profile.email, role: profile.role });
        } else {
          throw new Error("User profile not found. Please contact administrator.");
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      
      // Provide helpful error messages
      let errorMessage = "Login failed. Please check your credentials.";
      
      if (error.message?.includes("Invalid login credentials")) {
        errorMessage = "Invalid email or password. If you haven't created an account yet, click 'Create Test Users' on the login page.";
      } else if (error.message?.includes("Email not confirmed")) {
        errorMessage = "Please confirm your email address before logging in.";
      } else if (error.message?.includes("User not found")) {
        errorMessage = "No account found with this email. Please create an account first using the 'Create Test Users' button.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileComplete = (data: ProfileData) => {
    setProfileData(data);
    setHasProfile(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setHasProfile(false);
      setUserEmail("");
      setUserRole("Dealer");
      setProfileData(null);
      setUserId(null);
      setActiveTab("dashboard");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleViewProduct = (productId: number) => {
    setSelectedProductId(productId);
  };

  const handleBackToCatalog = () => {
    setSelectedProductId(null);
  };

  // Show loading spinner while checking session
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not logged in
  if (!isLoggedIn) {
    if (loginMode === "admin") {
      return (
        <SystemAdminLogin 
          onAdminLogin={handleLogin}
          onSwitchToDealer={() => setLoginMode("dealer")}
        />
      );
    }
    return (
      <LoginPage 
        onLogin={handleLogin}
        onSwitchToAdmin={() => setLoginMode("admin")}
      />
    );
  }

  // Show profile setup if logged in but no profile
  if (isLoggedIn && !hasProfile) {
    return <ProfileSetup onComplete={handleProfileComplete} initialEmail={userEmail} />;
  }

  const renderContent = () => {
    // If viewing a product detail, show that instead
    if (activeTab === "products" && selectedProductId !== null) {
      return <ProductDetail productId={selectedProductId} onBack={handleBackToCatalog} />;
    }

    // Access control: Prevent dealers from accessing admin and user management pages
    if (userRole === "Dealer" && (activeTab === "admin" || activeTab === "users")) {
      return (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-gray-900 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page. This area is restricted to administrators and sales staff only.
            </p>
            <button
              onClick={() => setActiveTab("dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <ProductCatalog onViewProduct={handleViewProduct} />;
      case "orders":
        return <Orders />;
      case "quotation":
        return <Quotation />;
      case "windowQuotation":
        return <WindowQuotation />;
      case "materials":
        return <MaterialCatalog />;
      case "inventory":
        return <Inventory />;
      case "documents":
        return <Documents />;
      case "messages":
        return <Messages />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings />;
      case "admin":
        return <AdminBackend />;
      case "users":
        return <UserManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userRole={userRole} />
        <main className="flex-1 p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}