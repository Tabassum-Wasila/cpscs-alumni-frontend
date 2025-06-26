
import React from 'react';
import { FileText, AlertCircle } from 'lucide-react';

interface SmartDocumentTooltipProps {
  show: boolean;
  hasFile: boolean;
}

const SmartDocumentTooltip: React.FC<SmartDocumentTooltipProps> = ({ show, hasFile }) => {
  if (!show || hasFile) return null;

  return (
    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-start space-x-3">
        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <p className="font-medium mb-2">প্রমাণপত্র আপলোড করার নির্দেশনা:</p>
          <ul className="space-y-1 text-xs">
            <li>• SSC/HSC সার্টিফিকেট বা মার্কশিট</li>
            <li>• স্কুলের পুরনো আইডি কার্ডের ছবি</li>
            <li>• স্কুলের ক্যাম্পাসে বন্ধুদের সাথে তোলা ছবি</li>
            <li>• যেকোনো ডকুমেন্ট যা প্রমাণ করে আপনি এই স্কুলের শিক্ষার্থী ছিলেন</li>
          </ul>
          <p className="mt-2 text-xs text-blue-700">
            <FileText className="w-3 h-3 inline mr-1" />
            সর্বোচ্চ ৫MB | JPG, PNG, PDF, DOC ফাইল গ্রহণযোগ্য
          </p>
        </div>
      </div>
    </div>
  );
};

export default SmartDocumentTooltip;
