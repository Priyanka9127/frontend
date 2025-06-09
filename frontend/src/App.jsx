import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layout Component
import DashboardLayout from "./components/layout/DashboardLayout"; 

// Your Page and Component Imports
import Login from "./pages/Login";
import PrivateRoutes from "./utils/PrivateRoutes";
import RoleBaseRoutes from "./utils/RoleBaseRoutes";
import AdminSummary from "./components/dashboard/AdminSummary";
import DepartmentList from "./components/Department/DepartmentList";
import AddDepartment from "./components/Department/AddDepartment";
import EditDepartment from "./components/Department/EditDepartment";
import List from "./components/employee/List";
import Add from "./components/employee/Add";
import View from "./components/employee/View";
import Edit from "./components/employee/Edit";
import AddSalary from "./components/salary/Add";
import ViewSalary from "./components/salary/View";
import Summary from "./components/EmployeeDashboard/Summary";
import LeaveList from './components/leave/List';
import AddLeave from './components/leave/Add';
import Setting from "./components/EmployeeDashboard/Setting";
import Table from "./components/leave/Table";
import Detail from "./components/leave/Detail";
import Attendance from "./components/attendance/Attendance";
import AttendanceReport from "./components/attendance/AttendanceReport";

// Note: We no longer need to import AdminDashboard or EmployeeDashboard here
// because the layout handles the structure.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Standalone routes without the dashboard layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />

        {/* Admin Dashboard Routes with the new Layout */}
        <Route 
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin"]}>
                <DashboardLayout />
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route path="/admin-dashboard" element={<AdminSummary />} />
          <Route path="/admin-dashboard/departments" element={<DepartmentList />} />
          <Route path="/admin-dashboard/add-department" element={<AddDepartment />} />
          <Route path="/admin-dashboard/department/:id" element={<EditDepartment />} />
          <Route path="/admin-dashboard/employees" element={<List />} />
          <Route path="/admin-dashboard/add-employee" element={<Add />} />
          <Route path="/admin-dashboard/employees/:id" element={<View />} />
          <Route path="/admin-dashboard/employees/edit/:id" element={<Edit />} />
          <Route path="/admin-dashboard/employees/salary/:id" element={<ViewSalary />} />
          <Route path="/admin-dashboard/salary/add" element={<AddSalary />} />
          <Route path="/admin-dashboard/leaves" element={<Table />} />
          <Route path="/admin-dashboard/leaves/:id" element={<Detail />} />
          <Route path="/admin-dashboard/employees/leaves/:id" element={<LeaveList />} />
          <Route path="/admin-dashboard/setting" element={<Setting />} />
          <Route path="/admin-dashboard/attendance" element={<Attendance />} />
          <Route path="/admin-dashboard/attendance-report" element={<AttendanceReport />} />
        </Route>

        {/* Employee Dashboard Routes with the new Layout */}
        <Route 
          element={
            <PrivateRoutes>
              <RoleBaseRoutes requiredRole={["admin", "employee"]}>
                <DashboardLayout /> 
              </RoleBaseRoutes>
            </PrivateRoutes>
          }
        >
          <Route path="/employee-dashboard" element={<Summary />} />
          <Route path="/employee-dashboard/profile/:id" element={<View />} />
          <Route path="/employee-dashboard/leaves/:id" element={<LeaveList />} />
          <Route path="/employee-dashboard/add-leave" element={<AddLeave />} />
          <Route path="/employee-dashboard/salary/:id" element={<ViewSalary />} />
          <Route path="/employee-dashboard/setting" element={<Setting />} />
        </Route>

        {/* Fallback route */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;