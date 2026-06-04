import React from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  FaCloudUploadAlt, FaFileAlt, FaTrash, FaCheckCircle, 
  FaExclamationCircle, FaInfoCircle 
} from 'react-icons/fa';

const FileUpload = ({ files, onFilesAdded, onFileRemove, maxFiles = 20, maxTotalSize = 500 * 1024 * 1024 }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onFilesAdded,
    maxFiles: maxFiles - files.length,
    disabled: files.length >= maxFiles,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip']
    }
  });

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);
  const sizePercentage = (totalSize / maxTotalSize) * 100;

  return (
    <div className="space-y-4">
      <div 
        {...getRootProps()} 
        className={`relative border-2 border-dashed rounded-2xl p-8 transition-all cursor-pointer overflow-hidden
          ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.01]' : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-white'}
          ${files.length >= maxFiles ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-blue-100 text-blue-600' : 'bg-white text-gray-400 shadow-sm'}`}>
            <FaCloudUploadAlt className="text-4xl" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-700">
              {isDragActive ? 'Drop your files here' : 'Click or drag files to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Maximum {maxFiles} files. Supported: PDF, DOCX, XLSX, Images, ZIP
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="absolute top-4 right-4 flex gap-2">
          {files.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold shadow-sm">
              <FaCheckCircle /> {files.length} Files Added
            </div>
          )}
        </div>
      </div>

      {/* Progress and Limits */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex-1 max-w-md">
          <div className="flex justify-between items-end mb-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <FaInfoCircle className="text-blue-500" /> Total Storage Capacity
            </span>
            <span className={`text-xs font-mono font-bold ${sizePercentage > 90 ? 'text-red-500' : 'text-gray-700'}`}>
              {(totalSize / 1024 / 1024).toFixed(1)}MB / 500MB
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                sizePercentage > 90 ? 'bg-gradient-to-r from-red-500 to-rose-600' : 
                sizePercentage > 70 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 
                'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}
              style={{ width: `${Math.min(sizePercentage, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="flex gap-3">
           {files.length >= maxFiles && (
             <span className="text-xs font-bold text-orange-600 flex items-center gap-1">
               <FaExclamationCircle /> Maximum file limit reached
             </span>
           )}
        </div>
      </div>

      {/* File List Grid */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file, idx) => (
            <div 
              key={idx} 
              className="group relative flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all animate-fadeIn"
            >
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                <FaFileAlt className="text-xl" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-700 truncate pr-6">{file.name}</p>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">
                  {(file.size / 1024).toFixed(0)} KB • {file.type?.split('/')[1] || 'FILE'}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onFileRemove(idx); }}
                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
