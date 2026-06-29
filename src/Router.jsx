import { Navigate, useRoutes } from 'react-router-dom';

import EmployeeAttendance from './Pages/EmployeeAttendance';
import AttendanceQrScan from './Pages/AttendanceQrScan';
import AdminAttendance from './Pages/AdminAttendance';
import DashboardInShop from './Pages/DashboardInShop';
import WarehouseInShop from './Pages/WarehouseInShop';
import AppLayout from './Components/AppLayout';
import EmployeeSalary from './Pages/EmployeeSalary';
import { useAuth } from './Context/AuthContext';
import AttendanceQr from './Pages/AttendanceQr';
import ReportInShop from './Pages/ReportInShop';
import StoreSetting from './Pages/StoreSetting';
import { canManageSettings, canManageTenant, canManageUsers } from './utils/tenantAccess';
import CmsCrmMenu from './Pages/CmsCrmMenu';
import Department from './Pages/Department';
import Permission from './Pages/Permission';
import SaleReturn from './Pages/SaleReturn';
import Dashboard from './Pages/Dashboard';
import MobileApp from './Pages/MobileApp';
import SocialCms from './Pages/SocialCms';
import Warehouse from './Pages/Warehouse';
import Category from './Pages/Category';
import Customer from './Pages/Customer';
import Employee from './Pages/Employee';
import NotFound from './Pages/NotFound';
import Settings from './Pages/Settings';
import SocialAccounts from './Pages/SocialAccounts';
import Supplier from './Pages/Supplier';
import ChatBot from './Pages/ChatBot';
import AiAssistantWorkspace from './Pages/AiAssistantWorkspace';
import Expense from './Pages/Expense';
import Invoice from './Pages/Invoice';
import Product from './Pages/Product';
import Profile from './Pages/Profile';
import Income from './Pages/Income';
import Report from './Pages/Report';
import Tenant from './Pages/Tenant';
import Login from './Pages/Login';
import Store from './Pages/Store';
import TablePage from './Pages/Table';
import Unit from './Pages/Unit';
import User from './Pages/User';
import Pos from './Pages/Pos';
import Privacy from './Pages/Privacy';
import Terms from './Pages/Terms';
import DataDeletion from './Pages/Data-deletion';
import SecurityCenter from './Pages/SecurityCenter';
import AIPermissions from './Pages/AIPermissions';
import AccountSecurity from './Pages/AccountSecurity';
import ActiveSessions from './Pages/ActiveSessions';
import LoginHistory from './Pages/LoginHistory';
import DataOwnership from './Pages/DataOwnership';
import ExportBackup from './Pages/ExportBackup';
import AIActivityLogs from './Pages/AIActivityLogs';
import APIKeys from './Pages/APIKeys';
import SecurityAlerts from './Pages/SecurityAlerts';
import PrivacyCompliance from './Pages/PrivacyCompliance';
import SecurityObservability from './Pages/SecurityObservability';
export default function Router() {
  const { isAuthenticated, user } = useAuth();

  const Guard = ({ children, allow = true }) =>
    allow ? children : <Navigate to="/store" replace />;

  const AttendanceCheckInPage = useRoutes([
    { path: '/setting/attendance-qr-scan', element: <AttendanceQrScan /> },
  ]);


  const LoginPage = useRoutes([
    { path: '/', element: <Login /> },
    { path: '/login', element: <Login /> },
    { path: '*', element: <Login /> },
  ]);

  const Content = useRoutes([
    {
      path: '/',
      element: <AppLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard" /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'chat', element: <ChatBot /> },
        { path: 'social-cms', element: <Guard allow={canManageTenant(user)}><SocialCms/></Guard> },
        { path: 'cms/:module', element: <Guard allow={canManageTenant(user)}><CmsCrmMenu area="cms" /></Guard> },
        { path: 'crm/:module', element: <Guard allow={canManageTenant(user)}><CmsCrmMenu area="crm" /></Guard> },
        { path: 'setting', element: <Guard allow={canManageTenant(user)}><Navigate to="/setting/user" replace /></Guard> },
        { path: 'setting/social-accounts', element: <Guard allow={canManageTenant(user)}><SocialAccounts/></Guard> },
        { path: '/unit', element: <Guard allow={canManageTenant(user)}><Unit/></Guard>},
        { path: '/supplier', element: <Guard allow={canManageTenant(user)}><Supplier/></Guard>},
        { path: '/privacy', element: <Privacy/>},
        { path: '/terms', element: <Terms/>},
        { path: '/data-deletion', element: <DataDeletion/>},
        { path: 'setting/ai-permissions', element: <Guard allow={canManageTenant(user)}><AIPermissions/></Guard> },
        { path: 'setting/account-security', element: <Guard allow={canManageTenant(user)}><AccountSecurity/></Guard> },
        { path: 'setting/active-sessions', element: <Guard allow={canManageTenant(user)}><ActiveSessions/></Guard> },
        { path: 'setting/login-history', element: <Guard allow={canManageTenant(user)}><LoginHistory/></Guard> },
        { path: 'setting/data-ownership', element: <Guard allow={canManageTenant(user)}><DataOwnership/></Guard> },
        { path: 'setting/export-backup', element: <Guard allow={canManageTenant(user)}><ExportBackup/></Guard> },
        { path: 'setting/ai-activity-logs', element: <Guard allow={canManageTenant(user)}><AIActivityLogs/></Guard> },
        { path: 'setting/api-keys', element: <Guard allow={canManageTenant(user)}><APIKeys/></Guard> },
        { path: 'setting/security-alerts', element: <Guard allow={canManageTenant(user)}><SecurityAlerts/></Guard> },
        { path: 'setting/privacy-compliance', element: <Guard allow={canManageTenant(user)}><PrivacyCompliance/></Guard> },
        { path: 'setting/security-center', element: <Guard allow={canManageTenant(user)}><SecurityCenter/></Guard> },
        { path: 'setting/security-observability', element: <Guard allow={canManageTenant(user)}><SecurityObservability/></Guard> },
        { path: '/customer', element: <Customer/>},
        { path: '/table', element: <TablePage/>},
        { path: '/setting/permission', element: <Guard allow={canManageSettings(user)}><Permission/></Guard>},
        { path: '/setting/employee', element: <Guard allow={canManageTenant(user)}><Employee/></Guard>},
        { path: '/setting/department', element: <Guard allow={canManageTenant(user)}><Department/></Guard>},
        { path: '/setting/employee-salary', element: <Guard allow={canManageTenant(user)}><EmployeeSalary/></Guard>},
        { path: '/setting/employee-attendance', element: <Guard allow={canManageTenant(user)}><EmployeeAttendance/></Guard>},
        { path: '/setting/admin-attendance', element: <Guard allow={canManageTenant(user)}><AdminAttendance/></Guard>},
        { path: '/setting/attendance-qr', element: <Guard allow={canManageTenant(user)}><AttendanceQr/></Guard>},
        { path: '/store', element: <Store/>},
        { path: 'report', element: <Report/> },
        { path: 'expense', element: <Expense/> },
        { path: 'income', element: <Income/> },
        { path: 'invoice', element: <Invoice/> },
        { path: 'sale-return', element: <SaleReturn/> },
        { path: '/store/pos/:id/report-in-shop', element: <ReportInShop/> },
        { path: '/store/pos/:id/dashboard-in-shop', element: <DashboardInShop/> },
        { path: 'profile', element:<Profile/>},
        { path: "user/:userId/profile", element: <Profile /> },
        { path: '/setting/tenant', element: <Guard allow={user?.role === "superAdmin"}><Tenant/></Guard> },
        { path: '/user', element: <Guard allow={canManageUsers(user)}><User/></Guard> },
        { path: '/store-setting/:shopId', element: <StoreSetting/>},
        { path: '/category', element: <Guard allow={canManageTenant(user)}><Category/></Guard> },
        { path: '/product', element: <Product/>},
        { path: '/store/pos/:shopId', element: <Pos/>},
        { path: 'warehouse', element: <Warehouse/>},
        { path: '/store/pos/:id/warehouse-in-shop', element: <WarehouseInShop/>},
        { path: '/store/pos/:id/mobile-app-controller', element: <MobileApp/>},
        { path: "*", element: <NotFound /> },
        // push ban
        // test push
      ],
    },
    {
      path: '/app/ai',
      element: <AiAssistantWorkspace />
    }
  ]);
  
  return AttendanceCheckInPage || (isAuthenticated ? Content : LoginPage);

}
