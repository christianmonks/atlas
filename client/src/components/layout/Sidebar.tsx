import React from "react";
import { Link, useLocation } from "wouter";
import {
  BarChart,
  PlusCircle,
  MapPin,
  LineChart,
  FileText,
  Cog,
  Code,
  SlidersHorizontal,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
}

interface NavLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, icon, children, isActive }) => {
  return (
    <Link href={href}>
      <div
        className={`flex items-center px-6 py-3 cursor-pointer ${
          isActive
            ? "text-white bg-primary-700"
            : "text-primary-200 hover:bg-primary-700 hover:text-white transition-colors"
        }`}
      >
        {icon}
        <span>{children}</span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const [location] = useLocation();

  const isActiveRoute = (route: string) => {
    return location === route;
  };

  return (
    <aside
      className={`sidebar bg-primary text-white w-64 flex-shrink-0 h-full overflow-y-auto transition-all duration-300 ${
        collapsed ? "md:w-64 w-0" : ""
      }`}
    >
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2L2 7L12 12L22 7L12 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 17L12 22L22 17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2 12L12 17L22 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold">Atlas</h1>
        </div>
        <p className="text-sm text-primary-200 mt-1">Matched Market Testing</p>
      </div>

      <nav className="mt-4">
        <div className="px-6 py-2 text-sm font-medium text-primary-300">
          Main Navigation
        </div>
        
        <NavLink 
          href="/" 
          icon={<BarChart className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/")}
        >
          Dashboard
        </NavLink>
        
        <NavLink 
          href="/create-test" 
          icon={<PlusCircle className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/create-test")}
        >
          Create New Test
        </NavLink>
        
        <NavLink 
          href="/market-analysis" 
          icon={<MapPin className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/market-analysis")}
        >
          Market Analysis
        </NavLink>
        
        <NavLink 
          href="/test-results" 
          icon={<LineChart className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/test-results")}
        >
          Test Results
        </NavLink>
        
        <NavLink 
          href="/reports" 
          icon={<FileText className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/reports")}
        >
          Reports
        </NavLink>

        <div className="px-6 py-2 mt-6 text-sm font-medium text-primary-300">
          Administration
        </div>
        
        <NavLink 
          href="/model-operations" 
          icon={<Cog className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/model-operations")}
        >
          Model Operations
        </NavLink>
        
        <NavLink 
          href="/model-development" 
          icon={<Code className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/model-development")}
        >
          Model Development
        </NavLink>
        
        <NavLink 
          href="/settings" 
          icon={<SlidersHorizontal className="w-5 h-5 mr-3" />} 
          isActive={isActiveRoute("/settings")}
        >
          Settings
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
