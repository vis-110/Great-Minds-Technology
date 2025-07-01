import React from "react";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { GoogleOAuthProvider } from "@react-oauth/google";
import StudentEditForm from "./Pages/studentEditForm";
import UserProfileStart from "./Pages/Userprofilestart";
import TrainerEditProfile from "./Pages/Trainer/trainerEditProfile";
import TrainerProfile from "./Pages/Trainer/TrainerProfile";
import GMTSideBar from "./Pages/sidebar2";
import VendorProfile from "./Pages/Vendor/vendorProfile";
import VendorEditProfile from "./Pages/Vendor/verndorEditProfile";
import SASidebar from "./Pages/SuperAdmin/SASidebar";
import AdminDashboard from "./Pages/Admin/adminDashboard";
import StudentList from "./Pages/Admin/Student/studentList";
import TrainerApproval from "./Pages/Admin/Trainer/approvalTrainer";
import TrainerDetailsForm from "./Pages/Trainer/trainerSubmitForm";
import VendorDetailsForm from "./Pages/Vendor/vendorSubmitForm";
import VendorApproval from "./Pages/Admin/Vendor/approvalVendor";
import CreateCourse from "./Pages/Trainer/trainerCourseCreate";
import CourseList from "./Pages/Courses/CourseList";
import CourseDetail from "./pages/Courses/CourseDetail";
import CourseVideoPage from "./pages/CourseVideo/CourseVideoPage";
import BatchSchedulingPage from "./pages/BatchScheduling/BatchSchedulingPage";
import LandingPageConst from "./Pages/Landing Page/LandingPageConst";
import CourseEnrollments from "./Pages/Enrollments/CourseEnrollments";
import EnhancedTable from "./Pages/Enrollments/Enrollment_Students";
import Certificate from "./components/PDFGenerate/CertificateForm";
import ResetPassword from "./Pages/ResetPassword";
import StudentDashboard from "./Pages/StudentDashboard/StudentDashboard";
import TrainerDashboard from "./Pages/TrainerDashboard/TrainerDashboard";
import VendorDashboard from "./Pages/Vendor/vendorDashboard";
import ProtectedRoute from "./Pages/ProtectedRoute";
import SuperAdminDashBoard from "./Pages/SuperAdmin/SuperAdminDashBoard";
import AdminList from "./Pages/SuperAdmin/AdminList";
import CreateInternship from "./Pages/Vendor/CreateInternship";
import CreateEvent from "./Pages/Vendor/CreateEvent";
import InternshipsAndEvents from "./Pages/Vendor/InternshipsAndEvents";
import CreateSelection from "./Pages/Vendor/CreateSelection"; 
import CertificationList from "./Pages/StudentDashboard/CertificationList";



// Placeholder components for missing routes
const Certification = () => <div>Certification Page (Student)</div>;
const Motivation = () => <div>Motivation Page (Student)</div>;
const Guidance = () => <div>Guidance Page (Student)</div>;
const Reports = () => <div>Reports Page (Admin)</div>;
const SalesReport = () => <div>Sales Report Page (Admin)</div>;
const TrafficReport = () => <div>Traffic Report Page (Admin)</div>;
const Integrations = () => <div>Integrations Page (Admin)</div>;

