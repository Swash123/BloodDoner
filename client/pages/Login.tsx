import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import { Heart } from "lucide-react";
import { Link ,useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser } from "@/lib/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {

        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if(userDocSnap.exists()){
          const userData = userDocSnap.data();

          if (userData.role === "donor") {
            navigate("/dashboard");
            return;
          } else if (userData.role === "seeker") {
            navigate("/");
            return;
          }
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.id]: e.target.value });
  };
  const handleLogin = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      
      const user = await loginUser(email, password);
      toast.success(`Login Successful!!`);
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);
      const userData = userDocSnap.data();

      if (userData.role === "donor") {
        navigate("/dashboard");
        return;
      } else if (userData.role === "seeker") {
        navigate("/");
        return;
      }
      setLoginData({
        email: "",
        password: "",
      });
    } catch (err: any) {
      switch (err.code) {
        case "auth/user-not-found":
          toast.error("No user found with this email.");
          break;
        case "auth/invalid-credential":
          toast.error("Incorrect email or password.");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email format.");
          break;
        default:
          toast.error("Login failed:", err.message);
          console.log(err.message);
          
      }
    }
  };
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-brand-gray">
              Welcome Back to SahayogRed
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue saving lives
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password"
                  name="password"
                  autoComplete="new-password"
                  onChange={handleChange} />
              </div>
              <div className="flex items-center justify-between">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <Button className="w-full" onClick={handleLogin}>Sign In</Button>
              <div className="text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
