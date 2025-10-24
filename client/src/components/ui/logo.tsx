import logoImage from "@assets/whore_1749700835721.png";

interface LogoProps {
  className?: string;
  variant?: "transparent" | "colored";
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  category?: "female" | "male" | "trans";
  showTagline?: boolean;
}

export function Logo({ 
  className = "", 
  variant = "colored", 
  size = "md", 
  category = "female",
  showTagline = false 
}: LogoProps) {
  const sizeClasses = {
    sm: "h-10",
    md: "h-16",
    lg: "h-20",
    xl: "h-24",
    hero: "h-32"
  };

  const categoryGradients = {
    female: "from-pink-500 to-purple-600",
    male: "from-blue-600 to-indigo-700", 
    trans: "from-purple-500 to-pink-500"
  };

  const categoryTaglines = {
    female: "Premium Companions Delivered",
    male: "Elite Gentlemen On-Demand", 
    trans: "Beautiful Trans Companions"
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <img 
          src={logoImage} 
          alt="Whoredash" 
          className={`${sizeClasses[size]} w-auto object-contain drop-shadow-lg transition-transform hover:scale-105`}
        />
        {size === "hero" && (
          <div className={`absolute inset-0 bg-gradient-to-r ${categoryGradients[category]} opacity-20 rounded-lg animate-pulse`}></div>
        )}
      </div>
      
      {(showTagline || size === "hero") && (
        <div className="flex flex-col">
          <span className={`text-2xl md:text-4xl font-bold bg-gradient-to-r ${categoryGradients[category]} bg-clip-text text-transparent drop-shadow-sm`}>
            Whoredash
          </span>
          <span className="text-sm md:text-lg text-gray-600 font-medium">
            {categoryTaglines[category]}
          </span>
        </div>
      )}
    </div>
  );
}
