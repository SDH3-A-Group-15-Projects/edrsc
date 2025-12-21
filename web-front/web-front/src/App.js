import { Routes, Route} from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import LogIn from './Components/LogIn/Login';
import Welcome from './Components/Welcome/Welcome';
import Update from './Components/Update/update';
import Risk_Dashboard from './Components/Risk_Dashboard/Risk_Dashboard';
import Patient_Selection from './Components/Patient_Selection/patient_selection';
import Report from './Components/Report/report';
import ReportSuccess from './Pages/ReportSuccess';
import MedicalNews from './Components/MedicalNews/MedicalNews';
import ResetPassword from './Components/ResetPassword/resetPassword';
import DataAggregation from './Components/Admin/DataAggregation/DataAggregation';
import ProtectedRoute from './Components/ProtectedRoute';
import UnprotectedRoute from './Components/UnprotectedRoute';
import AdminSignUp from './Components/Admin/SignUp/SignUp';
import AdminUnprotectedRoute from './Components/Admin/UnprotectedRoute';
import AdminLogIn from './Components/Admin/LogIn/Login';
import AdminProtectedRoute from './Components/Admin/ProtectedRoute';
import AdminWelcome from './Components/Admin/Welcome/Welcome';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <UnprotectedRoute>
        <SignUp />
        </UnprotectedRoute>
        } />
      <Route path="/admin/" element={
        <AdminUnprotectedRoute>
        <AdminSignUp />
        </AdminUnprotectedRoute>
        } />
      <Route path="/login" element={
        <UnprotectedRoute>
        <LogIn />
        </UnprotectedRoute>
      } />
      <Route path="/admin/login" element={
        <AdminUnprotectedRoute>
        <AdminLogIn />
        </AdminUnprotectedRoute>
      } />
      <Route path="/welcome" element={
        <ProtectedRoute>
        <Welcome />
        </ProtectedRoute>
      }/>
      <Route path="/admin/welcome" element={
        <AdminProtectedRoute>
        <AdminWelcome />
        </AdminProtectedRoute>
      }/>
      <Route path="/update-patients" element={
        <ProtectedRoute>
        <Update />
        </ProtectedRoute>
      }/>
      <Route path="/dashboard" element={
        <ProtectedRoute>
        <Risk_Dashboard />
        </ProtectedRoute>
        } 
        />
      <Route path="/patients" element={
        <ProtectedRoute>
        <Patient_Selection/>
        </ProtectedRoute>
        }/>
      <Route path="/report-success" element={
        <ProtectedRoute>
        <ReportSuccess/>
        </ProtectedRoute>
        }/>
      <Route path="/report" element={
        <ProtectedRoute>
        <Report/>
        </ProtectedRoute>
        }/>
      <Route path="/news" element={
        <ProtectedRoute>
        <MedicalNews/>
        </ProtectedRoute>
        }/>
      <Route path="/reset" element={<ResetPassword/>}/>
      <Route path='/admin/data' element={
        <AdminProtectedRoute>
        <DataAggregation/>
        </AdminProtectedRoute>
        }/>

    </Routes>
  );
}

export default App;
