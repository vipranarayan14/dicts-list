import { readFile } from 'node:fs/promises';

const filePath = './indic-dicts-index/dictionaryIndices.md';

try {
  const content = await readFile(filePath, 'utf-8');
  console.log(content);
} catch (err) {
  console.error(err);
}
