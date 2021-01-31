import fs from "fs";
import {createSyntaxDiagramsCode} from "chevrotain";
import {Parser} from "./parsing";

// extract the serialized grammar.
const parserInstance = new Parser();
const serializedGrammar = parserInstance.getSerializedGastProductions();

// create the HTML Text
const htmlText = createSyntaxDiagramsCode(serializedGrammar);

if (!fs.existsSync('./docs')){
    fs.mkdirSync('./docs');
}
// Write the HTML file to disk
fs.writeFileSync("./docs/generated_diagrams.html", htmlText);
