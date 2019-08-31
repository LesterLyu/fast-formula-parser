const fs = require("fs");
const chevrotain = require("chevrotain");
const {Parser} = require("../grammar/parsing");

// extract the serialized grammar.
const parserInstance = new Parser();
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = chevrotain.createSyntaxDiagramsCode(serializedGrammar);

// Write the HTML file to disk
fs.writeFileSync("./docs/generated_diagrams.html", htmlText);
