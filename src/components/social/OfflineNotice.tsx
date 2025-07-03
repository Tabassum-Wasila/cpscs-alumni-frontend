
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OfflineNoticeProps {
  onRetry: () => void;
}

const OfflineNotice: React.FC<OfflineNoticeProps> = ({ onRetry }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <WifiOff className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Internet Connection
        </h3>
        <p className="text-gray-600 mb-6">
          Please check your internet connection and try again.
        </p>
        <Button
          onClick={onRetry}
          className="bg-cpscs-blue hover:bg-cpscs-blue/90 w-full"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default OfflineNotice;
