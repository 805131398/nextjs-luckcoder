"use client";

import Image, { ImageProps } from "next/image";
import { useOssImage, useOssImages } from "@/lib/hooks/useOssImage";

interface OssImageProps extends Omit<ImageProps, 'src'> {
  src: string | null | undefined;
  fallbackSrc?: string;
  expires?: number;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

/**
 * 智能 OSS 图片组件
 * 自动判断是否为 OSS 图片，如果是则使用签名 URL
 */
export function OssImage({
  src,
  fallbackSrc,
  expires = 3600,
  showLoading = true,
  loadingComponent,
  errorComponent,
  alt,
  ...imageProps
}: OssImageProps) {
  const { imageUrl, isLoading, error, isOssImage } = useOssImage(src, expires);

  // 如果没有图片 URL，显示占位符或 fallback
  if (!imageUrl) {
    if (fallbackSrc) {
      return <Image src={fallbackSrc} alt={alt} {...imageProps} />;
    }
    return (
      <div className="bg-gray-200 flex items-center justify-center" style={{ width: imageProps.width, height: imageProps.height }}>
        <span className="text-gray-400 text-sm">无图片</span>
      </div>
    );
  }

  // 显示加载状态
  if (isLoading && showLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div 
        className="bg-gray-200 animate-pulse" 
        style={{ width: imageProps.width, height: imageProps.height }}
      />
    );
  }

  // 显示错误状态
  if (error && errorComponent) {
    return <>{errorComponent}</>;
  }

  // 显示图片
  return (
    <Image
      src={imageUrl}
      alt={alt}
      {...imageProps}
      // 添加 OSS 标识（用于调试）
      data-oss-image={isOssImage ? "true" : "false"}
      data-original-url={isOssImage ? src : undefined}
    />
  );
}

/**
 * 头像专用的 OSS 图片组件
 */
export function OssAvatar({
  src,
  fallbackSrc,
  expires = 3600,
  size = 40,
  className = "",
  ...props
}: {
  src: string | null | undefined;
  fallbackSrc?: string;
  expires?: number;
  size?: number;
  className?: string;
} & Omit<ImageProps, 'src' | 'width' | 'height'>) {
  return (
    <OssImage
      src={src}
      fallbackSrc={fallbackSrc}
      expires={expires}
      width={size}
      height={size}
      className={`rounded-full object-cover ${className}`}
      {...props}
    />
  );
}

/**
 * 批量 OSS 图片组件
 */
export function OssImageGrid({
  images,
  fallbackSrc,
  expires = 3600,
  showLoading = true,
  loadingComponent,
  errorComponent,
  gridClassName = "grid grid-cols-2 gap-2",
  imageClassName = "w-full h-32 object-cover rounded",
  ...imageProps
}: {
  images: (string | null | undefined)[];
  fallbackSrc?: string;
  expires?: number;
  showLoading?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  gridClassName?: string;
  imageClassName?: string;
} & Omit<ImageProps, 'src'>) {
  const { imageUrls, isLoading, error } = useOssImages(images, expires);

  if (isLoading && showLoading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }
    return (
      <div className={gridClassName}>
        {images.map((_: string | null | undefined, index: number) => (
          <div key={index} className="w-full h-32 bg-gray-200 animate-pulse rounded" />
        ))}
      </div>
    );
  }

  if (error && errorComponent) {
    return <>{errorComponent}</>;
  }

  return (
    <div className={gridClassName}>
      {imageUrls.map((url: string | null, index: number) => (
        <OssImage
          key={index}
          src={url}
          fallbackSrc={fallbackSrc}
          className={imageClassName}
          {...imageProps}
        />
      ))}
    </div>
  );
} 