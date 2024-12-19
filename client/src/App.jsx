const queryClient = new QueryClient();
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Households from './pages/Households';
import Contacts from './pages/Contacts';
import AddEdit from './pages/AddEdit';


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<Layout />}>
              {/* Explicitly define each route instead of using :type */}
              <Route path="/add/household" element={<AddEdit />} />
              <Route path="/add/contact" element={<AddEdit />} />
              <Route path="/edit/household/:id" element={<AddEdit />} />
              <Route path="/edit/contact/:id" element={<AddEdit />} />
              <Route path="/add/:type" element={<AddEdit />} />
              <Route path="/edit/:type/:id" element={<AddEdit />} />
              
              {/* Main Pages */}
              <Route path="/" element={<Households />} />
              <Route path="/contacts" element={<Contacts />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;