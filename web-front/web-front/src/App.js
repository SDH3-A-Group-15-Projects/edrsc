import { Routes, Route} from 'react-router-dom';
import SignUp from './Components/SignUp/SignUp';
import LogIn from './Components/LogIn/Login';
import Welcome from './Components/Welcome/Welcome';
import Risk_Dashboard from './Components/Risk_Dashboard/Risk_Dashboard';
import Patient_Selection from './Components/Patient_Selection/patient_selection';

function App() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/dashboard" element={<Risk_Dashboard />} />
      <Route path="/patients" element={<Patient_Selection/>}/>
    </Routes>
  );
}

export default App;
