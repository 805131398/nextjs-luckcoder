"use client";

import { useSession } from "next-auth/react";

export default function TestSessionPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Session 测试页面</h1>
      
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">状态:</h2>
          <p className="text-gray-600">{status}</p>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Session 数据:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">用户信息:</h2>
          {session?.user ? (
            <div className="bg-green-100 p-4 rounded">
              <p><strong>ID:</strong> {session.user.id}</p>
              <p><strong>邮箱:</strong> {session.user.email}</p>
              <p><strong>姓名:</strong> {session.user.name}</p>
              <p><strong>头像:</strong> {session.user.image}</p>
            </div>
          ) : (
            <div className="bg-red-100 p-4 rounded">
              <p>没有用户信息</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 