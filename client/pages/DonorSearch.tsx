import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BloodCompatibilityChart from "@/components/BloodCompatibilityChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search,
  MapPin, 
  Clock, 
  Phone, 
  Filter,
  Users,
  Heart,
  CheckCircle,
  Star,
  Calendar,
  Award
} from "lucide-react";

import { getDonors } from "@/lib/users";



const bloodTypes = ["All", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const locations = ["All Locations", "Kathmandu", "Lalitpur", "Bhaktapur", "Other"];
const availabilityOptions = ["All", "available", "recently_donated", "unavailable"];

export default function DonorSearch() {
  const [donors, setDonors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bloodTypeFilter, setBloodTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All Locations");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [sortBy, setSortBy] = useState("distance");

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const data = await getDonors();
        setDonors(data);
      } catch (err) {
        console.error("Failed to fetch donors:", err);
      }
    };

    fetchDonors();
  }, []);

 const filteredDonors = donors
  .filter(donor => {
    if (!donor) return false; // Skip null/undefined donors

    const name = donor.name || ""; // fallback to empty string
    const location = donor.location || "";
    const bloodType = donor.bloodType || "";
    const availability = donor.availability || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBloodType =
      bloodTypeFilter === "All" || bloodType === bloodTypeFilter;

    const matchesLocation =
      locationFilter === "All Locations" ||
      location.toLowerCase().includes(locationFilter.toLowerCase());

    const matchesAvailability =
      availabilityFilter === "All" || availability === availabilityFilter;

    return matchesSearch && matchesBloodType && matchesLocation && matchesAvailability;
  })
  .sort((a, b) => {
    if (!a || !b) return 0; // handle null donors

    switch (sortBy) {
      case "distance":
        return (a.distance || 0) - (b.distance || 0);
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "donations":
        return (b.totalDonations || 0) - (a.totalDonations || 0);
      case "recent":
        return (
          new Date(b.joinedDate || 0).getTime() - new Date(a.joinedDate || 0).getTime()
        );
      default:
        return 0;
    }
  });

const getAvailabilityBadge = (availability?: string) => {
  switch (availability) {
    case "available":
      return <Badge className="bg-green-500">Available</Badge>;
    case "recently_donated":
      return <Badge className="bg-yellow-500">Recently Donated</Badge>;
    case "unavailable":
      return <Badge className="bg-red-500">Unavailable</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const getBloodTypeColor = (bloodType?: string) => {
  const colors: Record<string, string> = {
    "O-": "bg-red-500",
    "O+": "bg-red-400",
    "A-": "bg-blue-500",
    "A+": "bg-blue-400",
    "B-": "bg-green-500",
    "B+": "bg-green-400",
    "AB-": "bg-purple-500",
    "AB+": "bg-purple-400",
  };
  return bloodType ? colors[bloodType] || "bg-gray-400" : "bg-gray-400";
};


  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-brand-gray sm:text-5xl">
            Find Blood Donors
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Search for verified blood donors in your area
          </p>
        </div>

        <Tabs defaultValue="search" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search Donors
            </TabsTrigger>
            <TabsTrigger value="compatibility" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Compatibility Chart
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-6">
            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-primary" />
                  Search & Filter Donors
                </CardTitle>
                <CardDescription>
                  Use the filters below to find the most suitable donors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="search">Search by name or location</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search"
                        placeholder="Search donors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bloodType">Blood Type</Label>
                    <Select value={bloodTypeFilter} onValueChange={setBloodTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map(location => (
                          <SelectItem key={location} value={location}>{location}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {availabilityOptions.map(option => (
                          <SelectItem key={option} value={option}>
                            {option === "All" ? "All" : option.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sortBy">Sort by</Label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Distance</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="donations">Total Donations</SelectItem>
                        <SelectItem value="recent">Recently Joined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Found {filteredDonors.length} donors
              </h2>
              {filteredDonors.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  Sorted by {sortBy}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredDonors.map((donor) => (
                <Card key={donor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 rounded-full ${getBloodTypeColor(donor.bloodType)} flex items-center justify-center text-white font-bold`}>
                          {donor.bloodType}
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {donor.firstName+' '+donor.lastName}
                            {donor.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{donor.rating}</span>
                            <span className="text-sm text-muted-foreground">
                              ({donor.totalDonations||0} donations)
                            </span>
                          </div>
                        </div>
                      </div>
                      {getAvailabilityBadge('available')}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{donor.address}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{donor.address} </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span>Last: {donor.lastDonation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          Since {donor.createdAt?.toDate ? donor.createdAt.toDate().getFullYear() : "N/A"}
                        </span>

                      </div>
                    </div>

                    {donor.totalDonations > 20 && (
                      <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                        <Award className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-yellow-700 font-medium">
                          Gold Donor - {donor.totalDonations} donations
                        </span>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button className="flex-1" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDonors.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No donors found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or expanding your location radius
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setBloodTypeFilter("All");
                    setLocationFilter("All Locations");
                    setAvailabilityFilter("All");
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="compatibility">
            <BloodCompatibilityChart />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
