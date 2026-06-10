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

export const filterTenantMenuSections = (sections, user) => {
  if (isPlatformUser(user) || canManageTenant(user)) return sections;

  const allowedForStaff = new Set([
    "/dashboard",
    "/store",
    "/setting/customer",
    "/setting/product",
  ]);

  return sections
    .map((section) => ({
      ...section,
      children: (section.children || []).filter((item) => allowedForStaff.has(item.routeTo)),
      items: (section.items || []).filter((item) => allowedForStaff.has(item.path)),
    }))
    .filter((section) => (section.children || section.items || []).length > 0);
};
