import { SignIn, useUser } from '@clerk/nextjs'
import { useEffect } from 'react'


export default async function Page() {
  const { user } = useUser()

  useEffect(() => {
    if (user) {
      const clerkUserId = user.id;

      const fetchData = async () => {
        const res = await fetch("http://127.0.0.1:8000/process_video", {
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