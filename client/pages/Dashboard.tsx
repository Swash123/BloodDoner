import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "@/firebase/firebaseConfig";
import { getCompatibleRecipients } from "@/lib/bloodCompatibility";
import { getBloodRequestsOfType } from "@/lib/bloodRequest";
import { acceptBloodRequest } from "@/lib/bloodDonation";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Heart,
  MapPin,
  Clock,
  Bell,
  User,
  Calendar,
  Activity,
} from "lucide-react";

import { toast } from "sonner";

/* -------------------------------- utils -------------------------------- */

const urgencyMap: Record<number, { label: string; variant: any }> = {
  0: { label: "CRITICAL", variant: "destructive" },
  1: { label: "URGENT", variant: "default" },
  2: { label: "MODERATE", variant: "secondary" },
  3: { label: "ROUTINE", variant: "outline" },
};

const getUrgency = (urgency?: number) =>
  urgencyMap[urgency ?? 3] ?? urgencyMap[3];

const timeAgo = (value: any) => {
  if (!value) return "Just now";

  const date =
    value?.toDate?.() instanceof Date ? value.toDate() : new Date(value);

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.seconds);
    if (count >= 1)
      return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
  }

  return "Just now";
};

/* ------------------------------ component ------------------------------ */

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [bloodRequests, setBloodRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [acceptedRequests, setAcceptedRequests] = useState<Record<string, boolean>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});

  const navigate = useNavigate();

  /* --------------------------- handlers (FIXED) --------------------------- */

  const handleAccept = async (requestId: string) => {
    if (!user) return;

    try {
      await acceptBloodRequest(user.uid, requestId);

      setAcceptedRequests((prev) => ({
        ...prev,
        [requestId]: true,
      }));

      toast.success("Request accepted!", {
        description: "Please upload your donation report.",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to accept request");
    }
  };
  const handleFileUpload = async (requestId: string, file: File | null) => {
    if (!file) return;
    if (!user) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/donation/complete/${requestId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setUploadedFiles((prev) => ({
        ...prev,
        [requestId]: file,
      }));

      toast.success("Donation completed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to complete donation");
    }
  };


  /* ----------------------------- auth check ----------------------------- */

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const snap = await getDoc(doc(db, "users", currentUser.uid));

        if (!snap.exists() || snap.data().role !== "donor") {
          navigate("/login");
          return;
        }

        setUser({ uid: currentUser.uid, ...snap.data() });
      } catch (err) {
        console.error(err);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  /* --------------------------- fetch requests --------------------------- */

  useEffect(() => {
    if (!user) return;

    const loadRequests = async () => {
      const data = await getBloodRequestsOfType(user.bloodType, 5);

      data.sort((a: any, b: any) => {
        if (a.urgency !== b.urgency) return a.urgency - b.urgency;
        return b.createdAt.seconds - a.createdAt.seconds;
      });

      setBloodRequests(data);
    };

    loadRequests();
  }, [user]);

  if (loading) return <div className="p-8">Loading...</div>;

  /* ------------------------------- UI ------------------------------- */

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back, {user.firstName}!</h1>
          <p className="text-muted-foreground mt-2">
            Thank you for saving lives ❤️
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Donations" value="12" icon={Heart} />
          <StatCard title="Lives Saved" value="3" icon={Activity} />
          <StatCard title="Next Eligible" value="45 days" icon={Calendar} />
          <StatCard
            title="Blood Type"
            value={user.bloodType}
            icon={User}
            sub={getCompatibleRecipients(user.bloodType).join(", ")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Recent Requests
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {bloodRequests.map((request) => {
                  const urgency = getUrgency(request.urgency);
                  const isAccepted = acceptedRequests[request.id];
                  const uploadedFile = uploadedFiles[request.id];

                  return (
                    <div key={request.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between gap-4">
                        <div>
                          <h4 className="font-semibold">
                            {urgency.label}: {request.bloodType} Blood Needed
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {request.hospital}
                          </p>

                          <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex gap-1">
                              <MapPin className="h-3 w-3" /> {request.location}
                            </span>
                            <span className="flex gap-1">
                              <Clock className="h-3 w-3" />{" "}
                              {timeAgo(request.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <Badge variant={urgency.variant} className="mb-2">
                            {urgency.label}
                          </Badge>

                          {!isAccepted ? (
                            <Button size="sm" onClick={() => handleAccept(request.id)}>
                              Accept
                            </Button>
                          ) : (
                            <Badge variant="secondary">Accepted</Badge>
                          )}
                        </div>
                      </div>

                      {/* {isAccepted && (
                        <Card className="bg-muted/40">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm">Upload Donation Report</CardTitle>
                            <CardDescription>PDF or image proof</CardDescription>
                          </CardHeader>

                          <CardContent>
                            <input
                              type="file"
                              accept="application/pdf,image/*"
                              onChange={(e) =>
                                handleFileUpload(request.id, e.target.files?.[0] || null)
                              }
                            />

                            {uploadedFile && (
                              <p className="text-xs mt-2">
                                Uploaded: <b>{uploadedFile.name}</b>
                              </p>
                            )}
                          </CardContent>
                        </Card>
                      )} */}

                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ProfileRow label="Blood Type" value={user.bloodType} />
              <ProfileRow label="Location" value={user.address} />
              <ProfileRow label="Status" value="Available" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- helpers ----------------------------- */

const StatCard = ({ title, value, icon: Icon, sub }: any) => (
  <Card>
    <CardHeader className="flex justify-between pb-2">
      <CardTitle className="text-sm">{title}</CardTitle>
      <Icon className="h-4 w-4 text-primary" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </CardContent>
  </Card>
);

const ProfileRow = ({ label, value }: any) => (
  <div className="flex justify-between text-sm">
    <span>{label}</span>
    <span className="text-muted-foreground">{value}</span>
  </div>
);
