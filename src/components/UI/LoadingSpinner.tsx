import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
        <p className="mt-2 text-sm text-gray-600">Loading...</p>
      </div>
    </div>
  );
}