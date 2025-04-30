# 红领巾之夏

## 准备工作

1. 安装 Bun

Linux/macOS:
```sh
curl -fsSL https://bun.sh/install | bash
```
Windows:
```sh
powershell -c "irm bun.sh/install.ps1 | iex"
```

2. 安装所需依赖

```sh
bun install
```

## 翻译工作流程

1. 从`main`分支创建新翻译分支`translation/chapter-x`

2. 签出到对应分支

3. 在分支内进行翻译工作
    > 提交标记:
    >
    > 1. `main`: 进行翻译工作
    > 2. `main/chore`: 翻译完成后无需审阅的修改
    > 3. `review`: 审阅和批注
    > 4. `edit`: 阅读审阅意见后进行修改

4. 在翻译工作完成后，合并对应`translation/chapter-x`分支至`main`分支

