import { projectId, publicAnonKey } from "../../../utils/supabase/info.tsx";

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server/make-server-04d82a51`;

export interface Material {
  id: string;
  itemCode: string;
  description: string;
  sectionImage?: string;
  series: string;
  length?: string;
  category: "profiles" | "hardware" | "accessories";
  subcategory: string;
  typeOfWindow: string;
  packingQuantity: number;
  minPurchaseQuantity: number;
  unitPrice?: number;
  retailPrice: number;
  packingPrice: number;
  stock: number;
  supplier: string;
  leadTime: string;
  material?: string;
  finish?: string;
  weight?: string;
  color: string;
  surfaceCertification?: string;
  status: "available" | "low_stock" | "out_of_stock" | "discontinued";
  createdAt: string;
  updatedAt: string;
}

// Mock data for development/fallback
const MOCK_MATERIALS: Material[] = [
  {
    id: "M001",
    itemCode: "YKK-AP-001",
    description: "Aluminum Window Frame Profile - 60mm",
    sectionImage: "https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?w=400",
    series: "AP Series",
    length: "6000mm",
    category: "profiles",
    subcategory: "Window Frames",
    typeOfWindow: "Sliding Window",
    packingQuantity: 20,
    minPurchaseQuantity: 5,
    unitPrice: 850000,
    retailPrice: 950000,
    packingPrice: 17000000,
    stock: 150,
    supplier: "YKK AP Vietnam",
    leadTime: "7-10 days",
    material: "Aluminum Alloy 6063-T5",
    finish: "Powder Coating",
    weight: "2.5kg/m",
    color: "Silver",
    surfaceCertification: "ISO 9001",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "M002",
    itemCode: "YKK-AP-002",
    description: "Window Lock Mechanism - Heavy Duty",
    sectionImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
    series: "Security Plus",
    length: "N/A",
    category: "hardware",
    subcategory: "Locks & Handles",
    typeOfWindow: "All Types",
    packingQuantity: 50,
    minPurchaseQuantity: 10,
    unitPrice: 125000,
    retailPrice: 165000,
    packingPrice: 6250000,
    stock: 300,
    supplier: "YKK AP Vietnam",
    leadTime: "3-5 days",
    material: "Stainless Steel 304",
    finish: "Brushed",
    weight: "0.3kg",
    color: "Chrome",
    surfaceCertification: "CE Certified",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "M003",
    itemCode: "YKK-AP-003",
    description: "Weather Seal Strip - EPDM Rubber",
    sectionImage: "https://images.unsplash.com/photo-1504192010706-dd7f569ee2be?w=400",
    series: "WeatherGuard",
    length: "100m Roll",
    category: "accessories",
    subcategory: "Seals & Gaskets",
    typeOfWindow: "All Types",
    packingQuantity: 10,
    minPurchaseQuantity: 2,
    unitPrice: 450000,
    retailPrice: 580000,
    packingPrice: 4500000,
    stock: 80,
    supplier: "YKK AP Vietnam",
    leadTime: "5-7 days",
    material: "EPDM Rubber",
    finish: "Extruded",
    weight: "0.15kg/m",
    color: "Black",
    surfaceCertification: "RoHS Compliant",
    status: "available",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Fetch all materials
export async function getAllMaterials(): Promise<Material[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      // Fallback: Get from localStorage or mock data
      const stored = localStorage.getItem("crm_materials");
      const localMaterials = stored ? JSON.parse(stored) : [];
      return [...MOCK_MATERIALS, ...localMaterials];
    }

    // Check if response has content
    const text = await response.text();
    if (!text) {
      const stored = localStorage.getItem("crm_materials");
      const localMaterials = stored ? JSON.parse(stored) : [];
      return [...MOCK_MATERIALS, ...localMaterials];
    }

    // Try to parse JSON
    const data = JSON.parse(text);
    
    if (!data.success) {
      const stored = localStorage.getItem("crm_materials");
      const localMaterials = stored ? JSON.parse(stored) : [];
      return [...MOCK_MATERIALS, ...localMaterials];
    }

    // Merge API materials with local materials
    const stored = localStorage.getItem("crm_materials");
    const localMaterials = stored ? JSON.parse(stored) : [];
    return [...(data.materials || []), ...localMaterials];
  } catch (error) {
    // Silently fallback to mock data + localStorage
    const stored = localStorage.getItem("crm_materials");
    const localMaterials = stored ? JSON.parse(stored) : [];
    return [...MOCK_MATERIALS, ...localMaterials];
  }
}

// Create new material
export async function createMaterial(material: Omit<Material, "id" | "createdAt" | "updatedAt">): Promise<{ success: boolean; materialId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/materials`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(material),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback: Save to localStorage
    const materialId = `M${Date.now().toString().slice(-6)}`;
    const newMaterial: Material = {
      ...material,
      id: materialId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const stored = localStorage.getItem("crm_materials");
    const materials = stored ? JSON.parse(stored) : [];
    materials.push(newMaterial);
    localStorage.setItem("crm_materials", JSON.stringify(materials));
    
    return { success: true, materialId };
  }
}

// Update material
export async function updateMaterial(id: string, material: Partial<Material>): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify(material),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    // Fallback: Update in localStorage
    const stored = localStorage.getItem("crm_materials");
    if (stored) {
      const materials = JSON.parse(stored);
      const index = materials.findIndex((m: Material) => m.id === id);
      if (index !== -1) {
        materials[index] = {
          ...materials[index],
          ...material,
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem("crm_materials", JSON.stringify(materials));
        return { success: true };
      }
    }
    return { success: false, error: "Material not found" };
  }
}

// Delete material
export async function deleteMaterial(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/materials/${id}`, {
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
    const stored = localStorage.getItem("crm_materials");
    if (stored) {
      const materials = JSON.parse(stored);
      const filtered = materials.filter((m: Material) => m.id !== id);
      localStorage.setItem("crm_materials", JSON.stringify(filtered));
      return { success: true };
    }
    return { success: false, error: "Material not found" };
  }
}