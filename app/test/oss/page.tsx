/** @format */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export default function OssTestPage() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [testType, setTestType] = useState<"policy" | "upload" | "access">("policy");

  const testOssConnection = async () => {
    setIsLoading(true);
    setTestResult("");

    try {
      const response = await fetch("/api/oss/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dir: "uploads/avatars/",
          maxSizeMB: 10,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setTestResult(`✅ OSS 配置正确！\n\n返回数据：\n${JSON.stringify(result, null, 2)}`);
      } else {
        setTestResult(`❌ OSS 配置错误：${result.error}`);
      }
    } catch (error) {
      setTestResult(`❌ 测试失败：${error instanceof Error ? error.message : "未知错误"}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFileAccess = async () => {
    setIsLoading(true);
    setTestResult("");

    try {
      // 创建一个测试文件
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      
      const response = await fetch("/api/oss/policy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dir: "uploads/test/",
          maxSizeMB: 1,
        }),
      });

      const policy = await response.json();
      
      if (!response.ok) {
        setTestResult(`❌ 获取签名失败：${policy.error}`);
        return;
      }

      // 尝试上传测试文件
      const formData = new FormData();
      formData.append("key", "uploads/test/test.txt");
      formData.append("OSSAccessKeyId", policy.accessKeyId);
      formData.append("policy", policy.policy);
      formData.append("Signature", policy.signature);
      formData.append("success_action_status", "200");
      formData.append("file", testFile);

      const uploadResponse = await fetch(policy.host, {
        method: "POST",
        body: formData,
      });

      if (uploadResponse.ok) {
        setTestResult(`✅ 文件上传成功！\n\n上传 URL: ${policy.host}/uploads/test/test.txt\n\n现在测试文件访问...`);
        
        // 测试文件访问
        setTimeout(async () => {
          try {
            const accessResponse = await fetch(`${policy.host}/uploads/test/test.txt`);
            if (accessResponse.ok) {
              setTestResult(prev => prev + `\n\n✅ 文件访问成功！存储桶权限正常。`);
            } else {
              setTestResult(prev => prev + `\n\n❌ 文件访问失败！状态码: ${accessResponse.status}\n\n这表示存储桶是私有的，需要使用签名 URL 访问。`);
            }
          } catch (error) {
            setTestResult(prev => prev + `\n\n❌ 文件访问测试失败：${error instanceof Error ? error.message : "未知错误"}`);
          }
        }, 2000);
      } else {
        setTestResult(`❌ 文件上传失败！状态码: ${uploadResponse.status}`);
      }
    } catch (error) {
      setTestResult(`❌ 测试失败：${error instanceof Error ? error.message : "未知错误"}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>阿里云 OSS 配置测试</CardTitle>
          <CardDescription>
            测试 OSS 环境变量配置、签名生成和文件访问权限
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button 
              disabled={isLoading}
              variant={testType === "policy" ? "default" : "outline"}
              onClick={() => {
                setTestType("policy");
                testOssConnection();
              }}
            >
              测试签名配置
            </Button>
            <Button 
              disabled={isLoading}
              variant={testType === "access" ? "default" : "outline"}
              onClick={() => {
                setTestType("access");
                testFileAccess();
              }}
            >
              测试文件访问
            </Button>
          </div>

          {testResult && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">测试结果：</h3>
              <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-96">
                {testResult}
              </pre>
            </div>
          )}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>AccessDenied 错误解决方案：</strong>
              <ul className="mt-2 space-y-1 text-sm">
                <li>• <strong>方案一：</strong>将存储桶权限设置为"公共读"（推荐用于头像）</li>
                <li>• <strong>方案二：</strong>使用签名 URL 访问私有文件</li>
                <li>• <strong>方案三：</strong>检查 RAM 用户权限配置</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">配置检查清单：</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 检查 .env.local 文件中的 OSS 环境变量</li>
              <li>• 确认 OSS_REGION、OSS_BUCKET、OSS_ACCESS_KEY_ID、OSS_ACCESS_KEY_SECRET 已设置</li>
              <li>• 验证 OSS_HOST 格式正确</li>
              <li>• 确认 AccessKey 有足够的权限</li>
              <li>• 检查存储桶权限设置（公共读/私有）</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
