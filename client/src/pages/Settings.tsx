import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { User, Bell, Shield, LockKeyhole, Users, Globe, Database } from "lucide-react";

const Settings: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");

  // Mock settings state - in a real app, these would be fetched from the API
  const [profileSettings, setProfileSettings] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    jobTitle: "Media Analyst",
    company: "Media Agency XYZ",
    phone: "(123) 456-7890"
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    testCompletions: true,
    weeklyReports: true,
    marketUpdates: false,
    systemAlerts: true
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileSettings({
      ...profileSettings,
      [id]: value
    });
  };

  const handleNotificationToggle = (setting: keyof typeof notificationSettings) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting]
    });
  };

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved."
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification Preferences Updated",
      description: "Your notification settings have been saved."
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-2">
              <NavItem
                icon={<User className="h-5 w-5" />}
                title="Profile"
                isActive={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<Bell className="h-5 w-5" />}
                title="Notifications"
                isActive={activeTab === "notifications"}
                onClick={() => setActiveTab("notifications")}
              />
              <NavItem
                icon={<Shield className="h-5 w-5" />}
                title="Security"
                isActive={activeTab === "security"}
                onClick={() => setActiveTab("security")}
              />
              <NavItem
                icon={<Users className="h-5 w-5" />}
                title="Team"
                isActive={activeTab === "team"}
                onClick={() => setActiveTab("team")}
              />
              <NavItem
                icon={<Globe className="h-5 w-5" />}
                title="API Access"
                isActive={activeTab === "api"}
                onClick={() => setActiveTab("api")}
              />
              <NavItem
                icon={<Database className="h-5 w-5" />}
                title="Data Management"
                isActive={activeTab === "data"}
                onClick={() => setActiveTab("data")}
              />
            </nav>
          </CardContent>
        </Card>
        
        <div className="lg:col-span-3">
          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={profileSettings.name}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={profileSettings.email}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      value={profileSettings.jobTitle}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input 
                      id="company" 
                      value={profileSettings.company}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={profileSettings.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Customize how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-neutral-500">Receive email notifications</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Types</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Test completions</p>
                          <p className="text-xs text-neutral-500">Notifications when tests are completed</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.testCompletions} 
                          onCheckedChange={() => handleNotificationToggle("testCompletions")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Weekly reports</p>
                          <p className="text-xs text-neutral-500">Weekly summary of test performance</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.weeklyReports} 
                          onCheckedChange={() => handleNotificationToggle("weeklyReports")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Market updates</p>
                          <p className="text-xs text-neutral-500">Updates about new market data</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketUpdates} 
                          onCheckedChange={() => handleNotificationToggle("marketUpdates")}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">System alerts</p>
                          <p className="text-xs text-neutral-500">Important system notifications</p>
                        </div>
                        <Switch 
                          checked={notificationSettings.systemAlerts} 
                          onCheckedChange={() => handleNotificationToggle("systemAlerts")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Change Password</h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Two-factor Authentication</h4>
                  <p className="text-sm text-neutral-500">Add an extra layer of security to your account</p>
                  <Button variant="outline" className="flex items-center">
                    <LockKeyhole className="mr-2 h-4 w-4" />
                    Enable Two-factor Authentication
                  </Button>
                </div>
                
                <div className="flex justify-end">
                  <Button className="w-full md:w-auto">Save Security Settings</Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {(activeTab === "team" || activeTab === "api" || activeTab === "data") && (
            <Card>
              <CardHeader>
                <CardTitle>{getTabTitle(activeTab)}</CardTitle>
                <CardDescription>{getTabDescription(activeTab)}</CardDescription>
              </CardHeader>
              <CardContent className="py-12 text-center">
                <p className="text-neutral-600 mb-6">
                  This section would be implemented in a full version of the application.
                </p>
                <p className="text-sm text-neutral-500">
                  The {getTabTitle(activeTab).toLowerCase()} settings would allow you to manage {getTabSettingsDescription(activeTab)}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, title, isActive, onClick }) => {
  return (
    <button
      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left text-sm ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-neutral-600 hover:bg-neutral-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{title}</span>
    </button>
  );
};

const getTabTitle = (tab: string): string => {
  switch (tab) {
    case "profile":
      return "Profile Settings";
    case "notifications":
      return "Notification Preferences";
    case "security":
      return "Security Settings";
    case "team":
      return "Team Management";
    case "api":
      return "API Access";
    case "data":
      return "Data Management";
    default:
      return "Settings";
  }
};

const getTabDescription = (tab: string): string => {
  switch (tab) {
    case "profile":
      return "Manage your personal information";
    case "notifications":
      return "Customize how you receive notifications";
    case "security":
      return "Manage your account security";
    case "team":
      return "Manage team members and permissions";
    case "api":
      return "Configure API access and generate keys";
    case "data":
      return "Manage your data storage and exports";
    default:
      return "";
  }
};

const getTabSettingsDescription = (tab: string): string => {
  switch (tab) {
    case "team":
      return "team members, roles, and access permissions";
    case "api":
      return "API keys, rate limits, and access levels";
    case "data":
      return "data retention, export settings, and storage options";
    default:
      return "";
  }
};

export default Settings;
