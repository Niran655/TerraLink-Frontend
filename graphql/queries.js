import { gql } from "@apollo/client";

export const AI_BUSINESS_CHAT = gql`
query AiBusinessChat($input: AIBusinessChatInput!) {
  aiBusinessChat(input: $input) {
    message
    answer
    model
    businessAIStatus
    businessAIRoute
    businessAIResult
    error
  }
}
`;

export const GET_FACEBOOK_PAGE_CONNECTIONS = gql`
query GetFacebookPageConnections($shopId: ID, $active: Boolean) {
  getFacebookPageConnections(shopId: $shopId, active: $active) {
    _id
    pageId
    pageName
    active
    createdAt
    updatedAt
    shopId {
      _id
      nameEn
      nameKh
    }
  }
}
`;

export const GET_CMS_POSTS = gql`
query GetCmsPosts($shopId: ID, $status: CmsPostStatus, $keyword: String, $limit: Int) {
  getCmsPosts(shopId: $shopId, status: $status, keyword: $keyword, limit: $limit) {
    _id
    title
    content
    images
    status
    publishAt
    facebookPageId
    facebookPostId
    publishedAt
    failedAt
    failureReason
    createdAt
    updatedAt
    shopId {
      _id
      nameEn
      nameKh
    }
    facebookPageConnection {
      _id
      pageId
      pageName
      active
    }
  }
}
`;

export const GET_BUSINESS_MODULE_RECORDS = gql`
query GetBusinessModuleRecords(
  $area: BusinessModuleArea
  $moduleKey: String
  $itemType: String
  $shopId: ID
  $status: String
  $keyword: String
  $active: Boolean
  $limit: Int
) {
  getBusinessModuleRecords(
    area: $area
    moduleKey: $moduleKey
    itemType: $itemType
    shopId: $shopId
    status: $status
    keyword: $keyword
    active: $active
    limit: $limit
  ) {
    _id
    area
    moduleKey
    itemType
    title
    description
    status
    channel
    url
    customerName
    contact
    notes
    tags
    dueDate
    active
    createdAt
    updatedAt
    shopId {
      _id
      nameEn
      nameKh
    }
  }
}
`;

