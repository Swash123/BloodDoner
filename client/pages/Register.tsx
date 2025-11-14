import { useState, useEffect } from "react";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { Heart, UserPlus, Building2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "@/lib/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function Register() {
  //
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
  const [tab, setTab] = useState<"donor" | "seeker">("donor");

  // const [formData, setFormData] = useState<any>({
  //   firstName: "",
  //   lastName: "",
  //   email: "",
  //   phone: "",
  //   bloodType: "",
  //   age: "",
  //   address: "",
  //   password: "",
  //   confirmPassword: "",
  //   orgName: "",
  //   contactPerson: "",
  //   licenseNumber: "",
  // });

  const [donorData, setDonorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bloodType: "",
    age: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [seekerData, setSeekerData] = useState({
    orgName: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (tab === "donor") {
      setDonorData((prev) => ({ ...prev, [id]: value }));
    } else {
      setSeekerData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    if (tab === "donor") {
      setDonorData((prev) => ({ ...prev, bloodType: value }));
    }
  };

  const handleRegister = async () => {
    if (tab === "donor") {
      const { email, password, confirmPassword } = donorData;
      if (!email || !password) return toast.error("Email and password required.");
      if (password !== confirmPassword)
        return toast.error("Passwords do not match.");

      try {
        await registerUser(email, password, {
          role: "donor",
          firstName: donorData.firstName,
          lastName: donorData.lastName,
          phone: donorData.phone,
          bloodType: donorData.bloodType,
          age: donorData.age,
          address: donorData.address,
        });
        toast.success("Donor registration successful!");
        setDonorData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          bloodType: "",
          age: "",
          address: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err: any) {
        switch (err.code) {
          case "auth/email-already-in-use":
            toast.error("This email already exist.");
          case "auth/invalid-email":
            toast.error("Invalid email format.");
          case "auth/weak-password":
            toast.error("Password is too weak (min 6 characters).");
          default:
            toast.error("Registration failed:",err.message);
        }
      }
    } else {
      const { email, password, confirmPassword } = seekerData;
      if (!email || !password) return toast.error("Email and password required.");
      if (password !== confirmPassword)
        return toast.error("Passwords do not match.");

      try {
        await registerUser(email, password, {
          role: "seeker",
          orgName: seekerData.orgName,
          contactPerson: seekerData.contactPerson,
          phone: seekerData.phone,
          address: seekerData.address,
          licenseNumber: seekerData.licenseNumber,
        });
        toast.success("Seeker registration successful!");
        setSeekerData({
          orgName: "",
          contactPerson: "",
          email: "",
          phone: "",
          address: "",
          licenseNumber: "",
          password: "",
          confirmPassword: "",
        });
      } catch (err: any) {
        switch (err.code) {
          case "auth/email-already-in-use":
            toast.error("This email already exist.");
          case "auth/invalid-email":
            toast.error("Invalid email format.");
          case "auth/weak-password":
            toast.error("Password is too weak (min 6 characters).");
          default:
            toast.error("Registration failed:",err.message);
        }
      }
    }
  };
  //
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary fill-current" />
            </div>
            <h1 className="text-2xl font-bold text-brand-gray">
              Join SahayogRed
            </h1>
            <p className="text-muted-foreground mt-2">
              Create your account and start saving lives
            </p>
          </div>

          <Tabs defaultValue="donor" value={tab} onValueChange={(val) => setTab(val as "donor" | "seeker")} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                I'm a Donor
              </TabsTrigger>
              <TabsTrigger value="seeker" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />I Need Blood
              </TabsTrigger>
            </TabsList>

            <TabsContent value="donor">
              <Card>
                <CardHeader>
                  <CardTitle>Register as a Blood Donor</CardTitle>
                  <CardDescription>
                    Help save lives by becoming a verified blood donor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName"
                        value={donorData.firstName}
                        onChange={handleChange}
                        placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" 
                        value={donorData.lastName}
                        onChange={handleChange}
                        placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={donorData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" 
                      value={donorData.phone}
                      onChange={handleChange}
                      placeholder="+977 9XXXXXXXXX" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type</Label>
                      <Select onValueChange={handleSelectChange} value={donorData.bloodType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A+">A+</SelectItem>
                          <SelectItem value="A-">A-</SelectItem>
                          <SelectItem value="B+">B+</SelectItem>
                          <SelectItem value="B-">B-</SelectItem>
                          <SelectItem value="AB+">AB+</SelectItem>
                          <SelectItem value="AB-">AB-</SelectItem>
                          <SelectItem value="O+">O+</SelectItem>
                          <SelectItem value="O-">O-</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age"
                        value={donorData.age}
                        onChange={handleChange}
                        type="number" placeholder="25" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" 
                      value={donorData.address}
                      onChange={handleChange}
                      placeholder="City, District" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" 
                        value={donorData.password}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" 
                        value={donorData.confirmPassword}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <Button className="w-full" onClick={handleRegister}>Register as Donor</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seeker">
              <Card>
                <CardHeader>
                  <CardTitle>Register as Blood Seeker</CardTitle>
                  <CardDescription>
                    Register to request blood donations when needed
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization/Name</Label>
                      <Input
                        id="orgName"
                        value={seekerData.orgName}
                        onChange={handleChange}
                        placeholder="Hospital/Individual Name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactPerson">Contact Person</Label>
                      <Input id="contactPerson" 
                        value={seekerData.contactPerson}
                        onChange={handleChange}
                        placeholder="Dr. John Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={seekerData.email}
                      onChange={handleChange}
                      placeholder="contact@hospital.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" 
                        value={seekerData.phone}
                        onChange={handleChange}
                        placeholder="+977 98XXXXXXXX" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" 
                        value={seekerData.address}
                        onChange={handleChange}placeholder="Hospital Address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">
                      License/Registration Number
                    </Label>
                    <Input
                      id="licenseNumber"
                      value={seekerData.licenseNumber}
                      onChange={handleChange}
                      placeholder="Medical License Number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" 
                        value={seekerData.password}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" 
                        value={seekerData.confirmPassword}
                        onChange={handleChange}
                        type="password" />
                  </div>
                  <Button className="w-full" onClick={handleRegister}>Register as Seeker</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
