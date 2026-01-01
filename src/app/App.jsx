import { useState, useEffect } from 'react';
import { getCurrentUser, removeToken, removeCurrentUser, favoritesAPI } from '../services/api.js';
import { propertiesAPI } from '../services/api.js';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import PaymentPage from './pages/PaymentPage';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import BookingPage from './pages/BookingPage';
import ProfilePage from './pages/ProfilePage';
import UserProfilePage from './pages/UserProfilePage';
import MyBookingsPage from './pages/MyBookingsPage';
import FavoritesPage from './pages/FavoritesPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import OwnerBookingManagement from './components/OwnerBookingManagement';
import AddPropertyPage from './pages/AddPropertyPage';
import EditPropertyPage from './pages/EditPropertyPage';
import ManageListingsPage from './pages/ManageListingsPage';
import ViewBookingsPage from './pages/ViewBookingsPage';
import ApprovalsPage from './pages/ApprovalsPage';
import ReportsPage from './pages/ReportsPage';
import PropertyApprovalsPage from './pages/PropertyApprovalsPage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import TermsPage from './pages/TermsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [pageData, setPageData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [favoritePropertyIds, setFavoritePropertyIds] = useState([]);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Get user from localStorage
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        // Load user's favorites if logged in
        await loadUserFavorites();
      }

      // Load properties
      await loadProperties();

    } catch (error) {
      console.error('Error initializing app:', error);
      // Set empty array if API fails
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const loadUserFavorites = async () => {
    try {
      const response = await favoritesAPI.getAll();
      if (response.success) {
        // Extract property IDs from favorite properties
        const favoriteIds = response.data.map(property => property._id);
        setFavoritePropertyIds(favoriteIds);
      }
    } catch (error) {
      console.error('Error loading user favorites:', error);
      // Don't fail the app if favorites can't be loaded
      setFavoritePropertyIds([]);
    }
  };

  const loadProperties = async () => {
    try {
      console.log('🔄 Loading properties from API...');
      const response = await propertiesAPI.getAll();
      if (response.success) {
        console.log(`✅ Loaded ${response.data.length} properties`);
        setProperties(response.data);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      // Set empty array if API fails
      setProperties([]);
    }
  };

  // Function to refresh properties (can be called after adding new property)
  const refreshProperties = async () => {
    await loadProperties();
  };

  const handleNavigate = (page, data) => {
    setCurrentPage(page);
    setPageData(data);
    setSidebarOpen(false);
  };

  const handleLogin = async (userData) => {
    setUser(userData);
    // Token is already stored in API service
    
    // Load user's favorites after login
    await loadUserFavorites();
    
    // Redirect based on user role
    if (userData.role === 'admin') {
      setCurrentPage('admin-dashboard');
    } else if (userData.role === 'owner') {
      setCurrentPage('owner-dashboard');
    } else {
      setCurrentPage('home');
    }
  };

  const handleLogout = () => {
    removeToken();
    removeCurrentUser();
    setUser(null);
    setFavoritePropertyIds([]);
    setCurrentPage('home');
  };

  const handleToggleFavorite = async (propertyId) => {
    if (!user) {
      // Redirect to login if not authenticated
      setCurrentPage('login');
      return;
    }

    try {
      const isCurrentlyFavorited = favoritePropertyIds.includes(propertyId);
      
      if (isCurrentlyFavorited) {
        // Remove from favorites
        await favoritesAPI.remove(propertyId);
        setFavoritePropertyIds(prev => prev.filter(id => id !== propertyId));
      } else {
        // Add to favorites
        await favoritesAPI.add(propertyId);
        setFavoritePropertyIds(prev => [...prev, propertyId]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // You can add a toast notification here
      alert('Failed to update favorites. Please try again.');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const showLayout = !['login', 'signup', 'forgot-password'].includes(currentPage);

  const renderPage = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading YegnaBet...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'forgot-password':
        return <ForgotPasswordPage onNavigate={handleNavigate} />;
      case 'home':
        return (
          <HomePage 
            user={user} 
            onNavigate={handleNavigate} 
            properties={properties}
            favorites={favoritePropertyIds}
            onToggleFavorite={handleToggleFavorite}
            onRefreshProperties={refreshProperties}
          />
        );
      case 'search':
        return (
          <SearchPage 
            user={user} 
            onNavigate={handleNavigate} 
            properties={properties}
            favorites={favoritePropertyIds}
            onToggleFavorite={handleToggleFavorite}
            onRefreshProperties={refreshProperties}
          />
        );
      case 'property-details':
        return (
          <PropertyDetailsPage 
            property={pageData} 
            user={user} 
            onNavigate={handleNavigate}
            isFavorite={favoritePropertyIds.includes(pageData?._id || pageData?.id)}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'booking':
        return <BookingPage property={pageData} user={user} onNavigate={handleNavigate} />;
      case 'payment':
        return <PaymentPage bookingData={pageData} user={user} onNavigate={handleNavigate} />;
      case 'profile':
        return user ? (
          <ProfilePage user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'user-profile':
      case 'wallet':
        return user ? (
          <UserProfilePage user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'my-bookings':
        return user ? (
          <MyBookingsPage user={user} onNavigate={handleNavigate} />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'favorites':
        return user ? (
          <FavoritesPage 
            user={user} 
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'admin-dashboard':
        return user ? (
          <AdminDashboardPage
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'owner-dashboard':
        return user && user.role === 'owner' ? (
          <OwnerDashboardPage
            user={user}
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'owner-bookings':
        return user && user.role === 'owner' ? (
          <OwnerBookingManagement
            user={user}
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'add-property':
        return user && user.role === 'owner' ? (
          <AddPropertyPage
            user={user}
            onNavigate={handleNavigate}
            onPropertyAdded={refreshProperties}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'edit-property':
        return user && user.role === 'owner' ? (
          <EditPropertyPage
            property={navigationData}
            user={user}
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'manage-listings':
        return user ? (
          <ManageListingsPage
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'view-bookings':
        return user ? (
          <ViewBookingsPage
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'approvals':
        return user ? (
          <ApprovalsPage
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'reports':
        return user ? (
          <ReportsPage
            user={user}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarToggle={toggleSidebar}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'property-approvals':
        return user && user.role === 'admin' ? (
          <PropertyApprovalsPage
            user={user}
            onNavigate={handleNavigate}
          />
        ) : (
          <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />
        );
      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;
      case 'blog':
        return <BlogPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage onNavigate={handleNavigate} />;
      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;
      case 'components':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Components</h2>
              <p className="text-gray-600">Component showcase not available</p>
              <button 
                onClick={() => onNavigate('home')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Back to Home
              </button>
            </div>
          </div>
        );
      default:
        return <HomePage user={user} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {showLayout && (
        <Navbar 
          user={user} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          currentPage={currentPage}
        />
      )}
      
      <main className="flex-1">
        {renderPage()}
      </main>
      
      {showLayout && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;