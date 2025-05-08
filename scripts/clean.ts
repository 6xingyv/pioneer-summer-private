import fs from 'fs';
import path from 'path';

const BUILD_DIR = 'build';
const buildDirPath = path.resolve(BUILD_DIR);

async function clean() {
  try {
    console.log(`🧹 正在清理目录: ${buildDirPath}`);
    
    if (fs.existsSync(buildDirPath)) {
      await fs.promises.rm(buildDirPath, { recursive: true, force: true });
      console.log('✅ 目录及其内容已成功删除');
    } else {
      console.log('ℹ️ 目录不存在，无需删除');
    }

    // 确保父目录存在
    const parentDir = path.dirname(buildDirPath);
    if (!fs.existsSync(parentDir)) {
      await fs.promises.mkdir(parentDir, { recursive: true });
    }
    
    await fs.promises.mkdir(buildDirPath);
    console.log('✅ 已成功创建空目录');
    
    console.log('✨ 清理操作已完成');
    process.exit(0);
  } catch (error) {
    console.error('❌ 清理操作出错:', error);
    process.exit(1);
  }
}

clean();