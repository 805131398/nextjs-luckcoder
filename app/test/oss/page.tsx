/** @format */

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { UploadCloud, Image as ImageIcon, Link2 } from "lucide-react";
import { uploadToOss, getOssSignedUrl } from "@/lib/oss-utils";
import Link from "next/link";

export default function OssTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [objectKey, setObjectKey] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
    setProgress(0);
    setSignedUrl(null);
    setObjectKey(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setResult(null);
    setError(null);
    setProgress(0);
    setSignedUrl(null);
    setObjectKey(null);
    try {
      const { url, objectKey } = await uploadToOss(
        file,
        "uploads/avatars/",
        10,
        setProgress
      );
      setResult(url);
      console.log(url, objectKey, "上传成功");
      setObjectKey(objectKey);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "上传失败");
    } finally {
      setUploading(false);
    }
  };

  const handleGetSignUrl = async () => {
    if (!objectKey) return;
    setSigning(true);
    setSignedUrl(null);
    setError(null);
    try {
      const url = await getOssSignedUrl(objectKey, 120);
      setSignedUrl(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "获取签名 URL 失败");
    } finally {
      setSigning(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-50 to-blue-50">
      {/* 左侧主内容 */}
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-full max-w-lg p-8 shadow-xl border-blue-100">
          <div className="flex items-center gap-2 mb-6">
            <UploadCloud className="w-7 h-7 text-blue-500" />
            <h1 className="text-2xl font-bold text-blue-700">
              OSS 直传测试（私有读签名 URL）
            </h1>
          </div>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium text-gray-700">
              选择图片文件上传到 OSS：
            </label>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
          <div className="flex gap-3 mb-4">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              <UploadCloud className="w-4 h-4 mr-1" />
              {uploading ? `上传中...${progress}%` : "直传到 OSS"}
            </Button>
            {objectKey && (
              <Button
                variant="secondary"
                className="flex-1"
                onClick={handleGetSignUrl}
                disabled={signing}
              >
                <Link2 className="w-4 h-4 mr-1" />
                {signing ? "获取签名中..." : "获取签名URL并预览"}
              </Button>
            )}
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleGetSignUrl}
              disabled={signing}
            >
              <Link href="/"> 返回首页</Link>
            </Button>
          </div>
          {progress > 0 && uploading && (
            <div className="mb-4 text-sm text-blue-500">进度：{progress}%</div>
          )}
          <div className="flex flex-col gap-4 mb-4">
            {/* 上传成功信息 */}
            {result && (
              <Alert className="flex-1 border-green-200 bg-green-50 h-fit">
                <div className="flex items-start gap-2">
                  <ImageIcon className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-100">
                    <div className="text-green-700 font-medium">上传成功！</div>
                    <a
                      href={result}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-green-700 underline break-words whitespace-pre-wrap max-w-xs block"
                      style={{ wordBreak: "break-all" }}
                    >
                      {result}
                    </a>
                  </div>
                </div>
              </Alert>
            )}
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <span className="font-medium">{error}</span>
            </Alert>
          )}
          <div className="text-xs text-gray-400 mt-6 border-t pt-3">
            本页面仅用于 OSS 直传与签名 URL 测试，Bucket 权限为私有读，签名 URL
            有效期 2 分钟。
          </div>
        </Card>
      </div>
      {/* 右侧图片预览区域 */}
      {signedUrl && (
        <div className="w-full md:w-[420px] flex items-center justify-center bg-white/80 border-l border-blue-100 shadow-lg p-6 md:fixed md:right-0 md:top-0 md:h-full z-20">
          <div className="flex flex-col items-center justify-center w-full max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span className="font-medium text-blue-700">签名图片预览</span>
            </div>
            <img
              src={signedUrl}
              alt="签名图片"
              className="max-w-full max-h-60 rounded border shadow"
            />
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs break-words mt-2 text-blue-600 underline max-w-xs block"
              style={{ wordBreak: "break-all" }}
            >
              {signedUrl}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
