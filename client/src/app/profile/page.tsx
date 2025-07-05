"use client";
import { useAppStore } from "@/store";

const Profile = () => {
  const { userInfo } = useAppStore();
  return (
    <div>
      Profile
      <div>
        {userInfo ? (
          <div>
            <h2>{userInfo.username}</h2>
            <p>{userInfo.email}</p>
          </div>
        ) : (
          <p>No user information available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
