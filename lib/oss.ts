import OSS from 'ali-oss'
import crypto from 'crypto'

interface OssConfig {
  region: string
  accessKeyId: string
  accessKeySecret: string
  bucket: string
}

export class AliyunOssClient {
  private client: OSS

  constructor(config: OssConfig) {
    this.client = new OSS({
      region: config.region,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
    })
  }

  /**
   * 上传文件到 OSS（服务端直传，适合小文件或特殊场景）
   */
  async upload(objectKey: string, file: Buffer | string) {
    try {
      const result = await this.client.put(objectKey, file)
      return {
        url: result.url,
        name: result.name,
        res: result.res,
      }
    } catch (error) {
      // 可根据 ali-oss 错误类型细化处理
      throw new Error('OSS 上传失败: ' + (error as Error).message)
    }
  }

  /**
   * 生成前端直传 OSS 的 Policy/签名（推荐最佳实践）
   * @param options 生成策略参数
   * @returns policy、signature、accessKeyId、host、dir、expire 等
   */
  static generatePolicySignature({
    dir = '',
    expireSeconds = 60,
    maxSizeMB = 10,
    bucket,
    region,
    accessKeyId,
    accessKeySecret,
    host,
  }: {
    dir?: string
    expireSeconds?: number
    maxSizeMB?: number
    bucket: string
    region: string
    accessKeyId: string
    accessKeySecret: string
    host: string
  }) {
    const now = Math.floor(Date.now() / 1000)
    const expire = now + expireSeconds
    const policyText = {
      expiration: new Date(expire * 1000).toISOString(),
      conditions: [
        ["content-length-range", 0, maxSizeMB * 1024 * 1024],
        ["starts-with", "$key", dir],
      ],
    }
    const policyBase64 = Buffer.from(JSON.stringify(policyText)).toString('base64')
    const signature = crypto.createHmac('sha1', accessKeySecret).update(policyBase64).digest('base64')
    return {
      accessKeyId,
      policy: policyBase64,
      signature,
      dir,
      host,
      expire,
      bucket,
      region,
    }
  }
}

/**
 * 用法说明：
 * - 在 API 路由中调用 AliyunOssClient.generatePolicySignature，返回给前端
 * - 前端用该签名、policy、accessKeyId、host 直传 OSS
 * - 参考阿里云官方直传文档：https://help.aliyun.com/zh/oss/developer-reference/browser-direct-upload
 */

// 用法示例（在 API 路由或服务端调用）：
// const oss = new AliyunOssClient({ region, accessKeyId, accessKeySecret, bucket })
// await oss.upload('uploads/avatars/xxx.png', fileBuffer) 