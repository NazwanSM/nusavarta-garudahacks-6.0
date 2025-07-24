import {
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updateEmail,
    updatePassword,
    updateProfile
} from 'firebase/auth';
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { UserData } from './authService';

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  photoURL?: string;
}

export interface UpdateEmailData {
  newEmail: string;
  currentPassword: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileResponse {
  success: boolean;
  error?: string;
  user?: UserData;
}

class UserProfileService {
  // Get user profile data
  async getUserProfile(uid: string): Promise<ProfileResponse> {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        return { success: true, user: userData };
      } else {
        return { success: false, error: 'User profile not found' };
      }
    } catch (error) {
      console.error('Error getting user profile:', error);
      return { success: false, error: 'Failed to load user profile' };
    }
  }

  // Update user profile
  async updateProfile(uid: string, updateData: UpdateProfileData): Promise<ProfileResponse> {
    try {
      const user = auth.currentUser;
      if (!user || user.uid !== uid) {
        return { success: false, error: 'User not authenticated' };
      }

      // Prepare update data for Firestore
      const firestoreUpdateData: Partial<UserData> = {
        ...updateData,
        lastUpdatedAt: serverTimestamp(),
      };

      // If firstName or lastName is updated, update displayName
      if (updateData.firstName || updateData.lastName) {
        const currentProfile = await this.getUserProfile(uid);
        if (currentProfile.success && currentProfile.user) {
          const firstName = updateData.firstName || currentProfile.user.firstName;
          const lastName = updateData.lastName || currentProfile.user.lastName;
          firestoreUpdateData.displayName = `${firstName} ${lastName}`;
        }
      }

      // Update Firestore document
      const userDocRef = doc(db, 'users', uid);
      await updateDoc(userDocRef, firestoreUpdateData);

      // Update Firebase Auth profile if displayName or photoURL changed
      if (updateData.displayName || updateData.photoURL) {
        const authUpdateData: { displayName?: string; photoURL?: string } = {};
        if (updateData.displayName) authUpdateData.displayName = updateData.displayName;
        if (updateData.photoURL) authUpdateData.photoURL = updateData.photoURL;
        
        await updateProfile(user, authUpdateData);
      }

      // Return updated profile
      const updatedProfile = await this.getUserProfile(uid);
      return updatedProfile;

    } catch (error) {
      console.error('Error updating profile:', error);
      return { success: false, error: 'Failed to update profile' };
    }
  }

  // Update user email
  async updateUserEmail({ newEmail, currentPassword }: UpdateEmailData): Promise<ProfileResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: 'User not authenticated' };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email in Firebase Auth
      await updateEmail(user, newEmail);

      // Update email in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        email: newEmail,
        lastUpdatedAt: serverTimestamp(),
      });

      // Return updated profile
      const updatedProfile = await this.getUserProfile(user.uid);
      return updatedProfile;

    } catch (error) {
      console.error('Error updating email:', error);
      
      if ((error as any).code === 'auth/wrong-password') {
        return { success: false, error: 'Current password is incorrect' };
      }
      if ((error as any).code === 'auth/email-already-in-use') {
        return { success: false, error: 'This email is already in use by another account' };
      }
      if ((error as any).code === 'auth/invalid-email') {
        return { success: false, error: 'Please enter a valid email address' };
      }
      
      return { success: false, error: 'Failed to update email' };
    }
  }

  // Update user password
  async updateUserPassword({ currentPassword, newPassword }: UpdatePasswordData): Promise<ProfileResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: 'User not authenticated' };
      }

      // Validate new password
      if (newPassword.length < 6) {
        return { success: false, error: 'New password must be at least 6 characters long' };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password in Firebase Auth
      await updatePassword(user, newPassword);

      // Update last updated time in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        lastUpdatedAt: serverTimestamp(),
      });

      return { success: true };

    } catch (error) {
      console.error('Error updating password:', error);
      
      if ((error as any).code === 'auth/wrong-password') {
        return { success: false, error: 'Current password is incorrect' };
      }
      if ((error as any).code === 'auth/weak-password') {
        return { success: false, error: 'New password is too weak' };
      }
      
      return { success: false, error: 'Failed to update password' };
    }
  }

  // Delete user account
  async deleteAccount(password: string): Promise<ProfileResponse> {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        return { success: false, error: 'User not authenticated' };
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      // Delete user data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await deleteDoc(userDocRef);

      // Delete user from Firebase Auth
      await deleteUser(user);

      return { success: true };

    } catch (error) {
      console.error('Error deleting account:', error);
      
      if ((error as any).code === 'auth/wrong-password') {
        return { success: false, error: 'Password is incorrect' };
      }
      
      return { success: false, error: 'Failed to delete account' };
    }
  }

  // Check if email is available
  async isEmailAvailable(email: string): Promise<{ available: boolean; error?: string }> {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);

      return { available: querySnapshot.empty };

    } catch (error) {
      console.error('Error checking email availability:', error);
      return { available: false, error: 'Failed to check email availability' };
    }
  }

  // Get user activity summary
  async getUserActivitySummary(uid: string): Promise<{
    success: boolean;
    data?: {
      joinDate: Date;
      lastLogin: Date;
      profileCompleteness: number;
    };
    error?: string;
  }> {
    try {
      const userProfile = await this.getUserProfile(uid);
      if (!userProfile.success || !userProfile.user) {
        return { success: false, error: 'User profile not found' };
      }

      const user = userProfile.user;
      
      // Calculate profile completeness
      let completeness = 0;
      const fields = [
        user.firstName,
        user.lastName,
        user.email,
        user.photoURL,
      ];
      
      const filledFields = fields.filter(field => field && field.trim()).length;
      completeness = Math.round((filledFields / fields.length) * 100);

      // Convert Firestore timestamps to dates
      const joinDate = user.createdAt instanceof Timestamp 
        ? user.createdAt.toDate() 
        : new Date(user.createdAt);
      
      const lastLogin = user.lastLoginAt instanceof Timestamp 
        ? user.lastLoginAt.toDate() 
        : new Date(user.lastLoginAt);

      return {
        success: true,
        data: {
          joinDate,
          lastLogin,
          profileCompleteness: completeness,
        },
      };

    } catch (error) {
      console.error('Error getting user activity summary:', error);
      return { success: false, error: 'Failed to load activity summary' };
    }
  }

  // Validate profile data
  validateProfileData(data: UpdateProfileData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (data.firstName !== undefined) {
      if (!data.firstName.trim()) {
        errors.push('First name cannot be empty');
      } else if (data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
      } else if (data.firstName.trim().length > 50) {
        errors.push('First name must be less than 50 characters');
      }
    }

    if (data.lastName !== undefined) {
      if (!data.lastName.trim()) {
        errors.push('Last name cannot be empty');
      } else if (data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
      } else if (data.lastName.trim().length > 50) {
        errors.push('Last name must be less than 50 characters');
      }
    }

    if (data.photoURL !== undefined && data.photoURL) {
      try {
        new URL(data.photoURL);
      } catch {
        errors.push('Photo URL must be a valid URL');
      }
    }

    return { valid: errors.length === 0, errors };
  }
}

export const userProfileService = new UserProfileService();
