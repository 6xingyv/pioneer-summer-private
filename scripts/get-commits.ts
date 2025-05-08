import { spawn } from "bun";

interface CommitCategories {
  chapters: string[];
  features: string[];
  fixes: string[];
  others: string[];
}

async function git(...args: string[]) {
  const proc = spawn(["git", ...args]);
  const output = await new Response(proc.stdout).text();
  return output.trim();
}

async function main() {
  // Get latest tag
  const latestTag = await git("describe", "--tags", "--abbrev=0");
  
  if (!latestTag) {
    await Bun.write("release_notes.txt", "### 🎉 首次发布");
    return;
  }

  // Get commit history
  const commits = await git("log", `${latestTag}..HEAD`, "--pretty=format:%s");
  
  if (!commits) {
    await Bun.write("release_notes.txt", "### ℹ️ 无新更改");
    return;
  }

  const lines = commits.split("\n")
    .filter(line => !line.startsWith("Merge"));

  // Categorize commits
  const categories: CommitCategories = {
    chapters: lines.filter(l => /(main|review|edit)/i.test(l)).sort(),
    features: lines.filter(l => /feat:/i.test(l)),
    fixes: lines.filter(l => /fix:/i.test(l)),
    others: lines.filter(l => !/(main|review|edit|feat|fix):/i.test(l))
  };

  // Generate release notes
  const notes = [
    categories.chapters.length && `### 📚 章节更改\n${categories.chapters.join("\n")}`,
    categories.features.length && `### ✨ 新增功能\n${categories.features.join("\n")}`,
    categories.fixes.length && `### 🐛 问题修复\n${categories.fixes.join("\n")}`,
    categories.others.length && `### 🔧 其他更改\n${categories.others.join("\n")}`
  ].filter(Boolean).join("\n\n");

  await Bun.write("release_notes.txt", notes);
}

main().catch(console.error);
