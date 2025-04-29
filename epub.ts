import { readdir, readFile, writeFile, mkdir, cp } from "fs/promises";
import { join } from "path";
import matter from "gray-matter";
import { marked } from "marked";
import { exec } from "child_process";
import { promisify } from "util";
import archiver from 'archiver';
import { createWriteStream } from "fs";

const run = promisify(exec);

const CHAPTERS_DIR = "chapters";
const TEMPLATE_DIR = "template";
const BUILD_DIR = "build";
const OUTPUT_EPUB = join(BUILD_DIR, "build.epub");

// Helpers
const pad = (n: number) => String(n).padStart(4, "0");

// Load chapter template
const chapterTemplatePath = join(
  TEMPLATE_DIR,
  "OEBPS",
  "Text",
  "ChapterTemplate.xhtml"
);
const chapterTemplate = await readFile(chapterTemplatePath, "utf-8");

// Parse chapters
const files = (await readdir(CHAPTERS_DIR)).filter((f) => f.endsWith(".md"));
const chapters: {
  index: number;
  title: string;
  content: string;
  footnotes: string[];
}[] = [];

for (const file of files) {
  const mdRaw = await readFile(join(CHAPTERS_DIR, file), "utf-8");
  const parsed = matter(mdRaw);
  const { index, title } = parsed.data;
  if (typeof index !== "number" || typeof title !== "string") {
    console.warn(`⚠️ 跳过 ${file}，缺少有效元数据`);
    continue;
  }

  let footnoteId = 1;
  const footnotes: string[] = [];
  const htmlContent = await marked(
    parsed.content.replace(/\^\[(.+?)\]/g, (_, note) => {
      footnotes.push(note.trim());
      return `<sup><a class="duokan-footnote" href="#note_${footnoteId}" id="noteref_${footnoteId}"><img src="../Images/note.png"/></a></sup>`;
    })
  );

  const footHTML = footnotes
    .map(
      (note, i) =>
        `<li class="duokan-footnote-item" id="note_${
          i + 1
        }"><a href="#noteref_${i + 1}">(${i + 1})</a>${note}</li>`
    )
    .join("\n");

  chapters.push({ index, title, content: htmlContent, footnotes: footnotes });

  // Render chapter file
  const rendered = chapterTemplate
    .replace(/{{\s*title\s*}}/g, title)
    .replace(/{{\s*content\s*}}/g, htmlContent)
    .replace(/{{\s*footnote\s*}}/g, footHTML);

  const outPath = join(
    TEMPLATE_DIR,
    "OEBPS",
    "Text",
    `Chapter${pad(index)}.xhtml`
  );
  await writeFile(outPath, rendered, "utf-8");
  console.log(`✅ 输出章节 Chapter${pad(index)}.xhtml`);
}

// Append to content.opf
const opfPath = join(TEMPLATE_DIR, "OEBPS", "content.opf");
let opf = await readFile(opfPath, "utf-8");
const manifestInsert = chapters
  .map(
    ({ index }) =>
      `<item id="chapter${index}" href="Text/Chapter${pad(
        index
      )}.xhtml" media-type="application/xhtml+xml"/>`
  )
  .join("\n");
const spineInsert = chapters
  .map(({ index }) => `<itemref idref="chapter${index}"/>`)
  .join("\n");
opf = opf.replace("</manifest>", `${manifestInsert}\n</manifest>`);
opf = opf.replace("</spine>", `${spineInsert}\n</spine>`);
await writeFile(opfPath, opf, "utf-8");

// Append to nav.xhtml
const navPath = join(TEMPLATE_DIR, "OEBPS", "Text", "nav.xhtml");
let nav = await readFile(navPath, "utf-8");
const liInsert = chapters
  .map(
    ({ index, title }) =>
      `<li><a href="Chapter${pad(index)}.xhtml">${title}</a></li>`
  )
  .join("\n");
nav = nav.replace("</ol>", `${liInsert}\n</ol>`);
await writeFile(navPath, nav, "utf-8");

// Copy template to build/
await cp(TEMPLATE_DIR, BUILD_DIR, { recursive: true });

// Generate .epub
const output = createWriteStream(OUTPUT_EPUB);
const archive = archiver("zip", { zlib: { level: 9 } });

archive.on("error", (err) => {
  throw err;
});

archive.pipe(output);

// Add mimetype file with no compression
archive.append("application/epub+zip", { name: "mimetype", store: true });

// Add META-INF and OEBPS directories
archive.directory(join(BUILD_DIR, "META-INF"), "META-INF");
archive.directory(join(BUILD_DIR, "OEBPS"), "OEBPS");

await archive.finalize();




console.log(`📘 EPUB 打包完成: ${OUTPUT_EPUB}`);
