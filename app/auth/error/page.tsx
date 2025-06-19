"use client"

import { useSearchParams } from "next/navigation"

const errorDetailMap = {
  Configuration: (
    <div>
      <h2>服务器配置错误</h2>
      <p>请检查 Auth.js 配置、环境变量和 Google 控制台的 OAuth 设置。</p>
      <p>常见原因包括：</p>
      <ul>
        <li>Google Client ID 或 Secret 未正确配置</li>
        <li>回调地址未在 Google 控制台注册</li>
        <li>环境变量未生效或拼写错误</li>
      </ul>
      <p>
        详细错误码：<code>Configuration</code>
      </p>
      <p>
        <a href="https://authjs.dev/guides/pages/error">查看官方文档</a>
      </p>
    </div>
  ),
  // 可扩展更多错误类型
}

export default function AuthErrorPage() {
  const search = useSearchParams()
  const error = search.get("error")
  return (error &&
    <div style={{ padding: 32 }}>
      <h1>认证出错</h1>
      <div>
        {errorDetailMap[error as keyof typeof errorDetailMap] || (
          <div>
            <h2>未知错误</h2>
            <p>请联系管理员，或检查服务器日志获取更多信息。</p>
            <p>
              错误码：<code>{error}</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}