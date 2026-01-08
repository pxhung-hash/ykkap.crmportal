import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-04d82a51/health", (c) => {
  return c.json({ status: "ok" });
});

// Save quotation draft
app.post("/make-server-04d82a51/quotations/draft", async (c) => {
  try {
    const body = await c.req.json();
    const quotationId = body.id || `QT-${Date.now()}`;
    
    // Save the quotation data to the KV store
    await kv.set(`quotation:${quotationId}`, {
      id: quotationId,
      status: "draft",
      customerInfo: body.customerInfo,
      items: body.items,
      additionalInfo: body.additionalInfo,
      salesStatus: body.salesStatus || "estimating",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also save to a list of quotations for the user
    const userQuotations = await kv.get(`quotations:list`) || [];
    const existingIndex = userQuotations.findIndex((q: any) => q.id === quotationId);
    
    const quotationSummary = {
      id: quotationId,
      customerName: body.customerInfo?.companyName || "Draft",
      date: new Date().toISOString(),
      items: body.items?.length || 0,
      status: "draft",
      salesStatus: body.salesStatus || "estimating",
      total: body.total || "$0.00"
    };

    if (existingIndex >= 0) {
      userQuotations[existingIndex] = quotationSummary;
    } else {
      userQuotations.push(quotationSummary);
    }

    await kv.set(`quotations:list`, userQuotations);

    return c.json({ 
      success: true, 
      quotationId,
      message: "Quotation draft saved successfully" 
    });
  } catch (error) {
    console.error("Error saving quotation draft:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Get quotation by ID
app.get("/make-server-04d82a51/quotations/:id", async (c) => {
  try {
    const quotationId = c.req.param("id");
    const quotation = await kv.get(`quotation:${quotationId}`);
    
    if (!quotation) {
      return c.json({ success: false, error: "Quotation not found" }, 404);
    }

    return c.json({ success: true, quotation });
  } catch (error) {
    console.error("Error fetching quotation:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get all quotations list
app.get("/make-server-04d82a51/quotations", async (c) => {
  try {
    const quotations = await kv.get(`quotations:list`) || [];
    return c.json({ success: true, quotations });
  } catch (error) {
    console.error("Error fetching quotations list:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete quotation
app.delete("/make-server-04d82a51/quotations/:id", async (c) => {
  try {
    const quotationId = c.req.param("id");
    
    // Delete the quotation data
    await kv.del(`quotation:${quotationId}`);
    
    // Remove from list
    const userQuotations = await kv.get(`quotations:list`) || [];
    const filteredQuotations = userQuotations.filter((q: any) => q.id !== quotationId);
    await kv.set(`quotations:list`, filteredQuotations);

    return c.json({ success: true, message: "Quotation deleted successfully" });
  } catch (error) {
    console.error("Error deleting quotation:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Save SMTP configuration
app.post("/make-server-04d82a51/save-smtp-config", async (c) => {
  try {
    const body = await c.req.json();
    const { smtpSettings } = body;
    
    if (!smtpSettings) {
      return c.json({ 
        success: false, 
        error: "SMTP settings are required" 
      }, 400);
    }

    // Save the SMTP configuration to the KV store
    await kv.set("smtp:config", {
      host: smtpSettings.host,
      port: smtpSettings.port,
      security: smtpSettings.security,
      username: smtpSettings.username,
      password: smtpSettings.password, // Note: In production, encrypt passwords
      senderEmail: smtpSettings.senderEmail,
      senderName: smtpSettings.senderName,
      updatedAt: new Date().toISOString(),
    });

    console.log("SMTP configuration saved successfully");

    return c.json({ 
      success: true, 
      message: "SMTP configuration saved successfully" 
    });
  } catch (error) {
    console.error("Error saving SMTP configuration:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Get SMTP configuration
app.get("/make-server-04d82a51/smtp-config", async (c) => {
  try {
    const smtpConfig = await kv.get("smtp:config");
    
    if (!smtpConfig) {
      return c.json({ 
        success: false, 
        error: "SMTP configuration not found" 
      }, 404);
    }

    return c.json({ success: true, smtpConfig });
  } catch (error) {
    console.error("Error fetching SMTP configuration:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============ ORDER MANAGEMENT ENDPOINTS ============

// Create new order from quotation
app.post("/make-server-04d82a51/orders", async (c) => {
  try {
    const body = await c.req.json();
    const orderId = body.id || `ORD-${Date.now()}`;
    
    // Save the order data to the KV store
    await kv.set(`order:${orderId}`, {
      id: orderId,
      quotationId: body.quotationId,
      customerInfo: body.customerInfo,
      items: body.items,
      orderInfo: body.orderInfo,
      status: body.status || "processing",
      tracking: "",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also save to a list of orders
    const ordersList = await kv.get(`orders:list`) || [];
    
    const orderSummary = {
      id: orderId,
      quotationId: body.quotationId,
      customerName: body.customerInfo?.companyName || "Unknown",
      date: new Date().toISOString(),
      products: body.items?.length > 0 ? body.items[0].description : "Order items",
      itemCount: body.items?.length || 0,
      total: body.total || "0 ₫",
      status: body.status || "processing",
      tracking: "-",
      estDelivery: body.orderInfo?.deliveryDate || ""
    };

    ordersList.unshift(orderSummary); // Add to beginning of array
    await kv.set(`orders:list`, ordersList);

    return c.json({ 
      success: true, 
      orderId,
      message: "Order created successfully" 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Get all orders list
app.get("/make-server-04d82a51/orders", async (c) => {
  try {
    const orders = await kv.get(`orders:list`) || [];
    return c.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching orders list:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get order by ID
app.get("/make-server-04d82a51/orders/:id", async (c) => {
  try {
    const orderId = c.req.param("id");
    const order = await kv.get(`order:${orderId}`);
    
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }

    return c.json({ success: true, order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update order status and tracking
app.put("/make-server-04d82a51/orders/:id", async (c) => {
  try {
    const orderId = c.req.param("id");
    const body = await c.req.json();
    
    const order = await kv.get(`order:${orderId}`);
    if (!order) {
      return c.json({ success: false, error: "Order not found" }, 404);
    }

    // Update order details
    const updatedOrder = {
      ...order,
      status: body.status || order.status,
      tracking: body.tracking || order.tracking,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${orderId}`, updatedOrder);

    // Update in orders list
    const ordersList = await kv.get(`orders:list`) || [];
    const orderIndex = ordersList.findIndex((o: any) => o.id === orderId);
    
    if (orderIndex >= 0) {
      ordersList[orderIndex] = {
        ...ordersList[orderIndex],
        status: body.status || ordersList[orderIndex].status,
        tracking: body.tracking || ordersList[orderIndex].tracking,
      };
      await kv.set(`orders:list`, ordersList);
    }

    return c.json({ 
      success: true, 
      message: "Order updated successfully",
      order: updatedOrder
    });
  } catch (error) {
    console.error("Error updating order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete order
app.delete("/make-server-04d82a51/orders/:id", async (c) => {
  try {
    const orderId = c.req.param("id");
    
    // Delete the order data
    await kv.del(`order:${orderId}`);
    
    // Remove from list
    const ordersList = await kv.get(`orders:list`) || [];
    const filteredOrders = ordersList.filter((o: any) => o.id !== orderId);
    await kv.set(`orders:list`, filteredOrders);

    return c.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ============ MATERIAL CATALOG ENDPOINTS ============

// Create new material
app.post("/make-server-04d82a51/materials", async (c) => {
  try {
    const body = await c.req.json();
    const materialId = body.id || `M${Date.now().toString().slice(-6)}`;
    
    // Save the material data to the KV store
    await kv.set(`material:${materialId}`, {
      id: materialId,
      itemCode: body.itemCode,
      description: body.description,
      sectionImage: body.sectionImage,
      series: body.series,
      length: body.length,
      category: body.category,
      subcategory: body.subcategory,
      typeOfWindow: body.typeOfWindow,
      packingQuantity: body.packingQuantity,
      minPurchaseQuantity: body.minPurchaseQuantity,
      unitPrice: body.unitPrice,
      retailPrice: body.retailPrice,
      packingPrice: body.packingPrice,
      stock: body.stock,
      supplier: body.supplier,
      leadTime: body.leadTime,
      material: body.material,
      finish: body.finish,
      weight: body.weight,
      color: body.color,
      surfaceCertification: body.surfaceCertification,
      status: body.status || "available",
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Also save to a list of materials for quick access
    const materialsList = await kv.get(`materials:list`) || [];
    const materialSummary = {
      id: materialId,
      itemCode: body.itemCode,
      description: body.description,
      category: body.category,
      status: body.status || "available"
    };
    materialsList.push(materialSummary);
    await kv.set(`materials:list`, materialsList);

    console.log(`Material created successfully: ${materialId}`);

    return c.json({ 
      success: true, 
      materialId,
      message: "Material created successfully" 
    });
  } catch (error) {
    console.error("Error creating material:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

// Get all materials
app.get("/make-server-04d82a51/materials", async (c) => {
  try {
    const materialsData = await kv.getByPrefix("material:");
    // materialsData already contains the values, no need to map
    const materials = materialsData || [];
    
    console.log(`Fetched ${materials.length} materials`);
    
    return c.json({ success: true, materials });
  } catch (error) {
    console.error("Error fetching materials:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Get material by ID
app.get("/make-server-04d82a51/materials/:id", async (c) => {
  try {
    const materialId = c.req.param("id");
    const material = await kv.get(`material:${materialId}`);
    
    if (!material) {
      return c.json({ success: false, error: "Material not found" }, 404);
    }

    return c.json({ success: true, material });
  } catch (error) {
    console.error("Error fetching material:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Update material
app.put("/make-server-04d82a51/materials/:id", async (c) => {
  try {
    const materialId = c.req.param("id");
    const body = await c.req.json();
    
    const material = await kv.get(`material:${materialId}`);
    if (!material) {
      return c.json({ success: false, error: "Material not found" }, 404);
    }

    // Update material details
    const updatedMaterial = {
      ...material,
      itemCode: body.itemCode || material.itemCode,
      description: body.description || material.description,
      sectionImage: body.sectionImage || material.sectionImage,
      series: body.series || material.series,
      length: body.length || material.length,
      category: body.category || material.category,
      subcategory: body.subcategory || material.subcategory,
      typeOfWindow: body.typeOfWindow || material.typeOfWindow,
      packingQuantity: body.packingQuantity !== undefined ? body.packingQuantity : material.packingQuantity,
      minPurchaseQuantity: body.minPurchaseQuantity !== undefined ? body.minPurchaseQuantity : material.minPurchaseQuantity,
      unitPrice: body.unitPrice !== undefined ? body.unitPrice : material.unitPrice,
      retailPrice: body.retailPrice !== undefined ? body.retailPrice : material.retailPrice,
      packingPrice: body.packingPrice !== undefined ? body.packingPrice : material.packingPrice,
      stock: body.stock !== undefined ? body.stock : material.stock,
      supplier: body.supplier || material.supplier,
      leadTime: body.leadTime || material.leadTime,
      material: body.material || material.material,
      finish: body.finish || material.finish,
      weight: body.weight || material.weight,
      color: body.color || material.color,
      surfaceCertification: body.surfaceCertification || material.surfaceCertification,
      status: body.status || material.status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`material:${materialId}`, updatedMaterial);

    // Update in materials list
    const materialsList = await kv.get(`materials:list`) || [];
    const materialIndex = materialsList.findIndex((m: any) => m.id === materialId);
    
    if (materialIndex >= 0) {
      materialsList[materialIndex] = {
        ...materialsList[materialIndex],
        itemCode: updatedMaterial.itemCode,
        description: updatedMaterial.description,
        category: updatedMaterial.category,
        status: updatedMaterial.status,
      };
      await kv.set(`materials:list`, materialsList);
    }

    console.log(`Material updated successfully: ${materialId}`);

    return c.json({ 
      success: true, 
      message: "Material updated successfully",
      material: updatedMaterial
    });
  } catch (error) {
    console.error("Error updating material:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Delete material
app.delete("/make-server-04d82a51/materials/:id", async (c) => {
  try {
    const materialId = c.req.param("id");
    
    // Delete the material data
    await kv.del(`material:${materialId}`);
    
    // Remove from list
    const materialsList = await kv.get(`materials:list`) || [];
    const filteredMaterials = materialsList.filter((m: any) => m.id !== materialId);
    await kv.set(`materials:list`, filteredMaterials);

    console.log(`Material deleted successfully: ${materialId}`);

    return c.json({ success: true, message: "Material deleted successfully" });
  } catch (error) {
    console.error("Error deleting material:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

Deno.serve(app.fetch);