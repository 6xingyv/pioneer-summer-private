# 如何参与翻译工作？

## 准备工作

1. 安装 Git
   - Windows: 从 https://git-scm.com/download/win 下载安装包
   - macOS: 使用 `brew install git`
   - Linux: 使用 `sudo apt install git` 或对应包管理器

2. 配置 Git
```sh
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

3. 安装 Bun

Linux/macOS:
```sh
curl -fsSL https://bun.sh/install | bash
```
Windows:
```sh
powershell -c "irm bun.sh/install.ps1 | iex"
```

4. 安装所需依赖

```sh
bun install
```

## 翻译工作流程

1. 克隆项目
```sh
git clone https://github.com/6xingyv/红领巾之夏.git
cd 红领巾之夏
```

2. 创建并切换到新的翻译分支
```sh
git checkout main         # 确保在main分支上
git pull                  # 获取最新更新
git checkout -b translation/chapter-x  # 创建并切换到新分支
```

3. 在分支内进行翻译工作
    > 提交标记:
    >
    > 1. `main`: 进行翻译工作
    > 2. `main/chore`: 翻译完成后无需审阅的修改
    > 3. `review`: 审阅和批注
    > 4. `edit`: 阅读审阅意见后进行修改

    提交修改：
    ```sh
    git add .                     # 添加所有修改
    git commit -m "main: Add chapter X"  # 提交修改
    git push origin translation/chapter-x  # 推送到远程仓库
    ```

4. 翻译完成后合并分支
   - 在GitHub上创建Pull Request
   - 等待审核通过
   - 合并到main分支

## 常用Git命令

- 查看当前状态：`git status`
- 查看分支：`git branch`
- 撤销修改：`git restore <文件名>`
- 查看提交历史：`git log`
- 切换分支：`git checkout <分支名>`