function App() {
  return (
    <GoogleOAuthProvider clientId="AIzaSyC94KMkTu_pIB-EJEUkUjMXc55zSW16Vys">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPageConst />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/trainer-details" element={<TrainerDetailsForm />} />
          <Route path="/vendor-details" element={<VendorDetailsForm />} />

          {/* Shared Routes (accessible to all roles) */}

          <Route path="/coursecounts" element={<CourseEnrollments />} />
          <Route path="/coursestudents" element={<EnhancedTable />} />

          {/* Student Routes (outside dashboard) */}
          <Route path="/studentdashboard" element={<UserProfileStart />} />

          {/* Dashboard Routes with Sidebar */}
          <Route path="/dashboard/*" element={<GMTSideBar />}>
            {/* Student Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route index element={<StudentDashboard />} />
              <Route path="editform" element={<StudentEditForm />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course" element={<CourseList />} />
              {/* <Route path="courses/:query" element={<CourseList />} /> */}
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course/:id/video" element={<CourseVideoPage />} />
              {/* <Route path="coursedetails" element={<CourseDetail />} /> */}
              <Route path="certification" element={<CertificationList />} />
              <Route path="motivation" element={<Motivation />} />
              <Route path="guidance" element={<Guidance />} />
              </Route>

            {/* Trainer Protected Routes */}
           {/* Trainer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["trainer"]} />}>
              <Route path="trainer">
                <Route index element={<TrainerDashboard />} />
                <Route path="trainerprofile" element={<TrainerProfile />} />
                <Route path="trainereditprofile" element={<TrainerEditProfile />} />
                <Route path="coursecreation" element={<CreateCourse />} />
                <Route path="courselist" element={<CourseList />} />
                <Route path="courses/:query" element={<CourseList />} />
                <Route path="course/:id" element={<CourseDetail />} />
                <Route path="course/:id/video" element={<CourseVideoPage />} />
              </Route>
              {/* <Route path="courselist" element={<CourseList />} /> */}
            </Route>

            {/* Vendor Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
              <Route path="vendor">
                <Route index element={<VendorDashboard />} />
                <Route path="vendorprofile" element={<VendorProfile />} />
                <Route path="createInternship" element={<CreateInternship />} />
                <Route path="createevent" element={<CreateEvent />} />
                <Route
                  path="VendorEditProfile"
                  element={<VendorEditProfile />}
                />
                <Route path="internships-and-events" element={<InternshipsAndEvents />} />
                <Route path="create" element={<CreateSelection />} />
              </Route>
            </Route>

            {/* Shared Dashboard Routes (accessible to multiple roles) */}
            <Route element={<ProtectedRoute allowedRoles={["trainer", "vendor"]} />}>
              <Route path="coursecreation" element={<CreateCourse />} />
              <Route
                path="batch-scheduling"
                element={<BatchSchedulingPage />}
              />
            </Route>
            {/* Admin Routes */}
            <Route path="admin" element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route index element={<AdminDashboard />} />
              <Route path="students" element={<StudentList />} />
              <Route path="trainer" element={<TrainerApproval />} />
              <Route path="vendor" element={<VendorApproval />} />
              <Route path="courselist" element={<CourseList />} />
              <Route path="courses/:query" element={<CourseList />} />
              <Route path="course/:id" element={<CourseDetail />} />
              <Route path="course/:id/video" element={<CourseVideoPage />} />
              <Route path="coursecounts" element={<CourseEnrollments />} />
              <Route path="coursestudents" element={<EnhancedTable />} />
              <Route path="certificate" element={<Certificate />} />
              <Route path="reports" element={<Reports />} />
              <Route path="reports/sales" element={<SalesReport />} />
              <Route path="reports/traffic" element={<TrafficReport />} />
              <Route path="integrations" element={<Integrations />} />
            </Route>
          </Route>

          
          {/* SuperAdmin Routes */}
          <Route
            path="/sadmin"
            element={<ProtectedRoute allowedRoles={["superadmin"]} />}
          />
          <Route
            path="/sadmin/*"
            element={<SASidebar />} // Your Super Admin sidebar layout component
          >
            <Route index element={<SuperAdminDashBoard/>} />
            <Route path="students" element={<StudentList />} />
            <Route path="trainer" element={<TrainerApproval />} />
            <Route path="vendor" element={<VendorApproval />} />
            <Route path="courselist" element={<CourseList />} />
            {/* <Route path="superdata" element={} /> */}
            <Route path="coursestudents" element={<EnhancedTable />} />
            <Route path="admins" element={<AdminList />} />
            {/* Add more superadmin routes here */}
          </Route>

          {/* Catch-all route for unknown paths */}
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;



