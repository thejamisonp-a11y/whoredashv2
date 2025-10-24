import { TrendingUp, Users, Star, Eye, DollarSign, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface CompanionInfoProps {
  category?: "female" | "male" | "trans";
}

export function CompanionInfo({ category = "female" }: CompanionInfoProps) {
  const categoryInfo = {
    female: {
      title: "Start Earning as a Premium Companion",
      subtitle: "Join 10,000+ verified companions earning top rates",
      averageEarnings: "$3,500",
      topEarning: "$12,000",
      bookingRate: "85%",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200"
    },
    male: {
      title: "Become an Elite Gentleman Companion", 
      subtitle: "Join 5,000+ verified male companions in high demand",
      averageEarnings: "$2,800",
      topEarning: "$9,500",
      bookingRate: "78%",
      color: "text-blue-600",
      bgColor: "bg-blue-50", 
      borderColor: "border-blue-200"
    },
    trans: {
      title: "Showcase Your Beauty as a Trans Companion",
      subtitle: "Join 3,000+ verified trans companions with premium rates",
      averageEarnings: "$4,200",
      topEarning: "$15,000", 
      bookingRate: "92%",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    }
  };

  const info = categoryInfo[category];

  return (
    <Card className={`p-8 ${info.bgColor} ${info.borderColor} border-2`}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {info.title}
        </h2>
        <p className="text-lg text-gray-600">
          {info.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <DollarSign className={`w-8 h-8 ${info.color} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${info.color} mb-1`}>
            {info.averageEarnings}
          </div>
          <div className="text-sm text-gray-600">Average Monthly</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <TrendingUp className={`w-8 h-8 ${info.color} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${info.color} mb-1`}>
            {info.topEarning}
          </div>
          <div className="text-sm text-gray-600">Top Earners</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-xl shadow-sm">
          <Star className={`w-8 h-8 ${info.color} mx-auto mb-2`} />
          <div className={`text-2xl font-bold ${info.color} mb-1`}>
            {info.bookingRate}
          </div>
          <div className="text-sm text-gray-600">Booking Rate</div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <h3 className="text-xl font-semibold text-gray-900">What You Get:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">Instant bookings & payments</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">24/7 safety support & monitoring</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">Professional photo shoots</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">Marketing & promotion tools</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">Weekly payouts via direct deposit</span>
          </div>
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 ${info.color.replace('text-', 'bg-')} rounded-full`}></div>
            <span className="text-gray-700">Flexible scheduling & location control</span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-4">
        <Button 
          size="lg" 
          className={`w-full md:w-auto px-8 py-4 text-lg font-semibold ${
            category === 'female' ? 'bg-pink-600 hover:bg-pink-700' :
            category === 'male' ? 'bg-blue-600 hover:bg-blue-700' :
            'bg-purple-600 hover:bg-purple-700'
          } text-white`}
        >
          Start Your Application
        </Button>
        
        <div className="text-sm text-gray-600">
          Quick approval process • Background check included • Start earning in 48 hours
        </div>
      </div>
    </Card>
  );
}