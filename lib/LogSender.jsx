/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import ActivityDetector from "react-activity-detector";
import { load } from "@fingerprintjs/fingerprintjs";
import { useEffect, useState, useRef } from "react";
import { sendLogToApi } from "@/app/actions";
import { isAdmin } from "@/lib/dal";

// Helper function to get IP address
const getIpAddress = async () => {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const { ip } = await response.json();
    return ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    return "Unknown";
  }
};

// Helper function to get OS and browser info
const getUserAgentInfo = () => {
  return {
    userAgent: navigator.userAgent,
    os: navigator.platform,
  };
};

// Helper function to get the referrer
const getReferer = () => document.referrer || "";

export default function LogSender() {
  const [status, setStatus] = useState("active");
  const previousStatus = useRef(status);

  // Collect and structure log data
  const getData = async (status) => {
    try {
      const ip_address = await getIpAddress();
      const { userAgent, os } = getUserAgentInfo();
      const referer = getReferer();
      const fp = await load();
      const { visitorId } = await fp.get();
      return {
        session_id: visitorId,
        status,
        ip_address,
        referer,
        user_agent: userAgent,
        os,
      };
    } catch (error) {
      console.error("Error collecting log data:", error);
      return null;
    }
  };

  // Send log to API
  const sendLog = async (status) => {
    const isAdminUser = await isAdmin();
    if(isAdminUser) return
    const data = await getData(status);
    if (data) {
      sendLogToApi(data);
   
    }
  };

  // Handle user becoming idle
  const onIdle = () => {
    if (previousStatus.current !== "inactive") {
      setStatus("inactive");
      previousStatus.current = "inactive";
      sendLog("inactive");
    }
  };

  // Handle user becoming active
  const onActive = () => {
    if (previousStatus.current !== "active") {
      setStatus("active");
      previousStatus.current = "active";
      sendLog("active");
    }
  };

  // Handle online/offline detection
  const handleOnlineStatus = () => {
    const newStatus = navigator.onLine ? "active" : "inactive";
    if (previousStatus.current !== newStatus) {
      setStatus(newStatus);
      previousStatus.current = newStatus;
      sendLog(newStatus);
    }
  };

  // Handle tab close or refresh
  const handleTabClose = () => {
    sendLog("inactive");
  };

  useEffect(() => {
    // Online/Offline event listeners
    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // Tab close detection
    window.addEventListener("beforeunload", handleTabClose);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, []);

  return (
    <div>
      <ActivityDetector
        enabled={true}
        timeout={5 * 1000} // Trigger idle after 5 seconds of inactivity
        onIdle={onIdle}
        onActive={onActive}
        name="activity-detector"
      />
    </div>
  );
}
