import { Link } from "wouter";
import { Twitter, Instagram, Linkedin, ShieldCheck, EyeOff, Clock } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const footerSections = [
    {
      title: "For Clients",
      links: [
        { name: "Browse Directory", href: "/browse" },
        { name: "How It Works", href: "/#how-it-works" },
        { name: "Pricing", href: "/pricing" },
        { name: "Safety & Verification", href: "/safety" },
      ],
    },
    {
      title: "For Companions",
      links: [
        { name: "Join Our Platform", href: "/join" },
        { name: "Companion Resources", href: "/resources" },
        { name: "Verification Process", href: "/verification" },
        { name: "Earnings Guide", href: "/earnings" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Contact Us", href: "/contact" },
        { name: "FAQ", href: "/faq" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1">
            <div className="mb-4">
              <Logo variant="transparent" size="md" className="text-white" />
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Premium lifestyle companion booking platform connecting verified professionals with discerning clients.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-pink transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-pink transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-pink transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-heading font-semibold text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Whoredash. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span className="flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-green-400" />
                SSL Secured
              </span>
              <span className="flex items-center">
                <EyeOff className="w-4 h-4 mr-2 text-blue-400" />
                100% Discreet
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-brand-pink" />
                24/7 Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
