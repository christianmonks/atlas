import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Share2 } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  date: string;
  client: string;
  type: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, description, date, client, type }) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex h-10 w-10 rounded-full bg-primary-100 items-center justify-center">
            <FileText className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Date:</span>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Client:</span>
            <span className="font-medium">{client}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Type:</span>
            <span className="font-medium">{type}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const Reports: React.FC = () => {
  const reports = [
    {
      title: "TV Attribution Study Report",
      description: "Comprehensive analysis of TV campaign effectiveness",
      date: "Apr 12, 2023",
      client: "Global Media Inc.",
      type: "Test Results"
    },
    {
      title: "Q1 Matched Market Analysis",
      description: "Summary of matched market tests for Q1 2023",
      date: "Mar 30, 2023",
      client: "Acme Corporation",
      type: "Quarterly Report"
    },
    {
      title: "Social Media Incrementality",
      description: "Detailed incrementality analysis for social campaigns",
      date: "Feb 15, 2023",
      client: "Tech Innovators Ltd.",
      type: "Channel Analysis"
    },
    {
      title: "Regional Market Pairing",
      description: "Analysis of market pairs for regional campaign planning",
      date: "Jan 22, 2023",
      client: "Global Media Inc.",
      type: "Planning"
    },
    {
      title: "Annual MMT Performance",
      description: "Year-end summary of all matched market testing",
      date: "Dec 15, 2022",
      client: "Various",
      type: "Annual Report"
    },
    {
      title: "Display Campaign Efficiency",
      description: "Efficiency analysis for display advertising",
      date: "Nov 10, 2022",
      client: "Acme Corporation",
      type: "Channel Analysis"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <div className="flex space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
            <Input className="pl-10" placeholder="Search reports..." />
          </div>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate New Report
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reports.map((report, index) => (
          <ReportCard
            key={index}
            title={report.title}
            description={report.description}
            date={report.date}
            client={report.client}
            type={report.type}
          />
        ))}
      </div>
    </div>
  );
};

export default Reports;
