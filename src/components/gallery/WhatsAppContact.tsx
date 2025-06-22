
import React from 'react';
import { MessageCircle, Camera, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppContact: React.FC = () => {
  const whatsappNumber = "+8801718787515";
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`;

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center border border-green-100">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Camera className="h-16 w-16 text-green-600 mb-2" />
          <Heart className="h-6 w-6 text-red-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
      </div>
      
      <h3 className="text-2xl font-bold text-gray-800 mb-4">
        Share Your Memories!
      </h3>
      
      <div className="max-w-2xl mx-auto mb-6">
        <p className="text-lg text-gray-700 mb-3">
          Want to share your photos in the gallery? Send us your selected photos via WhatsApp.
        </p>
        <p className="text-md text-gray-600 mb-2">
          Please send only the <span className="font-semibold text-green-700">"বাছাইকৃত সেরা ছবি"</span> according to you.
        </p>
        <p className="text-sm text-gray-500">
          Help us preserve and celebrate our precious CPSCS memories together!
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex items-center gap-2 text-green-700 font-semibold">
          <MessageCircle className="h-5 w-5" />
          <span>{whatsappNumber}</span>
        </div>
        
        <Button
          asChild
          size="lg"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2"
          >
            <MessageCircle className="h-5 w-5" />
            Send Photos via WhatsApp
          </a>
        </Button>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        <p>Your photos will be reviewed and added to the gallery to celebrate our alumni community.</p>
      </div>
    </div>
  );
};

export default WhatsAppContact;
