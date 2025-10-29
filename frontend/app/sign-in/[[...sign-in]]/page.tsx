'use client'
import { SignIn, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'


export default async function Page() {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const clerkUserId = user.id;

      const fetchData = async () => {
        const res = await fetch("https://tubeiq.onrender.com/process_video", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-clerk-user-id": clerkUserId,  // Pass Clerk user id here
          },
          body: JSON.stringify({...user}),
        });
      };
      
      fetchData();
    }
  }, [user])
  return <div className="flex flex-col items-center justify-center h-screen">
    <SignIn />
  </div>
}