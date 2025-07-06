"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import clsx from "clsx";
import axios from "axios";
import { UPDATED_USER_INFO } from "@/utils/constants"; // Adjust the path accordingly
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";

const presetColors = [
  0xff5733, // Red-Orange
  0x33b5e5, // Sky Blue
  0x2ecc71, // Green
  0x9b59b6, // Purple
  0xf1c40f, // Yellow
];

const ProfileUI = () => {
  const router = useRouter();
  const { userInfo, setUserInfo } = useAppStore();

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState<number | undefined>(
    userInfo?.color
  );
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color);
    }
  }, [userInfo]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleColorSelect = (color: number) => {
    setSelectedColor(color);
  };

  const vadilateProfile = () => {
    if (!firstName) {
      toast.error("First name is required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name is required");
      return false;
    }
    return true;
  };
  const handleSave = async () => {
    if (!userInfo) return;
    if (!vadilateProfile()) return;

    setIsSaving(true);
    try {
      const response = await apiClient.put(UPDATED_USER_INFO, {
        firstName,
        lastName,
        color: selectedColor,
      });

      setUserInfo(response.data.user);
      console.log("Profile updated:", response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || "Error updating profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>No user information available.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg h-[80vh] w-[80vw] max-w-2xl">
        <IoArrowBack
          className="text-white cursor-pointer mb-6 text-3xl"
          onClick={() => router.back()}
        />

        <div className="flex flex-col items-center text-white space-y-4">
          {/* Avatar */}
          <div
            className="relative"
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <Avatar className="w-24 h-24 overflow-hidden bg-gray-700 text-white">
              {imagePreview ? (
                <AvatarImage
                  src={imagePreview}
                  className="object-cover w-full h-full"
                />
              ) : userInfo.image ? (
                <AvatarImage
                  src={userInfo.image}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div
                  className="flex items-center justify-center w-full h-full text-xl"
                  style={{
                    backgroundColor: `#${selectedColor
                      ?.toString(16)
                      .padStart(6, "0")}`,
                  }}
                >
                  {userInfo.username?.charAt(0).toUpperCase()}
                </div>
              )}
            </Avatar>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={clsx(
                "absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer",
                isImageHovered ? "pointer-events-auto" : "pointer-events-none"
              )}
            />
          </div>

          <h2 className="text-2xl font-semibold">{userInfo.username}</h2>
          <p className="text-gray-400">{userInfo.email}</p>

          {/* Editable Fields */}
          <div className="w-full max-w-md space-y-2 text-sm">
            <label className="flex flex-col">
              <span className="text-gray-300">First Name:</span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-gray-300">Last Name:</span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              />
            </label>
          </div>

          {/* Color Picker */}
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-300 mb-2">
              Choose a profile color:
            </p>
            <div className="flex gap-3 justify-center">
              {presetColors.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={clsx(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    selectedColor === color
                      ? "border-white scale-110"
                      : "border-transparent opacity-80"
                  )}
                  style={{
                    backgroundColor: `#${color.toString(16).padStart(6, "0")}`,
                  }}
                />
              ))}
            </div>
          </div>

          <button
            disabled={isSaving}
            onClick={handleSave}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;
