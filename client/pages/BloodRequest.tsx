import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  MapPin, 
  Clock, 
  Phone, 
  AlertTriangle,
  Users,
  Heart,
  CheckCircle,
  Search
} from "lucide-react";
import { Link ,useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseConfig";
import { createBloodRequest } from "@/lib/bloodRequest.ts";
import { searchDonnerforRequest } from "@/lib/users.ts";

interface FormData {
  patientName: string;
  bloodType: string;
  unitsNeeded: number;
  urgency: number;
  hospital: string;
  contactPerson: string;
  phoneNumber: string;
  alternatePhone: string;
  location: string;
  medicalCondition: string;
  additionalNotes: string;
}

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const urgencyLevels = [
  { value: 1, label: "Critical (within 2 hours)", color: "bg-red-500" },
  { value: 2, label: "Urgent (within 6 hours)", color: "bg-orange-500" },
  { value: 3, label: "Moderate (within 24 hours)", color: "bg-yellow-500" },
  { value: 4, label: "Routine (within 3 days)", color: "bg-green-500" }
];

const mockDonors = [
  { id: 1, name: "Ram Sharma", distance: "2.1 km", lastDonation: "3 months ago", verified: true },
  { id: 2, name: "Sita Gurung", distance: "3.8 km", lastDonation: "4 months ago", verified: true },
  { id: 3, name: "Krishna Thapa", distance: "5.2 km", lastDonation: "2 months ago", verified: true },
  { id: 4, name: "Maya Shrestha", distance: "7.1 km", lastDonation: "5 months ago", verified: true },
];

export default function BloodRequest() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bloodRequest, setBloodRequest] = useState<any>(null);
  const [donorsFound,setDonorsFound] = useState <any>(null);
  const [formData, setFormData] = useState<FormData>({
    patientName: "",
    bloodType: "",
    unitsNeeded: 0,
    urgency: 0,
    hospital: "",
    contactPerson: "",
    phoneNumber: "",
    alternatePhone: "",
    location: "",
    medicalCondition: "",
    additionalNotes: ""
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showDonors, setShowDonors] = useState(!!id);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;
  useEffect(() => {
    setShowDonors(!!id);
    if (!id) return; 
    const fetchRequest = async () => {
      try {
        const requestDocRef = doc(db, "bloodRequests", id);
        const requestDocSnap = await getDoc(requestDocRef);

        if (requestDocSnap.exists()) {
          const requestData = requestDocSnap.data();
          setBloodRequest(requestData);
          const donors=await searchDonnerforRequest(requestData.bloodType);
          setDonorsFound(donors);
          console.log(donorsFound);
          
        } else {
          console.error("No such request!");
        }
      } catch (error) {
        console.error("Error fetching request:", error);
      }
    };

    fetchRequest();
  }, [id]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: field === "urgency" || field === "unitsNeeded" ? Number(value) : value, }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const submitRequest = async () => {
    // Here you would typically submit to your backend
    console.log("Submitting blood request:", formData);
    const request= await createBloodRequest(formData);
    if(request.success){
      toast.success(request.message);
      navigate(`/request/${request.id}`);
      
      // setShowDonors(true);
    }else{
      toast.error("Request submission failed");
    }
  };

  const getUrgencyColor = (urgency: number) => {
    const level = urgencyLevels.find(l => l.value === urgency);
    return level?.color || "bg-gray-500";
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.patientName && formData.bloodType && formData.unitsNeeded && formData.urgency;
      case 2:
        return formData.hospital && formData.contactPerson && formData.phoneNumber && formData.location;
      case 3:
        return formData.medicalCondition;
      default:
        return false;
    }
  };

  if (showDonors) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-brand-gray">Request Submitted Successfully!</h1>
            <p className="text-muted-foreground mt-2">
              We've found {donorsFound?donorsFound.length:0} potential donors in your area
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Patient:</span>
                  <span className="font-medium">{bloodRequest?bloodRequest.patientName: ""}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Blood Type:</span>
                  <Badge variant="outline" className="text-primary border-primary">
                    {bloodRequest?bloodRequest.bloodType: ""}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Units Needed:</span>
                  <span className="font-medium">{bloodRequest?bloodRequest.unitsNeeded : ""} units</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Urgency:</span>
                  <Badge className={bloodRequest?getUrgencyColor(bloodRequest.urgency): "bg-gray-500"}>
                    {bloodRequest?urgencyLevels.find(l => l.value === bloodRequest.urgency)?.label.split('(')[0].trim() : ""}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hospital:</span>
                  <span className="font-medium">{bloodRequest?bloodRequest.hospital : ""}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Location:</span>
                  <span className="font-medium">{bloodRequest?bloodRequest.location : ""}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  <span className="font-medium">{bloodRequest?bloodRequest.status.toUpperCase(): ""}</span>
                </div>
              </CardContent>
            </Card>

            {/* Available Donors */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Available Donors
                </CardTitle>
                <CardDescription>
                  Donors have been notified automatically
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {donorsFound&&donorsFound.length>0 ?( 
                  donorsFound.map((donor) => (
                    <div key={donor.uid} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{donor.firstName+" "+donor.lastName}</span>
                          
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <Badge variant="outline" className="text-primary border-primary">
                            {donor.bloodType || ""}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {donor.address}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {donor.lastDonation || "No donation history"}
                          </span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Phone className="h-4 w-4 mr-1" />
                        Contact
                      </Button>
                    </div>
                  ))
                ):(
                  <p className="text-center text-muted-foreground mt-4">
                    No donor available at the moment.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground mb-4">
              You'll receive notifications as donors respond to your request
            </p>
            <Button variant="outline" onClick={() => {setShowDonors(false); navigate("/request");}}>
              Submit Another Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-brand-gray sm:text-5xl">
            Request Blood
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Fill out the form below to connect with verified donors in your area
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <Heart className="h-5 w-5 text-primary" />}
                {currentStep === 2 && <MapPin className="h-5 w-5 text-primary" />}
                {currentStep === 3 && <AlertTriangle className="h-5 w-5 text-primary" />}
                {currentStep === 1 && "Patient & Blood Information"}
                {currentStep === 2 && "Contact & Location Details"}
                {currentStep === 3 && "Medical Information"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Basic information about the patient and blood requirements"}
                {currentStep === 2 && "How we can reach you and where the blood is needed"}
                {currentStep === 3 && "Medical details to help donors understand the situation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Patient & Blood Info */}
              {currentStep === 1 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="patientName">Patient Name *</Label>
                    <Input
                      id="patientName"
                      value={formData.patientName}
                      onChange={(e) => handleInputChange("patientName", e.target.value)}
                      placeholder="Full name of the patient"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bloodType">Blood Type *</Label>
                      <Select onValueChange={(value) => handleInputChange("bloodType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood type" />
                        </SelectTrigger>
                        <SelectContent>
                          {bloodTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="unitsNeeded">Units Needed *</Label>
                      <Select onValueChange={(value) => handleInputChange("unitsNeeded", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How many units?" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((unit) => (
                            <SelectItem key={unit} value={unit.toString()}>
                              {unit} unit{unit > 1 ? 's' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="urgency">Urgency Level *</Label>
                    <Select onValueChange={(value) => handleInputChange("urgency", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How urgent is this request?" />
                      </SelectTrigger>
                      <SelectContent>
                        {urgencyLevels.map((level) => (
                          <SelectItem key={level.value} value={level.value.toString()}>
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${level.color}`} />
                              {level.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {/* Step 2: Contact & Location */}
              {currentStep === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital/Medical Center *</Label>
                    <Input
                      id="hospital"
                      value={formData.hospital}
                      onChange={(e) => handleInputChange("hospital", e.target.value)}
                      placeholder="Name of hospital or medical center"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      placeholder="Person to contact (family member, friend, etc.)"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="alternatePhone">Alternate Phone</Label>
                      <Input
                        id="alternatePhone"
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                        placeholder="+977 98XXXXXXXX"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="City, District (e.g., Kathmandu, Bagmati)"
                    />
                  </div>
                </>
              )}

              {/* Step 3: Medical Information */}
              {currentStep === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="medicalCondition">Medical Condition *</Label>
                    <Select onValueChange={(value) => handleInputChange("medicalCondition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the medical condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="surgery">Surgery</SelectItem>
                        <SelectItem value="accident">Accident/Trauma</SelectItem>
                        <SelectItem value="cancer">Cancer Treatment</SelectItem>
                        <SelectItem value="anemia">Severe Anemia</SelectItem>
                        <SelectItem value="childbirth">Childbirth Complications</SelectItem>
                        <SelectItem value="organ-transplant">Organ Transplant</SelectItem>
                        <SelectItem value="bleeding-disorder">Bleeding Disorder</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalNotes">Additional Notes</Label>
                    <Textarea
                      id="additionalNotes"
                      value={formData.additionalNotes}
                      onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                      placeholder="Any additional information that might help donors (optional)"
                      rows={4}
                    />
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-800">Important Note</p>
                        <p className="text-yellow-700 mt-1">
                          All information will be verified before connecting with donors. 
                          False or misleading information may result in account suspension.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button
                    onClick={submitRequest}
                    disabled={!isStepValid()}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Donors
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
