import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles } from 'lucide-react';

interface RegistrationSuccessModalProps {
  open: boolean;
  onClose: () => void;
  eventTitle: string;
}

const RegistrationSuccessModal: React.FC<RegistrationSuccessModalProps> = ({
  open,
  onClose,
  eventTitle
}) => {
  useEffect(() => {
    if (open) {
      // Play celebration sound
      const audio = new Audio('/sounds/celebration.wav');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore if audio fails to play
      });

      // Trigger confetti animation
      const duration = 3000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          particleCount,
          spread: 160,
          origin: { y: 0.6 },
          colors: ['#ff6b35', '#f7931e', '#ffe66d', '#a8e6cf', '#88d8b0'],
          gravity: 0.8,
          drift: 0,
          ticks: 200,
          scalar: randomInRange(0.4, 1),
          shapes: ['star', 'circle'],
        });
      }, 250);

      // Balloon effect
      setTimeout(() => {
        confetti({
          particleCount: 30,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ['#ff6b35', '#f7931e', '#ffe66d'],
          gravity: -0.3,
          scalar: 1.2,
          shapes: ['circle'],
        });
        
        confetti({
          particleCount: 30,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ['#a8e6cf', '#88d8b0', '#4ecdc4'],
          gravity: -0.3,
          scalar: 1.2,
          shapes: ['circle'],
        });
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-auto bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20">
        <div className="text-center py-8 px-4">
          {/* Success Icon with Animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 animate-pulse">
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-pulse delay-300">
              <Sparkles className="h-6 w-6 text-blue-500" />
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground animate-fade-in">
              {/* 🎉 Registration Successful! 🎉 */}
              🎉 আপনার রেজিস্ট্রেশন Request সফল হয়েছে! 🎉
            </h2>
            
            <div className="space-y-2">
            {/*   <p className="text-lg text-muted-foreground">
                You're all set for
              </p>
              <p className="text-xl font-semibold text-primary">
                {eventTitle}
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-primary/10 to-primary-glow/10 rounded-lg p-4 mt-6">
              <p className="text-foreground font-medium">
                ✨ See you at the event! ✨
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                A confirmation email will be sent to you shortly.
              </p>
              */}
              <p className="text-sm mb-4">একজন এডমিন আপনার ফরম এবং Transaction ID চেক করবেন। আপনার রেজিস্ট্রেশন Approved হলে, আপনি একটি ইমেইল পাবেন। ইন শা আল্লাহ।</p>
              <p className="text-sm mb-4">তিন কার্যদিবসের মধ্যে Approved ইমেইল না পেলে, অনুগ্রহ পূর্বক 01886579596 নাম্বারে যোগাযোগ করুন।</p>

            </div> 
          </div>
          
          {/* Close Button */}
          <Button 
            onClick={onClose}
            className="mt-8 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Awesome! 🚀
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RegistrationSuccessModal;