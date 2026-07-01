import { Navigate, useRoutes } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { useMemo } from 'react';
import { GET_MY_PERMISSIONS } from '../graphql/queries';
import { Box, CircularProgress } from '@mui/material';

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
import StaffInShop from './Pages/StaffInShop';
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
import HmrDashboard from './Pages/HmrDashboard';
import HmrReport from './Pages/HmrReport';

export default function Router() {
  const { isAuthenticated, user } = useAuth();

  const { data: permissionData, loading: permissionLoading } = useQuery(GET_MY_PERMISSIONS, {
    skip: !isAuthenticated || !user,
    fetchPolicy: "cache-and-network"
  });

  const userPermissions = useMemo(() => {
    return permissionData?.getMyPermissions?.permissions || [];
  }, [permissionData]);

  const Guard = ({ children, module, allow = true }) => {
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    // superAdmin and owner can access everything bypass checks
    if (user?.role === "superAdmin" || user?.role === "owner") {
      return children;
    }

    if (permissionLoading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      );
    }

    // If a module is specified, check if user has view permission for it
    if (module) {
      const allowed = userPermissions.some(p => p.module === module && p.actions?.view);
      if (!allowed) {
        return <Navigate to="/dashboard" replace />;
      }
      return children;
    }

    return allow ? children : <Navigate to="/store" replace />;
  };

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
        { path: 'social-cms', element: <Guard module="cms"><SocialCms/></Guard> },
        { path: 'cms/:module', element: <Guard module="cms"><CmsCrmMenu area="cms" /></Guard> },
        { path: 'crm/:module', element: <Guard module="crm"><CmsCrmMenu area="crm" /></Guard> },
        { path: 'setting', element: <Guard module="settings"><Navigate to="/setting/user" replace /></Guard> },
        { path: 'setting/social-accounts', element: <Guard module="settings"><SocialAccounts/></Guard> },
        { path: '/unit', element: <Guard module="inventory"><Unit/></Guard>},
        { path: '/supplier', element: <Guard module="inventory"><Supplier/></Guard>},
        { path: '/privacy', element: <Privacy/>},
        { path: '/terms', element: <Terms/>},
        { path: '/data-deletion', element: <DataDeletion/>},
        { path: 'setting/ai-permissions', element: <Guard module="settings"><AIPermissions/></Guard> },
        { path: 'setting/account-security', element: <Guard module="settings"><AccountSecurity/></Guard> },
        { path: 'setting/active-sessions', element: <Guard module="settings"><ActiveSessions/></Guard> },
        { path: 'setting/login-history', element: <Guard module="settings"><LoginHistory/></Guard> },
        { path: 'setting/data-ownership', element: <Guard module="settings"><DataOwnership/></Guard> },
        { path: 'setting/export-backup', element: <Guard module="settings"><ExportBackup/></Guard> },
        { path: 'setting/ai-activity-logs', element: <Guard module="settings"><AIActivityLogs/></Guard> },
        { path: 'setting/api-keys', element: <Guard module="settings"><APIKeys/></Guard> },
        { path: 'setting/security-alerts', element: <Guard module="settings"><SecurityAlerts/></Guard> },
        { path: 'setting/privacy-compliance', element: <Guard module="settings"><PrivacyCompliance/></Guard> },
        { path: 'setting/security-center', element: <Guard module="settings"><SecurityCenter/></Guard> },
        { path: 'setting/security-observability', element: <Guard module="settings"><SecurityObservability/></Guard> },
        { path: '/customer', element: <Guard module="customers"><Customer/></Guard>},
        { path: '/table', element: <Guard module="inventory"><TablePage/></Guard>},
        { path: '/setting/permission', element: <Guard module="settings"><Permission/></Guard>},
        { path: '/setting/hmr-dashboard', element: <Guard module="hr"><HmrDashboard/></Guard>},
        { path: '/setting/hmr-report', element: <Guard module="hr"><HmrReport/></Guard>},
        { path: '/setting/employee', element: <Guard module="hr"><Employee/></Guard>},
        { path: '/setting/department', element: <Guard module="hr"><Department/></Guard>},
        { path: '/setting/employee-salary', element: <Guard module="hr"><EmployeeSalary/></Guard>},
        { path: '/setting/employee-attendance', element: <Guard module="hr"><EmployeeAttendance/></Guard>},
        { path: '/setting/admin-attendance', element: <Guard module="hr"><AdminAttendance/></Guard>},
        { path: '/setting/attendance-qr', element: <Guard module="hr"><AttendanceQr/></Guard>},
        { path: '/store', element: <Store/>},
        { path: 'report', element: <Guard module="reports"><Report/></Guard> },
        { path: 'expense', element: <Guard module="finance"><Expense/></Guard> },
        { path: 'income', element: <Guard module="finance"><Income/></Guard> },
        { path: 'invoice', element: <Guard module="sale"><Invoice/></Guard> },
        { path: 'sale-return', element: <Guard module="sale"><SaleReturn/></Guard> },
        { path: '/store/pos/:id/report-in-shop', element: <Guard module="pos"><ReportInShop/></Guard> },
        { path: '/store/pos/:id/dashboard-in-shop', element: <Guard module="pos"><DashboardInShop/></Guard> },
        { path: '/store/pos/:id/warehouse-in-shop', element: <Guard module="pos"><WarehouseInShop/></Guard> },
        { path: '/store/pos/:id/mobile-app-controller', element: <Guard module="pos"><MobileApp/></Guard> },
        { path: '/store/pos/:id/staff', element: <Guard module="pos"><StaffInShop/></Guard> },
        { path: 'profile', element:<Profile/>},
        { path: "user/:userId/profile", element: <Profile /> },
        { path: '/setting/tenant', element: <Guard allow={user?.role === "superAdmin"}><Tenant/></Guard> },
        { path: '/user', element: <Guard module="settings"><User/></Guard> },
        { path: '/store-setting/:shopId', element: <StoreSetting/>},
        { path: '/category', element: <Guard module="categories"><Category/></Guard> },
        { path: '/product', element: <Guard module="products"><Product/></Guard>},
        { path: '/store/pos/:shopId', element: <Guard module="pos"><Pos/></Guard>},
        { path: 'warehouse', element: <Guard module="inventory"><Warehouse/></Guard>},
        { path: "*", element: <NotFound /> },
      ],
    },
    {
      path: '/app/ai',
      element: <AiAssistantWorkspace />
    }
  ]);
  
  return AttendanceCheckInPage || (isAuthenticated ? Content : LoginPage);

}
