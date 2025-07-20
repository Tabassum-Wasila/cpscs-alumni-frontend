
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { UserService } from '@/services/userService';
import FuturisticProfileView from './FuturisticProfileView';
import ProfileView from './ProfileView';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const EnhancedProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);

  // Handle beforeunload event for browser navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing && hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isEditing, hasUnsavedChanges]);

  // Handle route changes within the app
  useEffect(() => {
    const handlePopState = () => {
      if (isEditing && hasUnsavedChanges) {
        setShowSaveConfirmation(true);
        setPendingNavigation(location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isEditing, hasUnsavedChanges, location]);

  const handleSaveAndNavigate = () => {
    // Save changes first, then navigate
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowSaveConfirmation(false);
    setPendingNavigation(null);
    setHasUnsavedChanges(false);
  };

  const handleDiscardAndNavigate = () => {
    // Discard changes and navigate
    if (pendingNavigation) {
      navigate(pendingNavigation);
    }
    setShowSaveConfirmation(false);
    setPendingNavigation(null);
    setHasUnsavedChanges(false);
    setIsEditing(false);
  };

  const handleEditToggle = useCallback(() => {
    if (isEditing && hasUnsavedChanges) {
      setShowSaveConfirmation(true);
      return;
    }
    setIsEditing(!isEditing);
    setHasUnsavedChanges(false);
  }, [isEditing, hasUnsavedChanges]);

  const handleSave = useCallback(async (updatedUser: any) => {
    try {
      // Ensure phone privacy defaults to showing phone number
      if (updatedUser.profile && updatedUser.profile.showPhone === undefined) {
        updatedUser.profile.showPhone = true;
      }

      await updateUserProfile(updatedUser.profile || {});
      setIsEditing(false);
      setHasUnsavedChanges(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  }, [updateUserProfile]);

  const handleCancel = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowSaveConfirmation(true);
      return;
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
  }, [hasUnsavedChanges]);

  const handleFieldChange = useCallback(() => {
    setHasUnsavedChanges(true);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view this page.</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const profileCompletion = UserService.calculateProfileCompletion(user);

  return (
    <div className="min-h-screen">
      {isEditing ? (
        <FuturisticProfileView
          user={user}
          isOwnProfile={true}
          onEdit={handleCancel}
        />
      ) : (
        <ProfileView
          user={user}
          isOwnProfile={true}
          onEdit={handleEditToggle}
        />
      )}

      {/* Save Confirmation Dialog */}
      <AlertDialog open={showSaveConfirmation} onOpenChange={setShowSaveConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. What would you like to do?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAndNavigate}>
              Don't Save Changes
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndNavigate}>
              Save Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EnhancedProfilePage;
