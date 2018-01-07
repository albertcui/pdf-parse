# pdf-parse
> **Pure javascript module to extract text from PDF**

![logo](https://assets.gitlab-static.net/uploads/-/system/project/avatar/5077237/pdf-parse.png)

[![version](https://img.shields.io/npm/v/pdf-parse.svg)](https://www.npmjs.org/package/pdf-parse)
[![downloads](https://img.shields.io/npm/dt/pdf-parse.svg)](https://www.npmjs.org/package/pdf-parse)
[![node](https://img.shields.io/node/v/pdf-parse.svg)](https://nodejs.org/)
[![status](https://gitlab.com/autokent/pdf-parse/badges/master/pipeline.svg)](https://gitlab.com/autokent/pdf-parse/pipelines)

## Installation
`npm install pdf-parse`

## Similar Packages

* [pdf2json](https://www.npmjs.com/package/pdf2json) buggy,no support anymore, memory leak, throws a non-catchable fatal error.
* [j-pdfjson](https://www.npmjs.com/package/j-pdfjson) fork of pdf2json.
* [pdf-parser](https://github.com/dunso/pdf-parse) buggy, no test.
* [pdfreader](https://www.npmjs.com/package/pdfreader) using pdf2json.
* [pdf-extract](https://www.npmjs.com/package/pdf-extract) non-cross platform using xpdf.
 

## Basic Usage - Local Files
```js
const fs = require('fs');
const PDF = require('pdf-parse');

let dataBuffer = fs.readFileSync('path to PDF file...');

PDF(dataBuffer).then(function(data) {

	// number of pages
	console.log(data.numpages);

	// number of rendered pages
	console.log(data.numrender);

	// PDF info
	console.log(data.info);

	// PDF metadata
	console.log(data.metadata); 

	// PDF.js version
	// check https://mozilla.github.io/pdf.js/getting_started/
	console.log(data.version);

	// PDF text
	console.log(data.text); 
        
});
```


## Basic Usage - HTTP
> You can use  [crawler-request](https://www.npmjs.com/package/crawler-request) which use the `pdf-parse`


## Extend
If you need another format like json, you can change page render behaviour with a callback.
```js
function render_page(pageData, ret) {
	//check documents https://mozilla.github.io/pdf.js/
	ret.text = ret.text ? ret.text : "";

	let render_options = {
		//replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
		normalizeWhitespace: true,
		//do not attempt to combine same line TextItem's. The default value is `false`.
		disableCombineTextItems: false
	}

	return pageData.getTextContent(render_options)
		.then(function(textContent) {
			let strings = textContent.items.map(item => item.str);
			let text = strings.join(' ');
			ret.text = `${ret.text} ${text} \n\n`;
		});
}

let options = {
    pagerender: render_page
}

let dataBuffer = fs.readFileSync('path to PDF file...');

PDF(dataBuffer,options).then(function(data) {
	//use new format
});

```


## Options

# Default Options
```js
    pagerender: render_page,
    max: 0,
    version: 'v1.9.426'
```
# pagerender - function
If you need to change raw text format.

# max - number
Max number of page to render. If tha value is less than or equal to 0, parser renders all pages. 

# version - PDF.js version - string
check [https://mozilla.github.io/pdf.js/getting_started/](https://mozilla.github.io/pdf.js/getting_started/)

* 'default' uses default version (v1.9.426)
* 'v1.9.426' stable version
* 'v1.10.88' beta

## Test
`mocha` or `npm test`

> check test folder and QUICKSTART.js for extra usage.

## Contact me on WhatsApp
> For discussing about the package.

[![WhatsApp](https://img.shields.io/badge/style-WhatsApp-green.svg?style=flat&label=0%20506%20304%2024%2080)](https://api.whatsapp.com/send?phone=905063042480&text=Hi%2C%0ALet%27s%20talk%20about%20pdf-parse)