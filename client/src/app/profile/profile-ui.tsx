"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";
import { IoArrowBack } from "react-icons/io5";
import clsx from "clsx";
import {
  NEXTJS_URL,
  REMOVED_USER_IMAGE,
  UPDATED_USER_IMAGE,
  UPDATED_USER_INFO,
} from "@/utils/constants";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { profile } from "console";
import { Button } from "@/components/ui/button";

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

  const [imageError, setImageError] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isImageHovered, setIsImageHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(userInfo?.color);

  // const [username, setUsername] = useState(userInfo?.username || "");
  const [firstName, setFirstName] = useState(userInfo?.firstName || "");
  const [lastName, setLastName] = useState(userInfo?.lastName || "");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName || "");
      setLastName(userInfo.lastName || "");
      setSelectedColor(userInfo.color);
    }
  }, [userInfo]);

  console.log({ userInfo: userInfo?.image });

  const imageSrc = userInfo?.image?.startsWith("http")
    ? userInfo.image
    : `${NEXTJS_URL}/${userInfo?.image}`;

  const colorHex = `#${(selectedColor ?? userInfo?.color ?? 0x666666)
    .toString(16)
    .padStart(6, "0")}`;

  console.log({ imageSrc });
  console.log({ colorHex });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log({ file });

    if (!file) return;

    // Show image preview immediately (before waiting for upload)
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string); // Show preview in UI
    };
    reader.readAsDataURL(file);

    // Prepare and upload file
    const formdata = new FormData();
    formdata.append("profile-image", file);

    try {
      const response = await apiClient.put(UPDATED_USER_IMAGE, formdata);
      console.log({ response });

      if (response.status === 200 && response.data.image) {
        toast.success("Image updated successfully");
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || err.message || "Error updating image"
      );
    } finally {
      if (fileInputref.current) {
        fileInputref.current.value = ""; // Reset file input so same image can be re-uploaded
      }
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
        image: userInfo.image,
        color: selectedColor,
        profileSetup: true,
      });

      if (response.status === 200) {
        toast.success("Profile updated successfully");
        setUserInfo({
          ...userInfo,
          firstName,
          lastName,
          profileSetup: true,
          color: selectedColor,
        });
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.error || error.message || "Error updating profile"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleNavigate = () => {
    if (userInfo?.profileSetup) {
      router.push("/chat");
    } else {
      toast.error(
        "Please complete your profile setup before accessing the chat."
      );
      router.push("/profile");
    }
  };

  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <p>No user information available.</p>
      </div>
    );
  }

  const handleDeleteImage = async () => {
    try {
      const response = await apiClient.delete(REMOVED_USER_IMAGE);

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImagePreview(null);
      }
    } catch (err: any) {
      if (err.response?.data?.error) {
        toast.error(err.response?.data?.error);
      } else {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg h-[80vh] w-[80vw] max-w-2xl">
        <div className="w-full h-full text-4xl bg-purple-600">
          {" "}
          <IoArrowBack
            className="text-white cursor-pointer mb-6 text-3xl"
            onClick={handleNavigate}
          />
        </div>

        <div className="flex flex-col items-center text-white space-y-4">
          {/* Avatar */}
          <div
            className="relative"
            // onMouseEnter={() => setIsImageHovered(true)}
            // onMouseLeave={() => setIsImageHovered(false)}
          >
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Avatar className="w-full h-full bg-gray-700 text-white rounded-full flex items-center justify-center text-4xl font-bold">
                <AvatarImage
                  src={imagePreview || imageSrc}
                  alt="avatar"
                  className="object-cover w-full h-full"
                />
                <AvatarFallback
                  className="w-full h-full flex items-center justify-center text-white font-bold text-4xl"
                  style={{ backgroundColor: colorHex }}
                >
                  {userInfo.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={fileInputref}
                onChange={handleImageChange}
                name="profile-image"
                className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer pointer-events-auto rounded-full"
              />
            </div>
            {imagePreview || userInfo.image ? (
              <button
                onClick={handleDeleteImage}
                className="text-sm text-red-400 mt-5 hover:text-red-600 underline cursor-pointer transition-colors duration-200 ease-in-out"
              >
                Remove image
              </button>
            ) : (
              <button
                className="text-sm text-blue-400 mt-5 hover:text-blue-600 underline cursor-pointer transition-colors duration-200 ease-in-out"
                onClick={() => fileInputref.current?.click()}
              >
                Upload image
              </button>
            )}
          </div>

          <h2 className="text-2xl font-semibold">{userInfo.username}</h2>
          <p className="text-gray-400">{userInfo.email}</p>
          <p>
            {userInfo.firstName} {userInfo.lastName}
          </p>

          {/* Editable Fields */}

          <div className="w-full max-w-md space-y-2 text-sm">
            {/* <label className="flex flex-col">
              <span className="text-gray-300">Username:</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-gray-700 text-white p-2 rounded"
              /> */}
            {/* </label> */}
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
            <Button
              disabled={isSaving}
              onClick={handleSave}
              className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileUI;
