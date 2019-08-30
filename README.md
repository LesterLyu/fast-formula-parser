## [A Fast Excel Formula Parser](https://github.com/LesterLyu/fast-formula-parser)
> **This project is under developments and not ready to publish.**

Aim to be the fastest and the most reliable excel formula parser in javascript. Using **LL(1)** parser.
### [Documentation](https://lesterlyu.github.io/fast-formula-parser/)
### [Grammar Diagram](https://lesterlyu.github.io/fast-formula-parser/generated_diagrams.html)
### Background

Inspired by [XLParser](https://github.com/spreadsheetlab/XLParser/blob/master/src/XLParser/ExcelFormulaGrammar.cs)
and the paper ["A Grammar for Spreadsheet Formulas Evaluated on Two Large Datasets" by Efthimia Aivaloglou, David Hoepelman and Felienne Hermans](https://fenia266781730.files.wordpress.com/2019/01/07335408.pdf).

Note: The grammar in my implementation is different from theirs. My implementation gets rid of ambiguities to boost the performance.

### What is not supported:
 - [External reference](https://support.office.com/en-ie/article/create-an-external-reference-link-to-a-cell-range-in-another-workbook-c98d1803-dd75-4668-ac6a-d7cca2a9b95f)
    - Anything with `[` and `]`
 - Ambigious old styles
    - Sheet name contains `:`, e.g. `SUM('1003:1856'!D6)`
    - Sheet name with space that is not quoted, e.g. `I am a sheet!A1`
 - `SUM(Sheet2:Sheet3!A1:C3)`
 - You tell me
    
### Performance
  - The expected performace is at least 3x faster than my optimized [formula-parser](https://github.com/LesterLyu/formula-parser)
  with *more syntax suppoort*.
  
### Dependency
  - [Chevrotain](https://github.com/SAP/chevrotain) , thanks to this great parser building toolkit.
  
