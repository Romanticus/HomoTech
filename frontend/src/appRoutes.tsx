import {   Routes, Route, Navigate } from 'react-router-dom';
 import AdminPanel from './components/AdminPanel/AdminPanel';
import App from './components/App/App';
import { useAppState } from './hooks/useAppState';




function AppRoutes() {
 
   
    return (
    <Routes>
      {/* <Route path="/admin/*" element={false ? (<AdminPanel />):(<Navigate to="/"/>)} /> */}
      <Route path="/*" element={<App/>} />
    </Routes>
  );
}

 
export default AppRoutes;