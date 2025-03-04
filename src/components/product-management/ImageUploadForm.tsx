"use client";

import React from "react";
import { Upload, Trash2 } from "lucide-react";

interface ImageUploadFormProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const ImageUploadForm: React.FC<ImageUploadFormProps> = ({
  selectedFiles,
  setSelectedFiles,
  onSubmit,
  loading,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium">Product Images</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium">Selected Files:</h4>
            <ul className="mt-2 divide-y divide-gray-200">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="py-2 flex items-center justify-between"
                >
                  <span className="text-sm truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const newFiles = [...selectedFiles];
                      newFiles.splice(index, 1);
                      setSelectedFiles(newFiles);
                    }}
                    className="ml-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <button
        type="submit"
        disabled={loading || selectedFiles.length === 0}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Images"}
      </button>
    </form>
  );
};

export default ImageUploadForm;
