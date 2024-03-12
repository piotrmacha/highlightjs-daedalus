/**
 * Jasmine test spec. Use `npm test` to run this.
 * It is expected you will change "language" to match your language and update
 * the tests and test data for your language requirements.
 */
const hljs = require("highlight.js/lib/core");
const language = require("../src/languages/your-language");
const fs = require("fs");
const path = require("path");
const languageName = "your-language";
const testFileSourcePath = "../test/markup/" + languageName + "/sample.txt";
const testFileExpectedPath = "../test/markup/" + languageName + "/sample.expect.txt";
hljs.registerLanguage(languageName, language);

describe("highlight " + languageName, () => {
  it("defines your-language", () => {

    // highlight has language defined
    const language = hljs.getLanguage(languageName);
    expect(language).toBeDefined();
  });

  it ("highlights language string", () => {
    const string = "assign false builtin";
    const expected = '<span class="hljs-keyword">assign</span> <span class="hljs-literal">false</span> <span class="hljs-built_in">builtin</span>';
    const result = hljs.highlight(string, { language: languageName, ignoreIllegals: true });
    expect(result.language).toBe(languageName);
    expect(result.value).toBe(expected);
  });

  it("highlights language file", () => {

    // read the test data
    const input = fs.readFileSync(
      path.resolve(__dirname, testFileSourcePath),
      "utf-8"
    );

    // highlight the test data
    const result = hljs.highlight(input, { language: languageName, ignoreIllegals: true });
    expect(result.language).toBe(languageName);

    // verify the highlighting is what is expected
    const expected = fs.readFileSync(
      path.resolve(__dirname, testFileExpectedPath),
      "utf-8"
    );
    expect(result.value).toBe(expected);
  });
});
