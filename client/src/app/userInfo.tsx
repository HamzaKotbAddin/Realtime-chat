"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store";
import { apiClient } from "@/lib/api-client";
import { GET_USER_INFO } from "@/utils/constants";

export default function AppInit() {
  const userInfo = useAppStore((state) => state.userInfo);
  const setUserInfo = useAppStore((state) => state.setUserInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!userInfo) {
        try {
          const res = await apiClient.get(GET_USER_INFO);
          if (res.data?.user) {
            console.log("Fetched user info:", res.data.user);
            setUserInfo(res.data.user);
          } else {
            setUserInfo(undefined);
          }
        } catch (error) {
          setUserInfo(undefined);
        }
      }
    };

    fetchUserInfo();
  }, [userInfo, setUserInfo]);

  return null;
}
