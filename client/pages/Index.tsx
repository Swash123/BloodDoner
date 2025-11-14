import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";
import { Heart, MapPin, Bell, Shield, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "@/firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getCompatibleRecipients } from "@/lib/bloodCompatibility";

export default function Index() {
  //
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  //
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-accent/20 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pt-32 lg:pb-28">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-brand-gray sm:text-5xl lg:text-6xl animate-fadeIn">
                Save Lives with <span className="text-primary animate-pulse">SahayogRed</span>
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground sm:text-xl animate-fadeIn animation-delay-300">
                Connect blood donors with those in need across Nepal. Real-time
                notifications, verified donors, and emergency response system
                all in one platform.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center animate-fadeIn animation-delay-600">
                <Button size="lg" asChild className="text-lg px-8 py-3 hover:scale-105 transition-transform">
                  <Link to="/register">Become a Donor</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-lg px-8 py-3 hover:scale-105 transition-transform"
                >
                  <Link to="/request">Request Blood</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl">
            <div
              className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary/10 to-primary/5 opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gray sm:text-4xl">
              How SahayogRed Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A simple, efficient way to connect blood donors with those in need
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>Register as Donor</CardTitle>
                <CardDescription>
                  Sign up and create your verified donor profile with blood type
                  and location information.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Bell className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>Get Notified</CardTitle>
                <CardDescription>
                  Receive real-time notifications when someone nearby needs your
                  blood type.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="relative overflow-hidden hover:shadow-lg hover:-translate-y-2 transition-all duration-300 group cursor-pointer">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Heart className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <CardTitle>Save Lives</CardTitle>
                <CardDescription>
                  Connect directly with those in need and help save lives in
                  your community.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-20 bg-accent/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gray sm:text-4xl">
              Making a Difference in Nepal
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of verified donors already saving lives
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">1,500+</div>
              <div className="mt-2 text-lg font-medium text-brand-gray">
                Registered Donors
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Across all blood types
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">250+</div>
              <div className="mt-2 text-lg font-medium text-brand-gray">
                Lives Saved
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Through our platform
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">75+</div>
              <div className="mt-2 text-lg font-medium text-brand-gray">
                Partner Hospitals
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Across Nepal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-brand-gray sm:text-4xl">
              Why Choose SahayogRed?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for Nepal, by Nepalis, with safety and efficiency in mind
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Location-Based Matching</CardTitle>
                </div>
                <CardDescription>
                  Our smart algorithm connects you with the nearest donors or
                  recipients, reducing response time during emergencies.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Verified Donors</CardTitle>
                </div>
                <CardDescription>
                  All donors go through a verification process to ensure safety
                  and reliability for both donors and recipients.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Real-Time Notifications</CardTitle>
                </div>
                <CardDescription>
                  Get instant notifications when blood is needed in your area,
                  enabling rapid response during critical situations.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle>Donation History</CardTitle>
                </div>
                <CardDescription>
                  Track your donation history and see the impact you've made in
                  your community over time.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-primary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
              Ready to Save Lives?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/90">
              Join SahayogRed today and become part of Nepal's life-saving
              community.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                asChild
                className="text-lg px-8 py-3"
              >
                <Link to="/register">Sign Up Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-lg px-8 py-3 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/login">Already a Member?</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-gray text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
                  <Heart className="h-5 w-5 text-primary-foreground fill-current" />
                </div>
                <span className="text-xl font-bold">SahayogRed</span>
              </div>
              <p className="text-primary-foreground/80 mb-4">
                Connecting blood donors with those in need across Nepal.
                Together, we save lives.
              </p>
              <p className="text-sm text-primary-foreground/60">
                © 2024 SahayogRed. All rights reserved.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link
                    to="/how-it-works"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                <li>
                  <Link
                    to="/help"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    to="/emergency"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Emergency
                  </Link>
                </li>
                <li>
                  <Link
                    to="/hospitals"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    For Hospitals
                  </Link>
                </li>
                <li>
                  <Link
                    to="/donate"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Make a Donation
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
