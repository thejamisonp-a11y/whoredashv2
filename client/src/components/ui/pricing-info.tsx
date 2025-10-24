import { DollarSign, Clock, Shield, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingInfoProps {
  category?: "female" | "male" | "trans";
}

export function PricingInfo({ category = "female" }: PricingInfoProps) {
  const categoryInfo = {
    female: {
      baseRate: "$200-800",
      averageRate: "$350",
      bookingFee: "$25",
      serviceFee: "15%",
      color: "text-pink-600"
    },
    male: {
      baseRate: "$150-600", 
      averageRate: "$275",
      bookingFee: "$20",
      serviceFee: "12%",
      color: "text-blue-600"
    },
    trans: {
      baseRate: "$250-900",
      averageRate: "$400", 
      bookingFee: "$30",
      serviceFee: "18%",
      color: "text-purple-600"
    }
  };

  const info = categoryInfo[category];

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <DollarSign className={`w-6 h-6 ${info.color}`} />
        <h3 className="text-xl font-bold text-gray-900">Transparent Pricing</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className={`text-2xl font-bold ${info.color} mb-1`}>
            {info.baseRate}
          </div>
          <div className="text-sm text-gray-600">Per Hour Range</div>
        </div>
        
        <div className="text-center p-4 bg-white rounded-lg border">
          <div className={`text-2xl font-bold ${info.color} mb-1`}>
            {info.averageRate}
          </div>
          <div className="text-sm text-gray-600">Average Rate</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Booking Fee</span>
          <Badge variant="outline" className={`${info.color} border-current`}>
            {info.bookingFee}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Platform Service Fee</span>
          <Badge variant="outline" className={`${info.color} border-current`}>
            {info.serviceFee}
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Payment Processing</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Free
          </Badge>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span>Secure payment processing</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>Free cancellation up to 30 min before</span>
        </div>
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500" />
          <span>100% verified companions</span>
        </div>
      </div>
    </Card>
  );
}