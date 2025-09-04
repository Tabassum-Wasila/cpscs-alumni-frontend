import React from 'react';
import { GraduationCap, FileImage, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProofDocumentInstructionsProps {
  show: boolean;
  hasFile: boolean;
}

const ProofDocumentInstructions: React.FC<ProofDocumentInstructionsProps> = ({ show, hasFile }) => {
  if (!show || hasFile) return null;

  return (
    <div className="mt-4 p-6 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border border-indigo-200 rounded-xl shadow-sm">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              প্রমাণপত্র আপলোড করার নির্দেশনা
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              আমাদের অ্যালামনাই কমিউনিটির নিরাপত্তা নিশ্চিত করতে, আপনার স্টুডেন্টশিপ প্রমাণের একটি ছবি প্রয়োজন। 
              <span className="text-indigo-700 font-medium"> সঠিক প্রমাণপত্র ছাড়া অ্যাকাউন্ট অনুমোদন করা সম্ভব হবে না।</span>
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              গ্রহণযোগ্য প্রমাণপত্রসমূহ:
            </h5>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-100">
                <FileImage className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">SSC/HSC সার্টিফিকেট বা মার্কশিট</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-100">
                <FileImage className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">স্কুলের পুরনো আইডি কার্ডের ছবি</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-100">
                <FileImage className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">ক্যাম্পাসে বন্ধুদের সাথে তোলা ছবি</span>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg border border-indigo-100">
                <FileImage className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                <span className="text-sm text-slate-700">অন্য যেকোনো স্টুডেন্টশিপ প্রমাণ</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
              সর্বোচ্চ 2MB
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
              JPG, PNG, HEIF
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
              ছবির মান ভালো রাখুন
            </Badge>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <span className="font-medium">গুরুত্বপূর্ণ:</span> আমাদের অ্যাডমিন টিম ম্যানুয়ালি সকল প্রমাণপত্র যাচাই করে। 
                স্পষ্ট এবং পড়ার উপযোগী ছবি আপলোড করুন যাতে দ্রুত অনুমোদন পেতে পারেন।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProofDocumentInstructions;