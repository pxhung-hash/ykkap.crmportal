import { projectId, publicAnonKey } from "../../../utils/supabase/info.tsx";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server/make-server-04d82a51`;

export interface User {
  id: string;
  email: string;
  fullName: string;
  company?: string;
  phone?: string;
  role: "admin" | "dealer" | "sales" | "viewer";
  status: "active" | "inactive" | "suspended";
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock data for development/fallback
const MOCK_USERS: User[] = [
  {
    id: "U001",
    email: "admin@ykkap.com",
    fullName: "Admin User",
    company: "YKK AP Vietnam",
    phone: "+84 123 456 789",
    role: "admin",
    status: "active",
    lastLogin: new Date(Date.now() - 3600000).toISOString(),
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "U002",
    email: "dealer1@company.com",
    fullName: "Nguyen Van A",
    company: "ABC Construction Co.",
    phone: "+84 987 654 321",
    role: "dealer",
    status: "active",
    lastLogin: new Date(Date.now() - 7200000).toISOString(),
    createdAt: "2024-02-01T09:30:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "U003",
    email: "sales@ykkap.com",
    fullName: "Tran Thi B",
    company: "YKK AP Vietnam",
    phone: "+84 912 345 678",
    role: "sales",
    status: "active",
    lastLogin: new Date(Date.now() - 1800000).toISOString(),
    createdAt: "2024-01-20T14:00:00Z",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "U004",
    email: "dealer2@construction.vn",
    fullName: "Le Van C",
    company: "XYZ Building Materials",
    phone: "+84 903 456 789",
    role: "dealer",
    status: "inactive",
    lastLogin: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdAt: "2024-03-10T11:00:00Z",
    updatedAt: new Date().toISOString(),
  },
];

// Fetch all users
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
    });

    if (!response.ok) {
      const stored = localStorage.getItem("crm_users");
      const localUsers = stored ? JSON.parse(stored) : [];
      return [...MOCK_USERS, ...localUsers];
    }

    const text = await response.text();
    if (!text) {
      const stored = localStorage.getItem("crm_users");
      const localUsers = stored ? JSON.parse(stored) : [];
      return [...MOCK_USERS, ...localUsers];
    }

    const data = JSON.parse(text);
    
    if (!data.success) {
      const stored = localStorage.getItem("crm_users");
      const localUsers = stored ? JSON.parse(stored) : [];
      return [...MOCK_USERS, ...localUsers];
    }

    const stored = localStorage.getItem("crm_users");
    const localUsers = stored ? JSON.parse(stored) : [];
    return [...(data.users || []), ...localUsers];
  } catch (error) {
    const stored = localStorage.getItem("crm_users");
    const localUsers = stored ? JSON.parse(stored) : [];
    return [...MOCK_USERS, ...localUsers];
  }
}

// Create new user
export async function createUser(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback: Save to localStorage
    const userId = `U${Date.now().toString().slice(-6)}`;
    const newUser: User = {
      ...user,
      id: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const stored = localStorage.getItem("crm_users");
    const users = stored ? JSON.parse(stored) : [];
    users.push(newUser);
    localStorage.setItem("crm_users", JSON.stringify(users));
    
    return { success: true, userId };
  }
}

// Update user
export async function updateUser(id: string, user: Partial<User>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback: Update in localStorage
    const stored = localStorage.getItem("crm_users");
    if (stored) {
      const users = JSON.parse(stored);
      const index = users.findIndex((u: User) => u.id === id);
      if (index !== -1) {
        users[index] = {
          ...users[index],
          ...user,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("crm_users", JSON.stringify(users));
        return { success: true };
      }
    }
    return { success: false, error: "User not found" };
  }
}

// Delete user
export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback: Delete from localStorage
    const stored = localStorage.getItem("crm_users");
    if (stored) {
      const users = JSON.parse(stored);
      const filtered = users.filter((u: User) => u.id !== id);
      localStorage.setItem("crm_users", JSON.stringify(filtered));
      return { success: true };
    }
    return { success: false, error: "User not found" };
  }
}
