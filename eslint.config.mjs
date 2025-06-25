import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript 相关规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      
      // React 相关规则
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      
      // Next.js 相关规则
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "off",
      
      // 通用规则 - 改为警告而不是错误
      "no-console": "warn",
      "no-debugger": "error",
      "prefer-const": "warn",
      "no-var": "error",
      
      // 代码风格 - 关闭或改为警告
      "semi": "off", // 关闭分号检查
      "quotes": "off", // 关闭引号检查
      "comma-dangle": "off", // 关闭尾随逗号检查
    },
  },
  {
    // 针对特定文件的规则
    files: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": "off",
    },
  },
  {
    // 针对 API 路由的规则
    files: ["app/api/**/*"],
    rules: {
      "no-console": "off", // API 路由允许 console
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // 针对测试页面的规则
    files: ["app/test/**/*"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@next/next/no-img-element": "off",
      "no-console": "off",
    },
  },
];

export default eslintConfig;