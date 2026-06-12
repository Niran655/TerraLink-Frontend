import { gql } from "@apollo/client";

export const LOGIN = gql`
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
    user {
      _id
      email
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
      image
      active
      createdAt
      updatedAt
      nameKh
      nameEn
    }
  }
}
`

export const LOGIN_EMPLOYEE = gql`
mutation LoginEmployee($email: String!, $password: String!) {
  loginEmployee(email: $email, password: $password) {
    token
    employee {
      _id
      nameKh
      nameEn
      image
      email
      phone
      position
      tenantId {
        _id
        nameKh
        nameEn
      }
      active
    }
  }
}
`

export const REGISTER_TENANT_OWNER = gql`
mutation RegisterTenantOwner($input: RegisterInput) {
  register(input: $input) {
    email
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_TENANT = gql`
mutation UpdateTenant($id: ID, $input: TenantUpdateInput!) {
  updateTenant(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_TENANT_STATUS = gql`
mutation UpdateTenantStatus($id: ID!, $active: Boolean!) {
  updateTenantStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_USER = gql`
mutation CreateUser($input: RegisterInput) {
  createUser(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_USER = gql`
mutation UpdateUser($id: ID!, $input: RegisterInput) {
  updateUser(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_USER_STATUS = gql`
mutation UpdateUserStatus($id: ID!, $active: Boolean!) {
  updateUserStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_USER = gql`
mutation DeleteUser($id: ID!) {
  deleteUser(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const SAVE_ROLE_PERMISSIONS = gql`
mutation SaveRolePermissions($role: Role!, $permissions: [PermissionModuleInput!]!) {
  saveRolePermissions(role: $role, permissions: $permissions) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_CUSTOMER = gql`
mutation CreateCustomer($input: CustomerInput!) {
  createCustomer(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const UPDATE_CUSTOMER = gql`
mutation UpdateCustomer($id: ID!, $input: CustomerInput) {
  updateCustomer(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($_id: ID!) {
    deleteCustomer(_id: $_id) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const TOGGLE_CUSTOMER_STATUS = gql`
  mutation ToggleCustomerStatus($_id: ID!, $active: Boolean!) {
    toggleCustomerStatus(_id: $_id, active: $active) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;


export const CREATE_UNIT = gql`
mutation CreateUnit($input: UnitInput) {
  createUnit(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_UNIT = gql`
mutation UpdateUnit($id: ID!, $input: UnitInput) {
  updateUnit(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_UNIT = gql`
mutation DeleteUnit($id: ID!) {
  deleteUnit(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
` 

export const UPDATE_UNIT_STATUS = gql`
mutation UpdateUnitStatus($id: ID!, $active: Boolean!) {
  updateUnitStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_CATEGORY = gql`
mutation CreateCategory($input: CategoryInput) {
  createCategory(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_FACEBOOK_PAGE_CONNECTION = gql`
mutation CreateFacebookPageConnection($input: FacebookPageConnectionInput!) {
  createFacebookPageConnection(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const CREATE_FACEBOOK_OAUTH_URL = gql`
mutation CreateFacebookOAuthUrl($shopId: ID!) {
  createFacebookOAuthUrl(shopId: $shopId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      url
    }
  }
}
`;

export const UPDATE_FACEBOOK_PAGE_CONNECTION = gql`
mutation UpdateFacebookPageConnection($id: ID!, $input: FacebookPageConnectionUpdateInput!) {
  updateFacebookPageConnection(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const DELETE_FACEBOOK_PAGE_CONNECTION = gql`
mutation DeleteFacebookPageConnection($id: ID!) {
  deleteFacebookPageConnection(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const CREATE_CMS_POST = gql`
mutation CreateCmsPost($input: CmsPostInput!) {
  createCmsPost(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      postId
    }
  }
}
`;

export const UPDATE_CMS_POST = gql`
mutation UpdateCmsPost($id: ID!, $input: CmsPostUpdateInput!) {
  updateCmsPost(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const DELETE_CMS_POST = gql`
mutation DeleteCmsPost($id: ID!) {
  deleteCmsPost(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const PUBLISH_POST_TO_FACEBOOK = gql`
mutation PublishPostToFacebook($postId: ID!) {
  publishPostToFacebook(postId: $postId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      postId
      facebookPostId
    }
  }
}
`;

export const CREATE_BUSINESS_MODULE_RECORD = gql`
mutation CreateBusinessModuleRecord($input: BusinessModuleRecordInput!) {
  createBusinessModuleRecord(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      recordId
    }
  }
}
`;

export const UPDATE_BUSINESS_MODULE_RECORD = gql`
mutation UpdateBusinessModuleRecord($id: ID!, $input: BusinessModuleRecordUpdateInput!) {
  updateBusinessModuleRecord(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      recordId
    }
  }
}
`;

export const DELETE_BUSINESS_MODULE_RECORD = gql`
mutation DeleteBusinessModuleRecord($id: ID!) {
  deleteBusinessModuleRecord(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;
export const UPDATE_CATEGORY = gql`
mutation UpdateCategory($id: ID!, $input: CategoryInput) {
  updateCategory(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_CATEGORY = gql`
mutation DeleteCategory($id: ID!) {
  deleteCategory(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_CATEGORY_STATUS = gql`
mutation UpdateCategoryStatus($id: ID!, $active: Boolean!) {
  updateCategoryStatus(_id: $id, active: $active) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_SHOP = gql`
mutation CreateShop($input: ShopInput) {
  createShop(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_SHOP = gql`
mutation UpdateShop($id: ID!, $input: ShopInput) {
  updateShop(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const ADD_USER_CONTROLL_SHOP = gql`
mutation AddUserControllShop($id: ID!, $userId: [ID]!) {
  addUserControllShop(_id: $id, userId: $userId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_USER_FROM_SHOP = gql`
mutation DeleteUserFromShop($userId: [ID]!, $id: ID) {
  deleteUserFromShop(userId: $userId, _id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_SHOP = gql`
mutation DeleteShop($id: ID!) {
  deleteShop(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_PRODUCT = gql`
mutation CreateProduct($input: ProductInput) {
  createProduct(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_PRODUCT = gql`
mutation UpdateProduct($id: ID!, $input: ProductInput) {
  updateProduct(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_PRODUCT = gql`
mutation DeleteProduct($id: ID!) {
  deleteProduct(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_SUB_PRODUCT = gql`
mutation CreateSubProduct($parentProductId: ID!, $input: SubProductInput) {
  createSubProduct(parentProductId: $parentProductId, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const UPDATE_SUB_PRODUCT = gql`
mutation UpdateSubProduct($id: ID, $input: SubProductInput) {
  updateSubProduct(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const DELETE_SUP_PRODUCT = gql`
mutation DeleteSubProduct($id: ID!) {
  deleteSubProduct(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const CREATE_SALE = gql`
mutation CreateSale($input: SaleInput) {
  createSale(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      saleId
      saleNumber
      total
      status
      khqrString
      bakongReference
      qrImage
    }
  }
}
`;

export const ACCEPT_CUSTOMER_ORDER = gql`
mutation AcceptCustomerOrder($id: ID!) {
  acceptCustomerOrder(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      saleId
      saleNumber
      status
    }
  }
}
`;

export const REJECT_CUSTOMER_ORDER = gql`
mutation RejectCustomerOrder($id: ID!, $reason: String) {
  rejectCustomerOrder(_id: $id, reason: $reason) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const CREATE_BAKONG_PAYMENT = gql`
mutation CreateBakongPayment($input: CreateBakongPaymentInput!) {
  createBakongPayment(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      saleNumber
      total
      status
      khqrString
      bakongReference
      qrImage
    }
  }
}
`;

export const CHECK_BAKONG_PAYMENT = gql`
mutation CheckBakongPayment($reference: String!) {
  checkBakongPayment(reference: $reference) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const ADJUST_STOCK = gql`
mutation AdjustStock($input: AdjustStockInput!) {
  adjustStock(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`
export const CREATE_WAREHOUSE_TRANSFER = gql`
mutation CreateWarehouseTransfer($input: CreateWarehouseTransferInput!) {
  createWarehouseTransfer(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`


export const ACCEPT_WAREHOUSE_TRANSFER = gql`
mutation AcceptWarehouseTransfer($items: [AcceptTransferItemInput!]!, $transferId: ID!) {
  acceptWarehouseTransfer(items: $items, transferId: $transferId) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const REJECT_WAREHOUSE_TRANSFER = gql`
mutation RejectWarehouseTransfer($transferId: ID!, $reason: String) {
  rejectWarehouseTransfer(transferId: $transferId, reason: $reason) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_SALE_STATUS = gql`
  mutation UpdateSaleStatus($id: ID!, $status: SaleStatus!, $paymentInfo: PaymentInput) {
    updateSaleStatus(id: $id, status: $status, paymentInfo: $paymentInfo) {
      isSuccess
      message {
        messageEn
        messageKh
      }
    }
  }
`;

export const UPDATE_SALE = gql`
mutation UpdateSale($id: ID!, $input: SaleInput) {
  updateSale(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;

export const DELETE_SALE = gql`
mutation DeleteSale($id: ID!) {
  deleteSale(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`;


export const CREATE_SUPPLIER = gql`
mutation CreateSupplier($input: SupplierInput) {
  createSupplier(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const UPDATE_SUPPLIER = gql`
mutation UpdateSupplier($id: ID!, $input: SupplierInput) {
  updateSupplier(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_SUPPLIER = gql`
mutation DeleteSupplier($id: ID!) {
  deleteSupplier(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_DEPARTMENT = gql`
mutation CreateDepartment($input: DepartmentInput) {
  createDepartment(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_DEPARTMENT = gql`
mutation UpdateDepartment($id: ID!, $input: DepartmentInput) {
  updateDepartment(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_DEPARTMENT = gql`
mutation DeleteDepartment($id: ID!) {
  deleteDepartment(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_EMPLOYEE = gql`
mutation CreateEmployee($input: EmployeeInput) {
  createEmployee(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_EMPLOYEE = gql`
mutation UpdateEmployee($id: ID!, $input: EmployeeInput) {
  updateEmployee(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_EMPLOYEE = gql`
mutation DeleteEmployee($id: ID!) {
  deleteEmployee(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_EMPLOYEE_SALARY = gql`
mutation CreateEmployeeSalary($input: EmployeeSalaryInput) {
  createEmployeeSalary(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_EMPLOYEE_SALARY = gql`
mutation UpdateEmployeeSalary($id: ID!, $input: EmployeeSalaryInput) {
  updateEmployeeSalary(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_EMPLOYEE_SALARY = gql`
mutation DeleteEmployeeSalary($id: ID!) {
  deleteEmployeeSalary(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`


export const CREATE_PURCHASE_ORDER = gql`
mutation CreatePurchaseOrder($input: CreatePurchaseOrderInput) {
  createPurchaseOrder(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const  UPDATE_PURCHASE_ORDER = gql`
mutation UpdatePurchaseOrder($id: ID!, $input: UpdatePurchaseOrderInput!) {
  updatePurchaseOrder(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`


export const CANCEL_PURCHASE_ORDER = gql`
mutation CancelPurchaseOrder($id: ID!, $reason: String) {
  cancelPurchaseOrder(_id: $id, reason: $reason) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const RECEIVE_PURCHASE_ORDER = gql`
mutation ReceivePurchaseOrder($purchaseOrderId: ID, $items: [AcceptPurchaseOrderItemInput]) {
  receivePurchaseOrder(purchaseOrderId: $purchaseOrderId, items: $items) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const CREATE_SHIFT_SESSION = gql`
mutation CreateShiftSession($input: ShiftSessionInput) {
  createShiftSession(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_WAREHOUSE_REQUEST = gql`
mutation CreateWarehouseRequest($input: CreateWarehouseRequestInput) {
  createWarehouseRequest(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const APPROVE_WAREHOUSE_REQUEST = gql`
mutation ApproveWarehouseRequest($id: ID!, $items: [ApproveWarehouseRequestItemInput!]!) {
  approveWarehouseRequest(_id: $id, items: $items) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const REJECT_WAREHOUSE_REQUEST = gql`
mutation RejectWarehouseRequest($id: ID!, $reason: String) {
  rejectWarehouseRequest(_id: $id, reason: $reason) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}`

export const UPDATE_SHIFT_SEESION = gql`
mutation UpdateShiftSession($id: ID!, $input: ShiftSessionInput) {
  updateShiftSession(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_SHIFT_SESSION = gql`
mutation DeleteShiftSession($id: ID!) {
  deleteShiftSession(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_PRODUCT_FORM_WAREHOUSE = gql`
mutation DeleteFromWarehouse($id: ID) {
  deleteFromWarehouse(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const REFUND_SALE = gql`
mutation RefundSale($id: ID!, $reason: String) {
  refundSale(_id: $id, reason: $reason) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`


export const CREATE_TABLE = gql`
mutation CreateTable($input: TableInput) {
  createTable(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_TABLE = gql`
mutation UpdateTable($id: ID!, $input: TableInput) {
  updateTable(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_TABLE = gql`
mutation DeleteTable($id: ID!) {
  deleteTable(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_EXPENSE = gql`
mutation CreateExpense($input: ExpenseInput!) {
  createExpense(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_EXPENSE = gql`
mutation UpdateExpense($id: ID!, $input: ExpenseInput) {
  updateExpense(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_EXPENSE = gql`
mutation DeleteExpense($id: ID!) {
  deleteExpense(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const CREATE_INCOME = gql`
mutation CreateIncome($input: IncomeInput!) {
  createIncome(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const UPDATE_INCOME = gql`
mutation UpdateIncome($id: ID!, $input: IncomeInput) {
  updateIncome(_id: $id, input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

export const DELETE_INCOME = gql`
mutation DeleteIncome($id: ID!) {
  deleteIncome(_id: $id) {
    isSuccess
    message {
      messageEn
      messageKh
    }
  }
}
`

const attendanceMutationFields = `
  isSuccess
  message {
    messageEn
    messageKh
  }
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
  }
`;

export const CLOCK_IN_ATTENDANCE = gql`
mutation ClockInAttendance($employeeId: ID!) {
  clockInAttendance(employeeId: $employeeId) {
    ${attendanceMutationFields}
  }
}
`

export const START_ATTENDANCE_BREAK = gql`
mutation StartAttendanceBreak($employeeId: ID!) {
  startAttendanceBreak(employeeId: $employeeId) {
    ${attendanceMutationFields}
  }
}
`

export const END_ATTENDANCE_BREAK = gql`
mutation EndAttendanceBreak($employeeId: ID!) {
  endAttendanceBreak(employeeId: $employeeId) {
    ${attendanceMutationFields}
  }
}
`

export const CLOCK_OUT_ATTENDANCE = gql`
mutation ClockOutAttendance($employeeId: ID!) {
  clockOutAttendance(employeeId: $employeeId) {
    ${attendanceMutationFields}
  }
}
`

export const CREATE_LEAVE_REQUEST = gql`
mutation CreateLeaveRequest($input: LeaveRequestInput!) {
  createLeaveRequest(input: $input) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      _id
      date
      reason
      status
      adminRemark
      createdAt
    }
  }
}
`

export const UPDATE_LEAVE_REQUEST_STATUS = gql`
mutation UpdateLeaveRequestStatus($id: ID!, $status: LeaveRequestStatus!, $adminRemark: String) {
  updateLeaveRequestStatus(id: $id, status: $status, adminRemark: $adminRemark) {
    isSuccess
    message {
      messageEn
      messageKh
    }
    data {
      _id
      status
      adminRemark
      reviewedAt
    }
  }
}
`
