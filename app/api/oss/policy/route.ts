import { NextRequest, NextResponse } from 'next/server'
import { AliyunOssClient } from '@/lib/oss'

const OSS_REGION = process.env.OSS_REGION || ''
const OSS_BUCKET = process.env.OSS_BUCKET || ''
const OSS_ACCESS_KEY_ID = process.env.OSS_ACCESS_KEY_ID || ''
const OSS_ACCESS_KEY_SECRET = process.env.OSS_ACCESS_KEY_SECRET || ''
const OSS_HOST = process.env.OSS_HOST || '' // 形如 https://your-bucket.oss-cn-xxx.aliyuncs.com

export async function POST(req: NextRequest) {
  try {
    const { dir = '', maxSizeMB = 10 } = await req.json()
    if (!OSS_REGION || !OSS_BUCKET || !OSS_ACCESS_KEY_ID || !OSS_ACCESS_KEY_SECRET || !OSS_HOST) {
      return NextResponse.json({ error: 'OSS 配置缺失' }, { status: 500 })
    }
    const result = AliyunOssClient.generatePolicySignature({
      dir,
      maxSizeMB,
      bucket: OSS_BUCKET,
      region: OSS_REGION,
      accessKeyId: OSS_ACCESS_KEY_ID,
      accessKeySecret: OSS_ACCESS_KEY_SECRET,
      host: OSS_HOST,
    })
    console.log(result,"生成 OSS 签名成功");
    return NextResponse.json(result)
  } catch (error) {
    console.log(error,"生成 OSS 签名失败");
    return NextResponse.json({ error: '生成 OSS 签名失败' }, { status: 500 })
  }
} 