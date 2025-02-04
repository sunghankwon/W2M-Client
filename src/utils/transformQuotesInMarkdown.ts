async function transformQuotesInMarkdown(markdown: string): Promise<string> {
  const markdownSentences = markdown.split(`\n`);
  const transformedArray = markdownSentences.map((str) => {
    const pattern = /(?:\*\*)?(?:<u>)?\((.*?)#\)(?:<\/u>)?(?:\*\*)?/g;
    const transformedStr = str.replace(pattern, (match, p1) => {
      const cleanedQuote = p1.replace(/(\*\*|_|<u>|<\/u>)/g, "");
      return `> ${cleanedQuote}`;
    });
    return transformedStr;
  });

  return transformedArray.join("\n");
}

export default transformQuotesInMarkdown;
