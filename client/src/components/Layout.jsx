import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAddHousehold = () => {
    navigate('/add/household');
  };
  
  const handleAddContact = () => {
    navigate('/add/contact');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)]">
      {/* Header */}
      <header className="bg-[var(--container-bg)] shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-[var(--text-color)] text-xl font-bold mr-8">
                Family Address Book
              </h1>
              <nav className="flex space-x-4">
                <Link 
                  to="/" 
                  className={`text-[var(--text-color)] hover:opacity-80 px-3 py-2 rounded-md ${
                    location.pathname === '/' ? 'bg-[var(--button-bg)]' : ''
                  }`}
                >
                  Households
                </Link>
                <Link 
                  to="/contacts" 
                  className={`text-[var(--text-color)] hover:opacity-80 px-3 py-2 rounded-md ${
                    location.pathname === '/contacts' ? 'bg-[var(--button-bg)]' : ''
                  }`}
                >
                  Contacts
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleAddHousehold}
                className="bg-[var(--button-bg)] text-[var(--text-color)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)]"
              >
                Add Household
              </button>
              <button 
                onClick={handleAddContact}
                className="bg-[var(--button-bg)] text-[var(--text-color)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)]"
              >
                Add Contact
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-[var(--text-color)] px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;