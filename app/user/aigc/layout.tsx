import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI 创作",
    description: "AI 创作工具集合，包含对话、生图、视频、知识库、智能体等功能",
};

/**
 * AIGC 模块布局组件
 * 为 AI 创作相关页面提供统一的布局结构
 */
export default function AIGCLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="h-full min-h-0 flex flex-col">
            {children}
        </main>
    );
}
