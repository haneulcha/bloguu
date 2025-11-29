#!/usr/bin/env node
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { format } from 'date-fns';

const today = new Date();
const fileName = format(today, 'yyyy-MM-dd');
const formattedDate = format(today, "MMM dd yyyy");

const template = `---
title: "New Post"
description: "Description of your post"
pubDate: "${formattedDate}"
tags: []
---

Write your content here...
`;

async function createPost() {
  try {
    const filePath = join(process.cwd(), 'src', 'content', 'blog', `${fileName}.mdx`);
    await writeFile(filePath, template);
    console.log(`✨ 새 포스트가 생성되었습니다: ${filePath}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createPost();