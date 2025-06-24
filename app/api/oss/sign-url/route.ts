import { NextRequest, NextResponse } from 'next/server'
import { AliyunOssClient } from '@/lib/oss'

const OSS_REGION = process.env.OSS_REGION || ''
const OSS_BUCKET = process.env.OSS_BUCKET || ''
const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID || ''
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET || ''

export async function POST(req: NextRequest) {
  try {
    const { objectKey, expires = 60 } = await req.json()
    if (!objectKey) {
      return NextResponse.json({ error: '缺少 objectKey' }, { status: 400 })
    }
    const oss = new AliyunOssClient({
      region: OSS_REGION,
      accessKeyId: OSS_ACCESS_KEY_ID,
      accessKeySecret: OSS_ACCESS_KEY_SECRET,
      bucket: OSS_BUCKET,
    })
    // ali-oss 的 getSignedUrl 方法
    // expires 单位为秒
    // 这里假设 upload 目录下的 objectKey
    // 你上传时的 key 就是 objectKey
    // 例如 uploads/avatars/xxx.png
    // 你前端要传完整 key
    // 参考 https://help.aliyun.com/zh/oss/user-guide/access-control-overview
    const url = oss['client'].signatureUrl(objectKey, { expires })
    return NextResponse.json({ url })
  } catch (error) {
    console.log(error,"生成签名 URL 失败");
    return NextResponse.json({ error: '生成签名 URL 失败' }, { status: 500 })
  }
} 