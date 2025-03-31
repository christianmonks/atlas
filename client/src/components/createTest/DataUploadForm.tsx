import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

interface DataUploadFormProps {
  onFileChange: (file: File | null) => void;
  geoLevel: string;
  onGeoLevelChange: (value: string) => void;
  dateFrequency: string;
  onDateFrequencyChange: (value: string) => void;
}

const DataUploadForm: React.FC<DataUploadFormProps> = ({
  onFileChange,
  geoLevel,
  onGeoLevelChange,
  dateFrequency,
  onDateFrequencyChange,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileChange(file);
    }
  };

  return (
    <>
      <div>
        <h4 className="text-base font-medium text-neutral-800 mb-2">Data Upload</h4>
        <div
          className={`border-2 ${
            dragActive ? "border-primary" : "border-dashed border-neutral-300"
          } rounded-lg p-6 text-center`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          <div className="mx-auto h-12 w-12 text-neutral-400">
            <UploadCloud className="h-12 w-12 mx-auto" />
          </div>
          <div className="mt-4 flex text-sm text-neutral-600 justify-center">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-600"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={handleFileChange}
                accept=".csv,.xlsx,.xls"
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {fileName ? (
            <p className="text-sm text-neutral-800 mt-2">Selected: {fileName}</p>
          ) : (
            <p className="text-xs text-neutral-500 mt-2">
              CSV or Excel files with daily/weekly sales data by geo
            </p>
          )}
        </div>
      </div>

      <div>
        <h4 className="text-base font-medium text-neutral-800 mb-2">Data Structure</h4>
        <div className="bg-neutral-50 p-4 rounded-lg">
          <div className="mb-4">
            <p className="text-sm text-neutral-600 mb-2">
              What level of geo-granularity is your data?
            </p>
            <div className="flex items-center space-x-4">
              {["DMA", "State", "Zip Code", "Other"].map((level) => (
                <label key={level} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="geo-level"
                    className="form-radio text-primary"
                    checked={geoLevel === level}
                    onChange={() => onGeoLevelChange(level)}
                  />
                  <span className="ml-2 text-sm text-neutral-700">{level}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm text-neutral-600 mb-2">
              What is your date frequency?
            </p>
            <div className="flex items-center space-x-4">
              {["Daily", "Weekly", "Monthly"].map((frequency) => (
                <label key={frequency} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="date-freq"
                    className="form-radio text-primary"
                    checked={dateFrequency === frequency}
                    onChange={() => onDateFrequencyChange(frequency)}
                  />
                  <span className="ml-2 text-sm text-neutral-700">{frequency}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataUploadForm;
