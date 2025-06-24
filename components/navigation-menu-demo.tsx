"use client"

import * as React from "react"
import Link from "next/link"
import { 
    HomeIcon, 
    SparklesIcon, 
    UserIcon, 
    SettingsIcon,
    FileTextIcon,
    PaletteIcon,
    CodeIcon,
    GlobeIcon,
    MailIcon,
    GithubIcon,
    TwitterIcon,
    LinkedinIcon
} from "lucide-react"

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

// 功能组件列表
const features = [
    {
        title: "AI 创作",
        href: "/user/aigc",
        description: "使用人工智能进行内容创作，包括文本、图像等",
        icon: SparklesIcon,
    },
    {
        title: "代码生成",
        href: "/user/code",
        description: "智能代码生成和编程助手",
        icon: CodeIcon,
    },
    {
        title: "设计工具",
        href: "/user/design",
        description: "AI 驱动的设计工具和模板",
        icon: PaletteIcon,
    },
    {
        title: "文档助手",
        href: "/user/docs",
        description: "智能文档生成和编辑工具",
        icon: FileTextIcon,
    },
]

// 学习资源列表
const resources = [
    {
        title: "使用指南",
        href: "/docs/guide",
        description: "详细的使用说明和教程",
    },
    {
        title: "API 文档",
        href: "/docs/api",
        description: "完整的 API 参考文档",
    },
    {
        title: "示例项目",
        href: "/docs/examples",
        description: "实用的示例和最佳实践",
    },
]

// 社区链接
const community = [
    {
        title: "GitHub",
        href: "https://github.com",
        icon: GithubIcon,
    },
    {
        title: "Twitter",
        href: "https://twitter.com",
        icon: TwitterIcon,
    },
    {
        title: "LinkedIn",
        href: "https://linkedin.com",
        icon: LinkedinIcon,
    },
]

export function NavigationMenuDemo() {
    return (
        <NavigationMenu>
            <NavigationMenuList>
                {/* 首页 */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/" className={navigationMenuTriggerStyle()}>
                            <HomeIcon className="w-4 h-4 mr-2" />
                            首页
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                {/* 功能特性 */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <SparklesIcon className="w-4 h-4 mr-2" />
                        功能特性
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {features.map((feature) => (
                                <ListItem
                                    key={feature.title}
                                    title={feature.title}
                                    href={feature.href}
                                    icon={feature.icon}
                                >
                                    {feature.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 学习资源 */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <FileTextIcon className="w-4 h-4 mr-2" />
                        学习资源
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                            {resources.map((resource) => (
                                <ListItem
                                    key={resource.title}
                                    title={resource.title}
                                    href={resource.href}
                                >
                                    {resource.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 社区 */}
                <NavigationMenuItem>
                    <NavigationMenuTrigger>
                        <GlobeIcon className="w-4 h-4 mr-2" />
                        社区
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[200px] gap-3 p-4">
                            {community.map((item) => (
                                <ListItem
                                    key={item.title}
                                    title={item.title}
                                    href={item.href}
                                    icon={item.icon}
                                    external
                                />
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>

                {/* 联系我们 */}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild>
                        <Link href="/contact" className={navigationMenuTriggerStyle()}>
                            <MailIcon className="w-4 h-4 mr-2" />
                            联系我们
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}

// 列表项组件
function ListItem({
    title,
    children,
    href,
    icon: Icon,
    external = false,
    ...props
}: React.ComponentPropsWithoutRef<"li"> & { 
    href: string
    icon?: React.ComponentType<{ className?: string }>
    external?: boolean
}) {
    const Component = external ? "a" : Link
    const linkProps = external ? { href, target: "_blank", rel: "noopener noreferrer" } : { href }

    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Component {...linkProps}>
                    <div className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="flex items-center text-sm font-medium leading-none">
                            {Icon && <Icon className="w-4 h-4 mr-2" />}
                            {title}
                        </div>
                        {children && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {children}
                            </p>
                        )}
                    </div>
                </Component>
            </NavigationMenuLink>
        </li>
    )
} 