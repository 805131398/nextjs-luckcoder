"use client"
import { useSession } from "next-auth/react";

export default function UserHome() {

  const { data: session } = useSession();
  console.log(session);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <main className="flex flex-col gap-8 items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-center">
            User Home
          </h1>
          
          <div className="w-full max-w-2xl">
            <h2 className="text-lg font-semibold mb-4">Session 数据:</h2>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 overflow-hidden">
              <pre className="text-xs sm:text-sm overflow-x-auto whitespace-pre-wrap break-words">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        </main>
        
        <footer className="mt-16 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            by{" "}
            <a 
              href="https://www.modelscope.cn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              luckcoder.com
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}
