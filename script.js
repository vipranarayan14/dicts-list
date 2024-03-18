import * as fs from "node:fs/promises";

const filePath = "./indic-dicts-index/dictionaryIndices.md";
const outputPath = "dicts_list.json";

const printProgress = (progress) => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write(progress);
};

const getDictUrls = async (dictionaryReposURLs) => {
  const dictUrls = [];

  for (const [index, repoURL] of dictionaryReposURLs.entries()) {
    printProgress(`Fetching ${index + 1} of ${dictionaryReposURLs.length}`);

    const response = await fetch(repoURL);

    if (response.ok) {
      const data = await response.text();

      const dictUrlsInRepo = data.split("\n").filter((line) => line !== "");

      dictUrls.push(...dictUrlsInRepo);
    }
  }

  return dictUrls;
};

const parseDictReposIndex = (dictReposIndex) => {
  return dictReposIndex
    .split("\n")
    .filter((line) => line.startsWith("<"))
    .map((line) => line.replace(/[<>]/g, "").trim())
    .filter((line) => line !== "");
};

const getDictDetailsFromURL = (dictURL, dictURLRegex) => {
  const match = dictURL.match(dictURLRegex);

  if (match == null) return null;

  const name = match.at(3) ?? "";
  const category = match.at(1) ?? "";
  const subcategory = match.at(2)?.replace(/\/$/, "") ?? "";
  const timestamp = match.at(4) ?? "";
  const size = match.at(5) ?? "";
  const url = encodeURI(match.at(0) ?? "");
  const fileName = `${name}__${timestamp}`;

  return {
    name,
    category,
    subcategory,
    timestamp,
    size,
    url,
    fileName,
  };
};

const parseDictUrls = (dictURLs) => {
  const dictURLRegex =
    /https:\/\/github.com\/indic-dict\/stardict-(.*?)\/raw\/gh-pages\/(.*?)tars\/(.*?)__(.*?)__(.*?).tar.gz/;

  // TODO: handle dict urls that do not conform to `dictionaryURLRegex`
  const dictDetailsList = dictURLs
    .map((dictURL) => getDictDetailsFromURL(dictURL, dictURLRegex))
    .filter((dictDetails) => dictDetails !== null);

  return dictDetailsList;
};

try {
  const dictReposIndex = await fs.readFile(filePath, "utf-8");

  const dictReposUrls = parseDictReposIndex(dictReposIndex);

  const dictUrls = await getDictUrls(dictReposUrls);

  const dictsList = parseDictUrls(dictUrls);

  const dictsListJson = JSON.stringify(dictsList, null, 4);

  await fs.writeFile(outputPath, dictsListJson, "utf-8");

  console.log(`Output written to ${outputPath}`);
} catch (err) {
  console.error(err);
}
