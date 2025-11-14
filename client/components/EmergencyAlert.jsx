import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  X, 
  Clock,
  MapPin,
  Heart,
  Phone
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { getUrgencyHeader } from "@/lib/bloodRequest.ts"

const mockEmergencyRequests = [
  {
    id: "emr-001",
    bloodType: "O-",
    location: "Teaching Hospital, Kathmandu",
    urgency: 1,
    timePosted: "15 minutes ago",
    unitsNeeded: 2,
    hospital: "Tribhuvan University Teaching Hospital",
    contactNumber: "+977 1-4200-100"
  },
  {
    id: "emr-002", 
    bloodType: "AB+",
    location: "Patan Hospital, Lalitpur",
    urgency: 3,
    timePosted: "32 minutes ago",
    unitsNeeded: 1,
    hospital: "Patan Academy of Health Sciences",
    contactNumber: "+977 1-5522-266"
  }
  ,
  {
    id: "emr-002", 
    bloodType: "AB+",
    location: "Patan Hospital, Lalitpur",
    urgency: 4,
    timePosted: "32 minutes ago",
    unitsNeeded: 1,
    hospital: "Patan Academy of Health Sciences",
    contactNumber: "+977 1-5522-266"
  }
];

export default function EmergencyAlert() {
  const [isVisible, setIsVisible] = useState(true);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);
  const [emergencyRequests, setEmergencyRequests] = useState([]);
  useEffect(() => {
    const fetchUrgencyData = async () => {
      try {
        const data = await getUrgencyHeader(); // Assume this function fetches the data
        setEmergencyRequests(data); // Store the result in the state
      } catch (error) {
        console.error("Error fetching urgency data:", error);
      }
    };

    fetchUrgencyData();
  }, []);
  const handleDotClick = (index) => {
    console.log("Clicked on dot", index);
    if (index !== currentRequestIndex) {
      setCurrentRequestIndex(index);
    }
  };

  // Rotate between emergency requests every 8 seconds
  useEffect(() => {
    if (emergencyRequests.length > 0) {
      const interval = setInterval(() => {
        setCurrentRequestIndex((prev) => (prev + 1) % emergencyRequests.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [emergencyRequests.length]);

  // Auto-hide after 30 seconds unless user interacts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(prev => !prev);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isVisible || emergencyRequests.length === 0) return null;

  const currentRequest = emergencyRequests[currentRequestIndex];
  const urgencyColor = currentRequest.urgency === 1 ? "bg-red-500" : currentRequest.urgency === 2 ? "bg-orange-500" : currentRequest.urgency === 3 ? "bg-yellow-500" : "bg-green-500";
  const urgencyTextColor = currentRequest.urgency === 1 ? "text-red-700" : currentRequest.urgency === 2 ? "text-orange-700" : currentRequest.urgency === 3 ? "text-yellow-700" : "text-green-700";
  const urgencyBgColor = currentRequest.urgency === 1 ? "bg-red-50" : currentRequest.urgency === 2 ? "bg-orange-50" : currentRequest.urgency === 3 ? "bg-yellow-50" : "bg-green-50";
  const urgencyBorderColor = currentRequest.urgency === 1 ? "border-red-200" : currentRequest.urgency === 2 ? "border-orange-200" : currentRequest.urgency === 3 ? "border-yellow-200" : "border-green-200";

  return (
    <div className={`relative ${urgencyBgColor} ${urgencyBorderColor} border-b-2 shadow-sm`}>
      {/* Animated pulse for critical alerts */}
      {currentRequest.urgency === 1 && (
        <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse"></div>
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${urgencyColor} animate-pulse`}>
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <Badge className={urgencyColor}>
                    {currentRequest.urgency === 1 ? "CRITICAL" : currentRequest.urgency === 2 ? "URGENT":currentRequest.urgency === 3 ? "MODERATE":"ROUTINE"}
                  </Badge>
                  <span className={`text-sm font-medium ${urgencyTextColor}`}>
                    Blood Needed Now
                  </span>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-1">
                <Heart className={`h-4 w-4 ${urgencyTextColor}`} />
                <span className={`font-bold ${urgencyTextColor}`}>
                  {currentRequest.bloodType}
                </span>
                <span className="text-gray-600">
                  ({currentRequest.unitsNeeded} unit{currentRequest.unitsNeeded > 1 ? 's' : ''})
                </span>
              </div>
              
              <div className="flex items-center space-x-1">
                <MapPin className={`h-4 w-4 ${urgencyTextColor}`} />
                <span className="text-gray-600">{currentRequest.location}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className={`h-4 w-4 ${urgencyTextColor}`} />
                <span className="text-gray-600">{formatDistanceToNow(currentRequest.createdAt.toDate(), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick action buttons */}
            <div className="hidden md:flex items-center space-x-2">
              <a href={`tel:${currentRequest.contactNumber}`}>
                <Button 
                  size="sm" 
                  className={`${urgencyColor} hover:opacity-90`}
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call Now
                </Button>
              </a>
              <Button size="sm" variant="outline" asChild>
                <Link to="/request">
                  <Heart className="h-4 w-4 mr-1" />
                  Help
                </Link>
              </Button>
            </div>

            {/* Mobile action button */}
            <div className="md:hidden">
              <a href={`tel:${currentRequest.contactNumber}`}>
                <Button size="sm" className={`${urgencyColor} hover:opacity-90`}>
                  <Phone className="h-4 w-4" />
                </Button>
              </a>
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className={`p-1 rounded-full hover:bg-gray-200 ${urgencyTextColor}`}
              aria-label="Close alert"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile details */}
        <div className="sm:hidden pb-3 space-y-2 text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Heart className={`h-4 w-4 ${urgencyTextColor}`} />
              <span className={`font-bold ${urgencyTextColor}`}>
                {currentRequest.bloodType}
              </span>
              <span className="text-gray-600">
                ({currentRequest.unitsNeeded} unit{currentRequest.unitsNeeded > 1 ? 's' : ''})
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className={`h-4 w-4 ${urgencyTextColor}`} />
              <span className="text-gray-600">{currentRequest.timePosted}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className={`h-4 w-4 ${urgencyTextColor}`} />
            <span className="text-gray-600">{currentRequest.location}</span>
          </div>
        </div>

        {/* Progress indicator for multiple requests */}
        {emergencyRequests.length > 1 && (
          <div className="flex justify-center pb-2">
            <div className="flex space-x-2">
              {emergencyRequests.map((_, index) => (
                <div
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentRequestIndex ? urgencyColor : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
