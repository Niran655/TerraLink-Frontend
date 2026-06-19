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
import Supplier from './Pages/Supplier';
import ChatBot from './Pages/ChatBot';
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
        { path: 'setting', element: <Guard allow={canManageTenant(user)}><Settings/></Guard> },
        { path: '/setting/unit', element: <Guard allow={canManageTenant(user)}><Unit/></Guard>},
        { path: '/setting/supplier', element: <Guard allow={canManageTenant(user)}><Supplier/></Guard>},
      
        { path: '/setting/customer', element: <Customer/>},
        { path: '/setting/table', element: <TablePage/>},
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
        { path: "setting/user/:userId/profile", element: <Profile /> },
        { path: '/setting/tenant', element: <Guard allow={user?.role === "superAdmin"}><Tenant/></Guard> },
        { path: '/setting/user', element: <Guard allow={canManageUsers(user)}><User/></Guard> },
        { path: '/store-setting/:shopId', element: <StoreSetting/>},
        { path: '/setting/category', element: <Guard allow={canManageTenant(user)}><Category/></Guard> },
        { path: '/setting/product', element: <Product/>},
        { path: '/store/pos/:shopId', element: <Pos/>},
        { path: 'warehouse', element: <Warehouse/>},
        { path: '/store/pos/:id/warehouse-in-shop', element: <WarehouseInShop/>},
        { path: '/store/pos/:id/mobile-app-controller', element: <MobileApp/>},
        { path: "*", element: <NotFound /> },
        // push ban
        // test push
      ],
    },
  ]);
  
  return AttendanceCheckInPage || (isAuthenticated ? Content : LoginPage);

}
