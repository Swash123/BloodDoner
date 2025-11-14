import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import {
  Heart,
  MapPin,
  Clock,
  Bell,
  User,
  Calendar,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getCompatibleRecipients } from "@/lib/bloodCompatibility";
import { getBloodRequestsOfType } from "@/lib/bloodRequest";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bloodRequests, setBloodRequests] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
      } else {
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
            
          } else {
            navigate("/login");
          }
        }catch (error) {
          console.error(error);
          navigate("/login");
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);
  useEffect(() => {
      const fetchRequest = async () => {
        try {
          if (user) {
            const requests=await getBloodRequestsOfType(user.bloodType, 5);
            setBloodRequests(requests);
          }
        } catch (error) {
          console.error("Error fetching request:", error);
        }
      };
  
      fetchRequest();
    }, [user]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-brand-gray">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Your donations have helped save 3 lives this year.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Donations
              </CardTitle>
              <Heart className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 from last year</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lives Saved</CardTitle>
              <Activity className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">
                Direct impact this year
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Next Eligible
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">days remaining</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blood Type</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{user.bloodType}</div>
              <p className="text-xs text-muted-foreground">{getCompatibleRecipients(user.bloodType).join(", ")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Recent Blood Requests Near You
                </CardTitle>
                <CardDescription>
                  Blood requests in your area that match your type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {bloodRequests&&bloodRequests.map((request)=>(
                  <div className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Urgent: O+ Blood Needed</h4>
                        <p className="text-sm text-muted-foreground">
                          Patan Hospital - Emergency surgery
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            2.5 km away
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Posted 2 hours ago
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className="mb-2">URGENT</Badge>
                        <Button size="sm">Respond</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Profile & Quick Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Donor information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Blood Type</span>
                  <Badge className="bg-primary">{user.bloodType}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Location</span>
                  <span className="text-sm text-muted-foreground">
                    {user.address}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Donation</span>
                  <span className="text-sm text-muted-foreground">
                    Nov 15, 2024
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Status</span>
                  <Badge variant="outline">Available</Badge>
                </div>
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Heart className="h-4 w-4 mr-2" />
                  Mark Available for Donation
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Update Notification Settings
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Donation History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
