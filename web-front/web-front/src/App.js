import { Routes, Route} from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import LogIn from './Components/LogIn/Login';
import Welcome from './Components/Welcome/Welcome';
import Risk_Dashboard from './Components/Risk_Dashboard/Risk_Dashboard';
import Patient_Selection from './Components/Patient_Selection/patient_selection';
import Report from './Components/Report/report';
import MedicalNews from './Components/MedicalNews/MedicalNews';
import ResetPassword from './Components/ResetPassword/resetPassword';
import DataAggregation from './Components/DataAggregation/DataAggregation';
import ProtectedRoute from './Components/ProtectedRoute';
import UnprotectedRoute from './Components/UnprotectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={
        <UnprotectedRoute>
        <SignUp />
        </UnprotectedRoute>
        } />
      <Route path="/login" element={
        <UnprotectedRoute>
        <LogIn />
        </UnprotectedRoute>
      } />
      <Route path="/welcome" element={
        <ProtectedRoute>
        <Welcome />
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
      <Route path='/data' element={
        <ProtectedRoute>
        <DataAggregation/>
        </ProtectedRoute>
        }/>
    </Routes>
  );
}

export default App;
