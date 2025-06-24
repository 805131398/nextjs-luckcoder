"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Mail, Shield } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) {
      setError("请输入邮箱地址");
      return;
    }

    setIsSendingCode(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/auth/send-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setError(data.error || "发送验证码失败");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) {
      setError("网络错误，请稍后重试");
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !code) {
      setError("请输入邮箱和验证码");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("开始登录，邮箱:", email, "验证码:", code);
      
      const result = await signIn("email", {
        email,
        code,
        redirect: false,
        callbackUrl: "/",
      });

      console.log("登录结果:", result);

      if (result?.error) {
        console.error("登录错误:", result.error);
        setError("验证码错误或已过期，请重新获取");
      } else if (result?.ok) {
        console.log("登录成功，跳转到首页");
        router.push("/");
        router.refresh();
      } else {
        console.log("登录结果未知:", result);
        setError("登录失败，请稍后重试");
      }
    } catch (error) {
      console.error("登录异常:", error);
      setError("登录失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">登录</CardTitle>
          <CardDescription className="text-center">
            使用邮箱验证码登录您的账户
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="请输入您的邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleSendCode}
              disabled={isSendingCode || !email || isLoading}
              className="w-full"
            >
              {isSendingCode ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  发送中...
                </>
              ) : (
                "获取验证码"
              )}
            </Button>

            <div className="space-y-2">
              <Label htmlFor="code">验证码</Label>
              <div className="relative">
                <Shield className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="code"
                  type="text"
                  placeholder="请输入6位验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="pl-10"
                  maxLength={6}
                  disabled={isLoading}
                />
              </div>
            </div>

            {message && (
              <Alert className="border-green-200 bg-green-50 text-green-800">
                <AlertDescription className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !email || !code}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  登录中...
                </>
              ) : (
                "登录"
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  或者使用
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => signIn("github", { callbackUrl: "/" })}
                disabled={isLoading}
              >
                GitHub
              </Button>
              <Button
                variant="outline"
                onClick={() => signIn("google", { callbackUrl: "/" })}
                disabled={isLoading}
              >
                Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 