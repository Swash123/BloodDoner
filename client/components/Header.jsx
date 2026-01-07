import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import EmergencyAlert from "./EmergencyAlert";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


export default function Header() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdown, setIsProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const handleLogout= ()=>{
    setIsProfileDropdown(!isProfileDropdown);
  }
  useEffect(() => {
    // Check if the user is logged in
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log(userData);
          

          if (userData.role !== "donor") {
            navigate("/login");
            return;
          }

          const thisUser = { uid: currentUser.uid, ...userData };
          setUser(thisUser);
        }
      }catch(err){
        console.log(err);
      }
    });
    return () => unsubscribe(); // Clean up on unmount
  }, []);


  return (
    <>
      <EmergencyAlert />
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
     <div class="logo_container">
  <img src="/images/logo.jpeg" alt="Logo" class="logo" />
</div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="/how-it-works"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                How It Works
              </Link>
              <Link
                to="/donors"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Find Donors
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
              <Link
                to="/contact"
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {!user ? (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Get Started</Link>
                  </Button>
                </>
              ) : (
                <div className="relative flex items-center space-x-3">
                  {/* Profile Picture or Default Icon */}
                  <button onClick={() => setIsProfileDropdown(!isProfileDropdown)} className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                  </button>
                  {isProfileDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md border z-50">
                      {user?.role === "donor" && (
                        <Button
                          variant="ghost"
                          className="w-full justify-center"
                          onClick={() => setIsProfileDropdown(!isProfileDropdown)}
                        >
                          <Link className="flex items-center w-full" to="/dashboard">
                            <LayoutDashboard className="mr-2" /> Dashboard
                          </Link>
                        </Button>
                      )}
                      <Button variant="ghost" className="w-full justify-center" onClick={() => setIsProfileDropdown(!isProfileDropdown)}>
                        <Link className="flex items-center w-full" to="/logout">
                          <LogOut className="mr-2" /> Logout
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                <Link
                  to="/how-it-works"
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  How It Works
                </Link>
                <Link
                  to="/donors"
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Find Donors
                </Link>
                <Link
                  to="/about"
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  to="/contact"
                  className="block px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-3 space-x-3">
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                        Login
                      </Link>
                    </Button>
                  </div>
                  <div className="mt-3 px-3">
                    <Button asChild className="w-full">
                      <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
