import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { parseCSVFile } from "@/lib/csvUtils";
import { MARKET_LEVELS, DATE_FREQUENCIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileProcessed: (data: any[], fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileProcessed }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [geoLevel, setGeoLevel] = useState<string>(MARKET_LEVELS[0]);
  const [dateFrequency, setDateFrequency] = useState<string>(DATE_FREQUENCIES[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const data = await parseCSVFile(file);
      onFileProcessed(data, file.name);
      toast({
        title: "File processed successfully",
        description: `${file.name} has been processed and loaded`,
      });
    } catch (error) {
      toast({
        title: "Error processing file",
        description: `${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Market Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div
              className={`border-2 border-dashed rounded-md p-6 ${
                file ? "border-primary" : "border-neutral-300"
              } hover:border-primary transition-colors text-center`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                {file ? (
                  <>
                    <FileText className="h-12 w-12 text-primary mb-2" />
                    <p className="text-sm font-medium text-neutral-700">{file.name}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="h-12 w-12 text-neutral-400 mb-2" />
                    <p className="text-sm font-medium text-neutral-700">
                      Drag & drop your CSV file here
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      or click to browse files
                    </p>
                  </>
                )}
              </div>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <Label
                htmlFor="file-upload"
                className="mt-4 inline-block py-2 px-4 bg-primary-50 text-primary rounded cursor-pointer hover:bg-primary-100 transition-colors"
              >
                Select File
              </Label>
            </div>
            
            {file && (
              <div className="flex justify-center mt-4">
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Processing..." : "Process Data"}
                </Button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="geo-level">Geographic Level</Label>
              <Select
                value={geoLevel}
                onValueChange={setGeoLevel}
              >
                <SelectTrigger id="geo-level">
                  <SelectValue placeholder="Select geographic level" />
                </SelectTrigger>
                <SelectContent>
                  {MARKET_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 mt-1">
                Select the geographic level of your market data
              </p>
            </div>
            
            <div>
              <Label htmlFor="date-frequency">Date Frequency</Label>
              <Select
                value={dateFrequency}
                onValueChange={setDateFrequency}
              >
                <SelectTrigger id="date-frequency">
                  <SelectValue placeholder="Select date frequency" />
                </SelectTrigger>
                <SelectContent>
                  {DATE_FREQUENCIES.map((frequency) => (
                    <SelectItem key={frequency} value={frequency}>
                      {frequency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-500 mt-1">
                Select the frequency of your time series data
              </p>
            </div>
            
            <div className="p-4 bg-amber-50 rounded-md border border-amber-200 mt-6">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-amber-800">CSV Format Requirements</h4>
                  <ul className="text-xs text-amber-700 mt-1 list-disc list-inside">
                    <li>File must be in CSV format</li>
                    <li>First row must contain column headers</li>
                    <li>Must include market names or identifiers</li>
                    <li>Numeric columns for metrics/KPIs</li>
                    <li>Date column (if time series data)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;