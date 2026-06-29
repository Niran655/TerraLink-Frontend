export const PLATFORM_ROLES = ["superAdmin", "platform_admin"];
export const TENANT_ADMIN_ROLES = ["owner", "admin", "manager"];
export const SHOP_STAFF_ROLES = ["cashier", "stock_controller", "stockController"];

export const getTenantId = (user) => user?.tenantId?._id || user?.tenantId || null;

export const getUserShopIds = (user) =>
  (user?.shopIds || [])
    .map((shop) => (typeof shop === "string" ? shop : shop?._id))
    .filter(Boolean);

export const isPlatformUser = (user) => PLATFORM_ROLES.includes(user?.role);

export const canManageTenant = (user) =>
  isPlatformUser(user) || TENANT_ADMIN_ROLES.includes(user?.role);

export const canManageUsers = (user) =>
  isPlatformUser(user) || ["owner", "admin", "manager"].includes(user?.role);

export const canManageSettings = (user) =>
  isPlatformUser(user) || ["owner", "admin"].includes(user?.role);

export const canManageShops = (user) =>
  isPlatformUser(user) || ["owner", "admin"].includes(user?.role);

export const canAccessShop = (user, shopId) => {
  if (!shopId) return false;
  if (isPlatformUser(user) || TENANT_ADMIN_ROLES.includes(user?.role)) return true;
  return getUserShopIds(user).includes(shopId);
};

export const filterTenantMenuSections = (sections, user, userPermissions = []) => {
  if (isPlatformUser(user)) return sections;

  // Platform admin and tenant owners see everything
  if (user?.role === "superAdmin" || user?.role === "owner") return sections;

  // If permissions are not loaded yet or are empty, default to basic dashboard/pos for safety
  const allowedModules = new Set();
  if (userPermissions && userPermissions.length > 0) {
    userPermissions.forEach((p) => {
      if (p.actions?.view) {
        allowedModules.add(p.module);
      }
    });
  } else {
    // Default fallback if permissions are not loaded yet or fail to load
    allowedModules.add("dashboard");
    allowedModules.add("pos");
  }

  const isItemAllowed = (item) => {
    const route = item.routeTo || item.path || "";

    if (route.startsWith("/store") || route === "/store") {
      return allowedModules.has("pos");
    }
    if (route === "/dashboard") {
      return allowedModules.has("dashboard");
    }
    if (route === "/report" || route.startsWith("/report")) {
      return allowedModules.has("reports");
    }
    if (route.startsWith("/cms") || route === "/social-cms") {
      return allowedModules.has("cms");
    }
    if (route.startsWith("/crm")) {
      return allowedModules.has("crm");
    }
    if (
      route.startsWith("/setting/employee") ||
      route.startsWith("/setting/department") ||
      route.startsWith("/setting/employee-salary") ||
      route.startsWith("/setting/employee-attendance") ||
      route.startsWith("/setting/admin-attendance") ||
      route.startsWith("/setting/attendance-qr")
    ) {
      return allowedModules.has("hr");
    }
    if (route === "/warehouse") {
      return allowedModules.has("inventory");
    }
    if (route === "/product") {
      return allowedModules.has("products");
    }
    if (route === "/category") {
      return allowedModules.has("categories");
    }
    if (route === "/unit" || route === "/table") {
      return allowedModules.has("inventory");
    }
    if (route === "/customer") {
      return allowedModules.has("customers");
    }
    if (route === "/user" || route === "/supplier") {
      return allowedModules.has("settings");
    }
    if (route.startsWith("/setting")) {
      return allowedModules.has("settings");
    }

    return true;
  };

  return sections
    .map((section) => {
      const key = section.sectionKey || section.key;
      if (key === "sales" && !allowedModules.has("sale")) return null;
      if (key === "finance" && !allowedModules.has("finance")) return null;
      if (
        key === "inventory" &&
        !allowedModules.has("inventory") &&
        !allowedModules.has("products") &&
        !allowedModules.has("categories")
      )
        return null;
      if (key === "hmr" && !allowedModules.has("hr")) return null;
      if (key === "cms" && !allowedModules.has("cms")) return null;
      if (key === "crm" && !allowedModules.has("crm")) return null;
      if (key === "settings" && !allowedModules.has("settings")) return null;

      const filteredChildren = (section.children || []).filter(isItemAllowed);
      const filteredItems = (section.items || []).filter(isItemAllowed);

      return {
        ...section,
        children: filteredChildren,
        items: filteredItems,
      };
    })
    .filter((section) => section !== null && (section.children || section.items || []).length > 0);
};
