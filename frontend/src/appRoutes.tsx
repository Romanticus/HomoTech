import {   Routes, Route } from 'react-router-dom';
import App from './components/App/App';




function AppRoutes() {
 
   
    return (
    <Routes>
      {/* <Route path="/admin/*" element={false ? (<AdminPanel />):(<Navigate to="/"/>)} /> */}
      <Route path="/*" element={<App/>} />
    </Routes>
  );
}

 
export default AppRoutes;