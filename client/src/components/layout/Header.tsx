import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [location] = useLocation();

  // Define page titles for the different routes
  const getPageTitle = () => {
    const routes: Record<string, string> = {
      "/": "Dashboard",
      "/create-test": "Create New Test",
      "/market-analysis": "Market Analysis",
      "/test-results": "Test Results",
      "/reports": "Reports",
      "/model-operations": "Model Operations",
      "/settings": "Settings",
    };

    return routes[location] || "Not Found";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <h2 className="ml-3 text-lg font-semibold text-neutral-800 md:ml-0">
            {getPageTitle()}
          </h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              className="w-48 pl-10 pr-4 py-2"
            />
            <Search className="h-4 w-4 absolute left-3 top-3 text-neutral-400" />
          </div>
          <button className="p-2 rounded-full text-neutral-500 hover:text-neutral-600 hover:bg-neutral-100 focus:outline-none">
            <Bell className="h-5 w-5" />
          </button>
          <div className="flex items-center">
            <Avatar>
              <AvatarFallback className="bg-primary text-white">
                JD
              </AvatarFallback>
            </Avatar>
            <span className="ml-2 font-medium text-sm hidden md:block">
              John Doe
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
