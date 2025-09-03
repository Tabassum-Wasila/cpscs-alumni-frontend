import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info } from 'lucide-react';

const TShirtSizeGuideModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Measurements (Chest/Length):
          </div>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">S:</span>
              <span>39" / 26.5"</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">M:</span>
              <span>40" / 27.5"</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">L:</span>
              <span>41" / 28.5"</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">XL:</span>
              <span>42" / 29.5"</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="font-medium">XXL:</span>
              <span>43" / 30.5"</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TShirtSizeGuideModal;