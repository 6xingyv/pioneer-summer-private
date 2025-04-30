// Import 'fs', which works correctly in both Bun and Node.js
import fs from 'fs';
import path from 'path'; // Similarly, both 'node:path' and 'path' work the same way

// Get the absolute path of the build folder relative to the current working directory
const buildDirPath = path.resolve('./build');

console.log(`🧹 正在清理目录: ${buildDirPath}`);

try {
  // 1. Check if build directory exists
  if (fs.existsSync(buildDirPath)) {
    // 2. If exists, recursively delete the directory and its contents
    fs.rmSync(buildDirPath, { recursive: true, force: true });
    console.log('✅ 目录及其内容已成功删除');
  } else {
    console.log('ℹ️ 目录不存在，无需删除');
  }

  // 3. (Optional) Recreate empty build directory
  fs.mkdirSync(buildDirPath);
  console.log('✅ 已成功创建空目录');

  console.log('✨ 清理操作已完成');
  process.exit(0); // Exit code 0 indicates success

} catch (error) {
  console.error('❌ 清理操作出错:', error);
  process.exit(1); // Non-zero exit code indicates failure
}