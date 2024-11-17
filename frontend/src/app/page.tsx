"use client";

import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const Home = () => {
  const carImages = [
    "/car1.svg",  // Replace with your actual image paths
    "/car2.svg",
    "/car3.svg",
    "/car4.svg",
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Text Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Manage Your Car Fleet with Ease
            </h1>
            <p className="text-lg text-gray-600">
              Experience seamless car management with our powerful platform. 
              Track maintenance, monitor performance, and optimize your fleet operations.
            </p>
            <div className="flex gap-4">
              <Button size="lg">Get Started</Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div>
                <h3 className="text-3xl font-bold">1000+</h3>
                <p className="text-gray-600">Cars Managed</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">500+</h3>
                <p className="text-gray-600">Happy Clients</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="text-gray-600">Support</p>
                
              </div>
            </div>
          </div>

          {/* Right side - Carousel */}
          <div className="relative">
            <Carousel className="w-full"
             plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            >
              <CarouselContent>
                {carImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
                      <Image
                        src={image}
                        alt={`Car ${index + 1}`}
                        fill
                        className="object-cover"
                        priority={index === 0}
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {/* <CarouselPrevious /> */}
              {/* <CarouselNext /> */}
            </Carousel>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your vehicles in real-time with advanced GPS tracking and analytics.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Maintenance Alerts</h3>
              <p className="text-gray-600">
                Stay on top of vehicle maintenance with automated service reminders.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Cost Management</h3>
              <p className="text-gray-600">
                Optimize expenses with detailed cost tracking and analysis tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;