import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";
import CreateProject from "./pages/CreateProject";
import Auth from "./pages/Auth";
import { useAuth } from "./contexts/AuthContext";
import Projects from "./pages/Projects";

// Add your other pages/components here

function App() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow">
          <Routes>
            <Route
              path="/auth"
              element={!isLoggedIn ? <Auth /> : <Navigate to="/" />}
            />
            <Route path="/" element={<MainContent />} />
            <Route path="/create-project" element={<CreateProject />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
