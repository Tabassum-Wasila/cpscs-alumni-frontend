import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { LogIn, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleSignup = () => {
    onClose();
    navigate('/signup');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            🎓 Join the Event!
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Please log in to register for this amazing event and connect with fellow alumni.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-4">
          <Button 
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary transition-all duration-300"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Log In
          </Button>
          
          <Button 
            onClick={handleSignup}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create Account
          </Button>
          
          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-sm">
              Maybe later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginPromptModal;