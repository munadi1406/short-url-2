'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const RecoredVisitors = () => {
  const pathname = usePathname(); // Get the current path of the page
  
  useEffect(() => {
    const recordVisitorStat = async () => {
      try {
        // Send the page and slug to the API without expecting any return value
        const slug = pathname.split('/').pop();  // Assuming the last segment of the path is the slug
        await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ page: pathname, slug }), // Use pathname and slug
        });
      } catch (err) {
      
      }
    };

    // Call the function to record the visitor when component mounts
    recordVisitorStat();
  }, [pathname]); // Run effect only if pathname changes

  // Since no UI is required, just return nothing or null
  return null;
};

export default RecoredVisitors;