export const GET_UNIT_WHITH_PAGINATION = gql`
query GetUnitWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean) {
  getUnitWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active) {
    data {
      nameKh
      nameEn
      remark
      active
      createdAt
      updatedAt
      _id
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_PROFIEL_BY_ID = gql`
query GetProfileById($id: ID) {
  getProfileById(_id: $id) {
    _id
    image
    nameEn
    nameKh
    email
    gender
    phone
    password
    active
    role
    tenantId {
      _id
      nameKh
      nameEn
    }
    shopIds {
      _id
      nameKh
      nameEn
    }
    createdAt
    updatedAt
  }
}
`
export const GET_UNIT = gql`
query GetUnit {
  getUnit {
    _id
    nameKh
    nameEn
    remark
    active
    createdAt
    updatedAt
  }
}
`

export const GET_USER_WITH_PAGINATION = gql`
query GetUsersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $role: String) {
  getUsersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, role: $role) {
    data {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      password
      active
      role
      tenantId {
        _id
        nameKh
        nameEn
      }
      shopIds {
        _id
        nameKh
        nameEn
      }
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_TENANTS = gql`
query GetTenants($active: Boolean) {
  getTenants(active: $active) {
    _id
    nameKh
    nameEn
    logo
    phone
    email
    address
    active
    createdAt
    updatedAt
  }
}
`

export const GET_ROLE_PERMISSIONS = gql`
query GetRolePermissions {
  getRolePermissions {
    role
    permissions {
      module
      actions {
        view
        add
        edit
        delete
        export
        approveVoid
      }
    }
  }
}
`
export const GET_CUSTOMERS_WITH_PAGINATION = gql`
query GetCustomersWithPagination($shopIds: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean) {
  getCustomersWithPagination(shopIds: $shopIds, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active) {
    data {
      _id
      nameKh
      nameEn
      phone
      email
      address
      gender
      dateOfBirth
      active
      shopIds{
        _id
        nameEn
        nameKh
      }
      totalSpent
      totalOrders
      lastOrderDate
      note
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`;

export const GET_CUSTOMER_BY_ID = gql`
  query GetCustomerById($_id: ID!) {
    getCustomerById(_id: $_id) {
      _id
      nameKh
      nameEn
      phone
      email
      address
      city
      gender
      dateOfBirth
      active
      shopId
      note
    }
  }
`;

export const GET_CUSTOMERS_BY_SHOP_ID = gql`
query GetCustomersByShop($shopId: ID!) {
  getCustomersByShop(shopId: $shopId) {
    _id
    nameKh
    nameEn
    phone
    email
    address
    gender
    dateOfBirth
    active
    totalSpent
    totalOrders
    lastOrderDate
    note
    createdAt
    updatedAt
  }
}`

export const GET_CATEGORY_WHITH_PAGINATION = gql`
query GetCategoryWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean) {
  getCategoryWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active) {
    data {
      _id
      nameKh
      nameEn
      remark
      active
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_CATEGORY = gql`
query GetCategory {
  getCategory {
    _id
    image
    nameKh
    nameEn
    remark
    active
    createdAt
    updatedAt
  }
}
`
export const GET_ALL_SHOP = gql`
query GetAllShops($id: ID) {
  getAllShops(_id: $id) {
    _id
    tenantId {
      _id
      nameKh
      nameEn
    }
    code
    image
    nameEn
    nameKh
    type
    remark
    address
    active
    createdAt
    updatedAt
    platform {
      id
      platform
      name
      url
    }
 
    user {
      nameEn
      nameKh
    }
  }
}
`
export const GET_SHOP_BY_SHOP_ID = gql`
query GetShopByShopId($shopId: ID!, $id: ID) {
  getShopByShopId(shopId: $shopId, _id: $id) {
    _id
    code
    image
    nameEn
    nameKh
    type
    remark
    address
    active
    createdAt
    updatedAt
    platform {
      id
      platform
      name
      url
    }
    user {
      _id
      role
      nameEn
      nameKh
    }
  }
}
`

export const GET_SHOP_BY_ID = gql`
query GetShopById($id: ID!) {
  getShopById(_id: $id) {
    _id
    tenantId {
      _id
      nameKh
      nameEn
    }
    user {
      _id
      role
      nameEn
      nameKh
    }
    code
    image
    nameEn
    nameKh
    type
    remark
    address
    
    active
    createdAt
    updatedAt
  }
}`

export const GET_TABLE_BY_SHOP_ID = gql`
query GetTableByShopId($shopId: ID!) {
  getTableByShopId(shopId: $shopId) {
    _id
    name
    number
    capacity
    active
    description
    qrCode
    createdAt
    updatedAt
  }
}`


export const GET_PRODUCT_WITH_PAGINATION = gql`
query GetProductsWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $categoryId: ID, $active: Boolean) {
  getProductsWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, categoryId: $categoryId, active: $active) {
    data {
      _id
      nameKh
      nameEn
      image
      shopIds
      unitId {
        nameKh
        nameEn
        _id
      }
      categoryId {
        nameEn
        nameKh
        _id
      }
      remark
      active
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_SUP_PRODUCT = gql`
query GetSubProducts($parentProductId: ID!) {
  getSubProducts(parentProductId: $parentProductId) {
    _id
    priceDes
    priceImg
    batchNo
    expiryDate
    productDes
    productImg
    qty
    salePrice
    saleType
    sell
    servicePrice
    taxRate
    totalPrice
    updatedAt
    using 
    stock
    minStock
    shopId {
      _id
      nameEn
      nameKh
    }
    unitId {
      _id
      nameEn
      nameKh
    }
    check
    barCode
    costPrice
    additionPrices {
      _id
      nameKhmer
      nameEnglish
      priceType
      price
      tax
      service
      total
      sizeName
      sugarLevel
      children {
        _id
        nameKhmer
        nameEnglish
        priceType
        price
        tax
        service
        total
        sizeName
        sugarLevel
        children {
          _id
          nameKhmer
          nameEnglish
          priceType
          price
          tax
          service
          total
          sizeName
          sugarLevel
        }
      }
    }
    createdAt
  }
}`

export const GET_PRODUCT_FOR_SALE_WITH_PAGINATION = gql`
query GetProductForSaleWithPagination($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $categoryId: String) {
  getProductForSaleWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, categoryId: $categoryId) {
    data {
      _id
      qty
      stock
      parentProductId {
        _id
        nameKh
        nameEn
        categoryId {
          nameEn
          nameKh
          image
          _id
        }
      }
      unitId {
        _id
        nameKh
        nameEn
      }
      productImg
      taxRate
      salePrice
      additionPrices {
        _id
        nameKhmer
        nameEnglish
        priceType
        price
        tax
        service
        total
        children {
          _id
          nameKhmer
          nameEnglish
          priceType
          price
          tax
          service
          total
          sizeName
          sugarLevel
        }
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_CUSTOMER_ORDERS = gql`
query GetCustomerOrders($shopId: ID, $status: CustomerOrderStatus, $limit: Int) {
  getCustomerOrders(shopId: $shopId, status: $status, limit: $limit) {
    _id
    orderNumber
    customerName
    customerPhone
    tableNumber
    address
    city
    orderType
    subtotal
    deliveryFee
    tax
    total
    paymentMethod
    specialInstructions
    status
    createdAt
    orderOptions {
      includeUtensils
      contactlessDelivery
      callOnArrival
    }
    items {
      product {
        _id
      }
      subProductId
      name
      price
      quantity
      total
      options {
        name
        price
      }
    }
  }
}`

export const GET_SUPPRODUCT_BY_ID = gql`
query GetSubProductById($subProductId: ID!) {
  getSubProductById(subProductId: $subProductId) {
     _id
      qty
      stock
      parentProductId {
        _id
        nameKh
        nameEn
        
        categoryId {
          nameEn
          nameKh
          image
          _id
        }
      }
      unitId {
        _id
        nameKh
        nameEn
      }
      productImg
      
      taxRate
      salePrice
    barCode
  }
}
`

export const GET_PRDUCT_WAREHOUSE_WITH_PAGINATION = gql`
query GetProductWareHouseWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getProductWareHouseWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
   data {
    _id
      stock
      subProduct {
        _id
        qty
        costPrice
        unitId {
          nameEn
          nameKh
        }
        parentProductId {
          _id
          nameKh
          nameEn
        }
        productImg
        minStock
        _id
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }  
  }
}
`

export const GET_PRODUCT_WAREHOUSE_IN_SHOP_WITH_PAGINATION = gql`
query GetProductWareHouseInShopoWithPagination($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getProductWareHouseInShopoWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      minStock
      createdAt
      updatedAt
      stock
      subProduct {
        _id
      priceDes
      priceImg
      productDes
      productImg
      parentProductId {
          nameKh
          nameEn
        }
      qty
      salePrice
      saleType
      sell
      servicePrice
      taxRate
      totalPrice
      updatedAt
      using 
      stock
      minStock
      unitId {
        _id
        nameEn
        nameKh
      }
    check
    barCode
    costPrice
    createdAt
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_PRODUCTS_WAREHOUSE_TRANSFER_WITH_PAGINATION = gql`
query GetWarehouseTransfersWithPagination($status: TransferStatus, $shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getWarehouseTransfersWithPagination(status: $status, shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
       _id
    toShop {
      nameKh
      nameEn
    }
    items {
      quantity
      subProduct {
        _id
      }
      remainingQty
      receivedQty
    }
    status
    requestedBy {
      nameEn
      nameKh
    }
    acceptedBy {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      active
      role
      createdAt
      updatedAt
    }
    receivedHistory {
      _id
      receivedAt
      receivedBy {
        _id
        nameEn
        nameKh
      }
      items {
        receivedQty
      }
    }
    remark
    createdAt
    acceptedAt
  }
    
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`
export const GET_WAREHOUSE_TRANSFER_BY_ID = gql`
query GetWarehouseTransferById($id: ID!) {
  getWarehouseTransferById(_id: $id) {
     _id
    toShop {
      nameKh
      nameEn
    }
    items {
      quantity
      remainingQty
      receivedQty
      subProduct {
        _id
        saleType
        qty
        barCode
        productDes
        productImg
        using
        check
        sell
        servicePrice
        salePrice
        taxRate
        costPrice
        priceImg
        totalPrice
        priceDes
        createdAt
        updatedAt
        stock
        minStock
        parentProductId {
          nameEn
          nameKh
          _id
        }
        unitId {
          _id
          nameEn
          nameKh
        }
      }
    }
    status
    requestedBy {
      nameEn
      nameKh
    }
    acceptedBy {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      active
      role
      createdAt
      updatedAt
    }
    receivedHistory {
      _id
      receivedAt
      receivedBy {
        _id
        nameEn
        nameKh
      }
      items {
        receivedQty
        subProduct {
          _id
          productImg
          parentProductId {
            nameEn
            nameKh
          }
          unitId {
            nameEn
            nameKh
          }
        }
      }
    }
    remark
    createdAt
    acceptedAt
  }
}
`

export const GET_WAREHOUSE_REQUESTS_WITH_PAGINATION = gql`
query GetWarehouseRequestsWithPagination($status: WarehouseRequestStatus, $shopId: ID, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getWarehouseRequestsWithPagination(status: $status, shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      _id
      toShop {
        _id
        nameEn
        nameKh
      }
      items {
        requestedQty
        approvedQty
        receivedQty
        subProduct {
          _id
          productImg
          costPrice
          parentProductId {
            nameEn
            nameKh
          }
          unitId {
            nameEn
            nameKh
          }
        }
      }
      status
      remark
      dateWantGetProduct
      requestedBy {
        nameEn
        nameKh
      }
      approvedBy {
        nameEn
        nameKh
      }
      transfer {
        _id
        status
      }
      createdAt
      approvedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`

export const GET_SALES = gql`
  query GetSales(
    $shopId: ID
    $status: SaleStatus
    $page: Int
    $limit: Int
    $pagination: Boolean
    $startDate: Date
    $endDate: Date
    $keyword: String
  ) {
    getSales(
      shopId: $shopId
      status: $status
      page: $page
      limit: $limit
      pagination: $pagination
      startDate: $startDate
      endDate: $endDate
      keyword: $keyword
    ) {
      data {
        _id
        saleNumber
        user {
          _id
          nameEn
          nameKh
        }
        customerName
        customerPhone
        tableNumber
        orderType
        shopId
        items {
          product {
            _id
            nameEn
            nameKh
            image
          }
          subProductId
          subProduct {
            _id
            productImg
            productDes
            unitId {
              _id
              nameEn
              nameKh
            }
            parentProductId {
              _id
              nameEn
              nameKh
            }
          }
          name
          price
          quantity
          total
        }
        subtotal
        tax
        discount
        total
        paymentMethod
        amountPaid
        change
        status
        createdAt
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;

export const DASHBOARD_STATS = gql`
query DashboardStats($filter: String, $shopId: ID, $dayStart: Date, $dayEnd: Date) {
  dashboardStats(filter: $filter, shopId: $shopId, dayStart: $dayStart, dayEnd: $dayEnd) {
    totalOrders
    totalSales
    averageValue
    reservations
    weeklyRevenue
    topSellingItems {
      rank
      orders
      name
    }
    activeOrders {
      name
      type
      table
    }
    categoryStats {
      orders
      category
    }
        dailyRevenue
  }
}`

// ===========================START REPROT HERE==========================

export const GET_REPORT_STATS = gql`
query GetReportStats($type: ReportType, $shopId: ID, $endDate: Date, $startDate: Date) {
  getReportStats(type: $type, shopId: $shopId, endDate: $endDate, startDate: $startDate) {
    staff {
      totalStaff
      activeStaff
      totalHours
      totalSales
      salesPerStaff
      performance {
        id
        nameKh
        nameEn
        role
        hours
        sales
        orders
      }
    }
    sales {
      totalRevenue
      totalOrders
      averageOrderValue
      topProducts {
        id
        name
        category
        sales
        revenue
      }
      recentTransactions {
        id
        date
        customer
        type
        amount
        status
      }
    }
    inventory {
      totalItems
      lowStockCount
      totalValue
      items {
        id
        name
        category
        stock
        unit
        reorderLevel
        value
      }
    }
  }
}`


export const GET_SALE_REPORT = gql`
  query GetSaleReport(
    $shopId: ID
    $startDate: Date
    $endDate: Date
    $page: Int
    $limit: Int
    $pagination: Boolean
  ) {
    getSaleReport(
      shopId: $shopId
      startDate: $startDate
      endDate: $endDate
      page: $page
      limit: $limit
      pagination: $pagination
    ) {
      totalSalesCount
      totalRevenue
      totalDiscount
      totalTax
      averageOrderValue

      bestSellers {
        productId
        productName
        totalQuantity
        totalRevenue
        rank
      }
      bestSellersPaginator {
        totalDocs
        totalPages
        currentPage
        hasNextPage
        hasPrevPage
      }

      salesByPaymentMethod {
        method
        count
        amount
      }
      paymentMethodPaginator {
        totalDocs
        totalPages
        currentPage
        hasNextPage
        hasPrevPage
      }

      salesByOrderType {
        type
        count
        amount
      }
      orderTypePaginator {
        totalDocs
        totalPages
        currentPage
        hasNextPage
        hasPrevPage
      }

      dailySales {
        date
        orders
        revenue
      }
      dailySalesPaginator {
        totalDocs
        totalPages
        currentPage
        hasNextPage
        hasPrevPage
      }

      recentTransactions {
        id
        date
        customer
        type
        amount
        status
      }
      recentTransactionsPaginator {
        totalDocs
        totalPages
        currentPage
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_PURCHASE_REPORT = gql`
  query GetPurchaseReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getPurchaseReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      totalPurchaseOrders
      totalItemsPurchased
      totalCost
      averageOrderCost
      purchasesBySupplier {
        supplierId
        supplierName
        orderCount
        totalCost
      }
      recentPurchases {
        id
        orderNumber
        supplierName
        totalAmount
        status
        createdAt
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_INVENTORY_REPORT = gql`
  query GetInventoryReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getInventoryReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      currentStockValue
      totalItemsInStock
      lowStockItems
      outOfStockItems
      stockHistory {
        productId
        productName
        date
        movementType
        quantity
        previousStock
        newStock
        reference
      }
      stockHistoryPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
      soldStockSummary {
        productId
        productName
        totalSoldQty
        totalRevenue
        totalCost
        grossProfit
      }
      soldStockPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
      inventoryValuation {
        productId
        productName
        stockQty
        unitCost
        totalValue
      }
      valuationPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_INVOICE_REPORT = gql`
  query GetInvoiceReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getInvoiceReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      totalInvoices
      totalAmount
      paidAmount
      unpaidAmount
      invoices {
        id
        invoiceNumber
        customerName
        date
        total
        paid
        due
        status
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_SUPPLIER_REPORT = gql`
  query GetSupplierReport($shopId: ID) {
    getSupplierReport(shopId: $shopId) {
      totalSuppliers
      activeSuppliers
      totalPurchasedAmount
      supplierPerformance {
        supplierId
        supplierName
        totalOrders
        totalPurchased
        lastOrderDate
      }
    }
  }
`;

export const GET_SUPPLIER_DUE_REPORT = gql`
  query GetSupplierDueReport($shopId: ID) {
    getSupplierDueReport(shopId: $shopId) {
      totalDueToSuppliers
      suppliersWithDue {
        supplierId
        supplierName
        dueAmount
        currency
        overdueDays
      }
    }
  }
`;

export const GET_CUSTOMER_REPORT = gql`
  query GetCustomerReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getCustomerReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      totalCustomers
      totalSalesToCustomers
      averageSpendPerCustomer
      topCustomers {
        customerName
        customerPhone
        totalOrders
        totalSpent
      }
     
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_CUSTOMER_DUE_REPORT = gql`
  query GetCustomerDueReport($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean) {
    getCustomerDueReport(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination) {
      totalDueFromCustomers
      customersWithDue {
        customerName
        customerPhone
        dueAmount
        oldestDueDate
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_PRODUCT_REPORT = gql`
  query GetProductReport($shopId: ID, $categoryId: ID, $page: Int, $limit: Int, $pagination: Boolean) {
    getProductReport(shopId: $shopId, categoryId: $categoryId, page: $page, limit: $limit, pagination: $pagination) {
      totalProducts
      activeProducts
      productsByCategory {
        categoryId
        categoryName
        productCount
      }
      productList {
        productId
        productName
        category
        stock
        unit
        costPrice
        salePrice
        status
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_PRODUCT_EXPIRY_REPORT = gql`
  query GetProductExpiryReport($shopId: ID, $daysThreshold: Int, $page: Int, $limit: Int, $pagination: Boolean) {
    getProductExpiryReport(shopId: $shopId, daysThreshold: $daysThreshold, page: $page, limit: $limit, pagination: $pagination) {
      expiredProducts {
        productId
        productName
        batchNo
        expiryDate
        stock
        daysUntilExpiry
      }
      expiredPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
      expiringSoon {
        productId
        productName
        batchNo
        expiryDate
        stock
        daysUntilExpiry
      }
      expiringPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_PRODUCT_QUANTITY_ALERT = gql`
  query GetProductQuantityAlert($shopId: ID, $page: Int, $limit: Int, $pagination: Boolean) {
    getProductQuantityAlert(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination) {
      lowStockProducts {
        productId
        productName
        currentStock
        minStockLevel
      }
      lowStockPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
      outOfStockProducts {
        productId
        productName
        currentStock
        minStockLevel
      }
      outOfStockPaginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_EXPENSE_REPORT = gql`
  query GetExpenseReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getExpenseReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      totalExpenses
      expenseByCategory {
        category
        amount
      }
      monthlyExpenses {
        month
        amount
      }
      expensesList {
        _id
        category
        amount
        description
        date
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_INCOME_REPORT = gql`
  query GetIncomeReport($shopId: ID, $startDate: Date, $endDate: Date, $page: Int, $limit: Int, $pagination: Boolean) {
    getIncomeReport(shopId: $shopId, startDate: $startDate, endDate: $endDate, page: $page, limit: $limit, pagination: $pagination) {
      totalIncome
      incomeBySource {
        source
        amount
      }
      monthlyIncome {
        month
        amount
      }
      incomesList {
        _id
        source
        amount
        description
        date
      }
      paginator {
        currentPage
        totalPages
        totalDocs
        hasNextPage
        hasPrevPage
      }
    }
  }
`;

export const GET_EXPENSES_WITH_PAGINATION = gql`
  query GetExpensesWithPagination(
    $shopId: ID
    $category: String
    $startDate: Date
    $endDate: Date
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
  ) {
    getExpensesWithPagination(
      shopId: $shopId
      category: $category
      startDate: $startDate
      endDate: $endDate
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
    ) {
      data {
        _id
        category
        amount
        description
        date
        shopId {
          _id
          nameEn
          nameKh
        }
        createdBy {
          _id
          nameEn
          nameKh
        }
        createdAt
        updatedAt
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;

export const GET_INCOMES_WITH_PAGINATION = gql`
  query GetIncomesWithPagination(
    $shopId: ID
    $type: String
    $startDate: Date
    $endDate: Date
    $page: Int
    $limit: Int
    $pagination: Boolean
    $keyword: String
  ) {
    getIncomesWithPagination(
      shopId: $shopId
      type: $type
      startDate: $startDate
      endDate: $endDate
      page: $page
      limit: $limit
      pagination: $pagination
      keyword: $keyword
    ) {
      data {
        _id
        type
        source
        amount
        description
        date
        shopId {
          _id
          nameEn
          nameKh
        }
        createdBy {
          _id
          nameEn
          nameKh
        }
        createdAt
        updatedAt
      }
      paginator {
        slNo
        prev
        next
        perPage
        totalPosts
        totalPages
        currentPage
        hasPrevPage
        hasNextPage
        totalDocs
      }
    }
  }
`;

export const GET_TAX_REPORT = gql`
  query GetTaxReport($shopId: ID, $startDate: Date, $endDate: Date) {
    getTaxReport(shopId: $shopId, startDate: $startDate, endDate: $endDate) {
      totalTaxCollected
      taxBreakdown {
        taxRate
        taxableSales
        taxAmount
      }
      taxByPeriod {
        period
        taxAmount
      }
    }
  }
`;

export const GET_PROFIT_LOSS_REPORT = gql`
  query GetProfitLossReport($shopId: ID, $startDate: Date, $endDate: Date) {
    getProfitLossReport(shopId: $shopId, startDate: $startDate, endDate: $endDate) {
      startDate
      endDate
      totalRevenue
      totalCostOfGoodsSold
      grossProfit
      operatingExpenses
      netProfit
      profitMargin
      breakdown {
        salesRevenue
        otherIncome
        costOfGoodsSold
        salaries
        rent
        utilities
        marketing
        otherExpenses
        taxExpense
      }
    }
  }
`;

export const GET_ANNUAL_REPORT = gql`
  query GetAnnualReport($shopId: ID, $year: Int) {
    getAnnualReport(shopId: $shopId, year: $year) {
      year
      totalRevenue
      totalExpenses
      netProfit
      totalSalesOrders
      averageMonthlyRevenue
      monthlyData {
        month
        revenue
        orders
      }
      topMonth {
        month
        revenue
        orders
      }
      bottomMonth {
        month
        revenue
        orders
      }
      salesByQuarter {
        quarter
        revenue
        orders
      }
    }
  }
`;
// ===============================END REPORT QUERY=========================
export const GET_SUPPLIERS_WITH_PAGINATION = gql`
query GetSuppliersWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean) {
  getSuppliersWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active) {
    data {
      _id
      nameKh
      nameEn
      remark
      active
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_DEPARTMENTS_WITH_PAGINATION = gql`
query GetDepartmentsWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean) {
  getDepartmentsWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active) {
    data {
      _id
      nameKh
      nameEn
      code
      remark
      active
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_EMPLOYEES_WITH_PAGINATION = gql`
query GetEmployeesWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean, $departmentId: ID) {
  getEmployeesWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active, departmentId: $departmentId) {
    data {
      _id
      nameKh
      nameEn
      image
      gender
      phone
      email
      position
      hireDate
      address
      remark
      active
      department {
        _id
        nameKh
        nameEn
      }
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_EMPLOYEE_SALARIES_WITH_PAGINATION = gql`
query GetEmployeeSalariesWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean, $employeeId: ID) {
  getEmployeeSalariesWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active, employeeId: $employeeId) {
    data {
      _id
      baseSalary
      allowance
      deduction
      currency
      effectiveDate
      remark
      active
      employee {
        _id
        image
        nameKh
        nameEn
        phone
        department {
          _id
          nameKh
          nameEn
        }
      }
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_ATTENDANCES_WITH_PAGINATION = gql`
query GetAttendancesWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $employeeId: ID, $status: AttendanceStatus, $startDate: Date, $endDate: Date) {
  getAttendancesWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, employeeId: $employeeId, status: $status, startDate: $startDate, endDate: $endDate) {
    data {
      _id
      date
      status
      clockIn
      clockOut
      breakStart
      breakMinutes
      productionMinutes
      overtimeMinutes
      totalMinutes
      employee {
        _id
        image
        nameKh
        nameEn
        position
        department {
          _id
          nameKh
          nameEn
        }
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_TODAY_ATTENDANCE = gql`
query GetTodayAttendance($employeeId: ID!) {
  getTodayAttendance(employeeId: $employeeId) {
    _id
    date
    status
    clockIn
    clockOut
    breakStart
    breakMinutes
    productionMinutes
    overtimeMinutes
    totalMinutes
  }
}`

export const GET_ATTENDANCE_OVERVIEW = gql`
query GetAttendanceOverview($employeeId: ID, $month: Int, $year: Int) {
  getAttendanceOverview(employeeId: $employeeId, month: $month, year: $year) {
    totalWorkingDays
    absentDays
    presentDays
    halfDays
    lateDays
    holidayDays
  }
}`

export const GET_LEAVE_REQUESTS_WITH_PAGINATION = gql`
query GetLeaveRequestsWithPagination($page: Int, $limit: Int, $pagination: Boolean, $employeeId: ID, $status: LeaveRequestStatus) {
  getLeaveRequestsWithPagination(page: $page, limit: $limit, pagination: $pagination, employeeId: $employeeId, status: $status) {
    data {
      _id
      date
      reason
      status
      adminRemark
      reviewedAt
      createdAt
      employee {
        _id
        nameKh
        nameEn
        position
      }
    }
    paginator {
      totalDocs
      totalPages
      currentPage
    }
  }
}`

export const GET_PURCHASE_ORDER_WITH_PAGINATION = gql`
query GetPurchaseOrdersWithPagination($supplierId: ID, $shopId: ID, $status: PurchaseOrderStatus, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String) {
  getPurchaseOrdersWithPagination(supplierId: $supplierId, shopId: $shopId, status: $status, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword) {
    data {
      _id
      supplier {
        _id
        nameKh
        nameEn
        remark
        createdAt
        updatedAt
      }
      shop {
        _id
        nameKh
        nameEn
      }
      items {
         
        subProduct {
            _id
          parentProductId {
            nameKh
            nameEn
          }
        }
        quantity
        costPrice
        totalPrice
        receivedQty
        remainingQty
      }
      totalAmount
      status
      remark
      createdBy {
        nameKh
        nameEn
      }
      receivedBy {
        nameKh
        nameEn
      }
      createdAt
      receivedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`



export const GET_SHIFT_SESSIONS = gql`
query GetShiftSessions($shopId: ID, $startDate: Date, $endDate: Date) {
  getShiftSessions(shopId: $shopId, startDate: $startDate, endDate: $endDate) {
    _id
    user {
      _id
      email
      nameEn
      nameKh
    }
    shop {
      nameEn
      nameKh
      _id
    }
    shiftName
    startTime
    endTime
    openingCash
    closingCash
    totalSales
    totalOrders
    status
    createdAt
    closedAt
  }
}
`
export const GET_CURRENT_SHIFT = gql`
query GetCurrentShift($userId: ID) {
  getCurrentShift(userId: $userId) {
    _id
    user {
      _id
      image
      nameEn
      nameKh
      email
      gender
      phone
      password
      active
      role
      createdAt
      updatedAt
    }
    
    shiftName
    startTime
    endTime
    openingCash
    closingCash
    totalSales
    totalOrders
    status
    createdAt
    closedAt
  }
}
`

export const GET_OPEN_SHIFT = gql`
query GetOpenShift($shopId: ID!, $userId: ID) {
  getOpenShift(shopId: $shopId, userId: $userId) {
    status
    startTime
    openingCash
    user {
      _id
      nameEn
      nameKh
    }
  }
}
`

export const GET_STOCK_MOVMENT_WITH_PAGINATION = gql`
query GetStockMovementWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $shopId: ID, $type: StockMovementType) {
  getStockMovementWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, shopId: $shopId, type: $type) {
    data {
      type
      quantity
      reason
      reference
      previousStock
      newStock
      createdAt
      user {
        nameKh
        nameEn
      }
      product {
        nameKh
        nameEn
      }
      subProduct {
        parentProductId {
          nameKh
          nameEn
        }
        unitId {
          nameKh
          nameEn
        }
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`


export const GET_TABLE_WITH_PAGINATION = gql`
query GetTablesWithPagination($page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $active: Boolean, $shopId: [ID]) {
  getTablesWithPagination(page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, active: $active, shopId: $shopId) {
    data {
      _id
      name
      number
      capacity
      active
      description
      qrCode
      createdAt
      updatedAt
      shopIds {
        _id
        nameKh
        nameEn
      }
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`



// ── 1. Main dashboard — overview cards, static lists ─────────────────────────
export const GET_FULL_DASHBOARD = gql`
  query GetFullDashboard(
    $shopId: ID
    $period: String
    $startDate: Date
    $endDate: Date
  ) {
    getFullDashboard(
      shopId: $shopId
      period: $period
      startDate: $startDate
      endDate: $endDate
    ) {
      overview {
        totalSales          { value percentageChange trend }
        totalSalesReturn    { value percentageChange trend }
        totalPurchase       { value percentageChange trend }
        totalPurchaseReturn { value percentageChange trend }
        profit              { value percentageChange trend }
        invoiceDue          { value percentageChange trend }
        totalExpenses       { value percentageChange trend }
        totalPaymentReturns { value percentageChange trend }
      }
      salesPurchaseChart { labels sales purchases }
      overallInfo        { suppliers customers orders }
      customerOverview   { firstTime return firstTimePercent returnPercent }
      topSellingProducts { productId productName sales revenue image }
      lowStockProducts   { productId productName subProductId stock minStock image }
      productExpiryAlerts { productId productName batchNo expiryDate stock daysUntilExpiry }
      recentSales        { saleId productName category amount date }
      recentTransactions { date customer quantity price status total }
      topCustomers       { customerId name country orders totalSpent }
      topCategories      { categoryId name salesAmount }
      orderStatistics    { labels values }
      categoryStatistics { totalCategories totalProducts }
    }
  }
`;

// ── 2. Independent chart data (Sales & Purchase + Sales Stats charts) ─────────
//    period: "1D" | "1W" | "1M" | "3M" | "6M" | "All"
export const GET_CHART_DATA = gql`
  query GetChartData($shopId: ID, $period: String) {
    getChartData(shopId: $shopId, period: $period) {
      labels
      sales
      purchases
    }
  }
`;

// ── 3. Typed recent transactions ──────────────────────────────────────────────
//    txType: "sale" | "purchase" | "quotation" | "expense" | "invoice"
//    period: "1D" | "1W" | "1M" | "3M" | "6M" | "All"
export const GET_RECENT_TRANSACTIONS_BY_TYPE = gql`
  query GetRecentTransactionsByType(
    $shopId: ID
    $txType: String
    $period: String
    $page: Int
    $limit: Int
  ) {
    getRecentTransactionsByType(
      shopId: $shopId
      txType: $txType
      period: $period
      page: $page
      limit: $limit
    ) {
      items {
        id
        date
        customer
        quantity
        price
        status
        total
        type
      }
      total
    }
  }
`;

 
export const GET_ORDER_CATEGORY_STATS = gql`
  query GetOrderCategoryStats($shopId: ID, $period: String) {
    getOrderCategoryStats(shopId: $shopId, period: $period) {
      orderLabels
      orderValues
      topCategories      { categoryId name salesAmount }
      categoryStatistics { totalCategories totalProducts }
    }
  }
`;




// ===============================MOBILE APP CONTROLL QUERIES=======================  
export const GET_CUISINES_TYPES_WITH_PAGINATION = gql`
query GetCuisineTypesWithPagination($shopId: ID!, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getCuisineTypesWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      _id
      nameKh
      nameEn
      status
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_CUISINES_ORIGINS_WITH_PAGINATION = gql`
query GetCuisineOriginsWithPagination($shopId: ID!, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getCuisineOriginsWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      _id
      nameKh
      nameEn
      status
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_MEAL_TYPES_PAGINATION = gql` 
query GetMealTypesWithPagination($shopId: ID!, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getMealTypesWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      _id
      name
      status
      shopId
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`

export const GET_SHOP_PROMOTION_WITH_PAGINATION = gql`
query GetShopPromotionsWithPagination($shopId: ID!, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getShopPromotionsWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      _id
     
      type
      title
      description
      discount
      image
      startDate
      endDate
      status
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}`


export const GET_SHOP_EVENT_WITH_PAGINATION = gql`
query GetShopEventsWithPagination($shopId: ID!, $page: Int, $limit: Int, $pagination: Boolean, $keyword: String, $status: String) {
  getShopEventsWithPagination(shopId: $shopId, page: $page, limit: $limit, pagination: $pagination, keyword: $keyword, status: $status) {
    data {
      _id
      title
      description
      date
      status
      createdAt
      updatedAt
    }
    paginator {
      slNo
      prev
      next
      perPage
      totalPosts
      totalPages
      currentPage
      hasPrevPage
      hasNextPage
      totalDocs
    }
  }
}
`