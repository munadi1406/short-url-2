'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisitor } from '@/app/actions';
import { isAdmin } from '@/lib/dal';

const RecoredVisitors = () => {
  const pathname = usePathname(); // Get the current path of the page
  const [visitorAsAdmin, setVisitorAsAdmin] = useState(undefined);  // Initialize as undefined
  
  // Function to check if visitor is an admin
  const isAdminVisitor = async () => {
    const datas = await isAdmin();  // Call to check if user is an admin
    setVisitorAsAdmin(datas);  // Set the visitor's admin status
  };

  // Check if visitor is an admin when component mounts
 
  useEffect(() => {
    isAdminVisitor();
  }, []);

  // Record visitor statistics if the visitor is not an admin
  useEffect(() => {
    const recordVisitorStat = async () => {
      try {
        if (visitorAsAdmin === undefined) return; // Wait until visitorAsAdmin is set
        if (visitorAsAdmin) return;  // Skip recording for admin

        const ipAddress = window.location.hostname; // Get client-side IP
        const userAgent = navigator.userAgent; // Get user-agent from browser
        const slug = pathname.split('/').pop(); // Get slug from pathname

        // Send the visitor data to the server
        await recordVisitor({ page: pathname, slug, ipAddress, userAgent });
      
      } catch (err) {
        // console.error("Error recording visitor:", err);
      }
    };

    recordVisitorStat();
  }, [pathname, visitorAsAdmin]);  // Only run when pathname or visitorAsAdmin changes

  return null;  // Since no UI is required, return null
};

export default RecoredVisitors;
