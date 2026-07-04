// components/AvatarUpload.jsx
// Profile photo upload - preview, upload, save permanently
// Base64 nahi - backend me file save hoti hai, sirf path DB me jaata hai

import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Avatar from './Avatar';
import { uploadAvatar } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function AvatarUpload({ size = 'xl' }) {
  const { user, updateUserInContext } = useAuth();
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(null); // local preview (blob URL)
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Size check: 4MB max
    if (file.size > 4 * 1024 * 1024) {
      toast.error('Image 4MB se chhoti honi chahiye.');
      return;
    }

    // Local preview (blob URL) - turant dikhao
    const blobUrl = URL.createObjectURL(file);
    setPreview(blobUrl);

    // Auto-upload immediately on select
    handleUpload(file);
  };

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const res = await uploadAvatar(formData);
      updateUserInContext(res.data.user);
      toast.success('Profile photo update ho gayi! 🎉');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error(err.response?.data?.message || 'Upload fail hua. Try again.');
      setPreview(null); // revert preview on failure
    } finally {
      setUploading(false);
    }
  };

  // Preview user object - local preview override karne ke liye
  const previewUser = preview ? { ...user, avatar: preview } : user;

  return (
    <div
      className="relative inline-block cursor-pointer group"
      onClick={() => !uploading && fileInputRef.current?.click()}
    >
      <Avatar user={previewUser} size={size} />

      {/* Hover overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute inset-0 rounded-full bg-black/50 flex flex-col items-center justify-center"
      >
        {uploading ? (
          <Loader2 size={20} className="text-white animate-spin" />
        ) : (
          <>
            <Camera size={18} className="text-white mb-0.5" />
            <span className="text-[10px] text-white font-medium">Change</span>
          </>
        )}
      </motion.div>

      {/* Upload ring animation jab uploading ho */}
      <AnimatePresence>
        {uploading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-[-3px] rounded-full border-2 border-amber border-t-transparent animate-spin"
          />
        )}
      </AnimatePresence>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
