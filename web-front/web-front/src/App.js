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

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard" element={<Risk_Dashboard />} />
      <Route path="/patients" element={<Patient_Selection/>}/>
      <Route path="/report" element={<Report/>}/>
      <Route path="/news" element={<MedicalNews/>}/>
      <Route path="/reset" element={<ResetPassword/>}/>
      <Route path='/data' element={<DataAggregation/>}/>
    </Routes>
  );
}

export default App;
