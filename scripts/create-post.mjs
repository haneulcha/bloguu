#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import { format } from 'date-fns';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BLOG_CONTENT_DIR = path.join(__dirname, '../src/content');

program
  .name('create-post')
  .description('Create a new blog post with a template')
  .option('-t, --type <type>', 'Post type (blog, films, bobs-burgers)', 'blog')
  .parse(process.argv);

const options = program.opts();

async function createPost() {
  const { title, description } = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: '제목을 입력하세요:',
      validate: (input) => input.length > 0 || '제목은 필수입니다.',
    },
    {
      type: 'input',
      name: 'description',
      message: '설명을 입력하세요:',
      validate: (input) => input.length > 0 || '설명은 필수입니다.',
    },
  ]);

  const today = new Date();
  const fileName = `${format(today, 'yyyy-MM-dd')}.mdx`;
  const formattedDate = format(today, 'MMM dd yyyy');
  
  const contentDir = path.join(BLOG_CONTENT_DIR, options.type);
  const filePath = path.join(contentDir, fileName);

  const template = `---
title: "${title}"
description: "${description}"
pubDate: "${formattedDate}"
---

`;

  try {
    await fs.mkdir(contentDir, { recursive: true });
    await fs.writeFile(filePath, template);
    console.log(`✨ 새 글이 생성되었습니다: ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createPost();