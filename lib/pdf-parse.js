const co = require('co');
let PDFJS = null;

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

const DEFAULT_OPTIONS = {
    pagerender: render_page,
    max: 0,
    //check https://mozilla.github.io/pdf.js/getting_started/
    version: 'v1.9.426'
}

function* PDF(dataBuffer, options) {
    let ret = {
        numpages: 0,
        numrender: 0,
        info: null,
        metadata: null,
        text: "",
        version: null
    };

    if (typeof options == 'undefined') options = DEFAULT_OPTIONS;
    if (typeof options.pagerender != 'function') options.pagerender = DEFAULT_OPTIONS.pagerender;
    if (typeof options.max != 'number') options.max = DEFAULT_OPTIONS.max;
    if (typeof options.version != 'string') options.version = DEFAULT_OPTIONS.version;
    if (options.version == 'default') options.version = DEFAULT_OPTIONS.version;

    PDFJS = PDFJS || require(`./pdf.js/${options.version}/build/pdf.js`);

    ret.version = PDFJS.version;

    // Disable workers to avoid yet another cross-origin issue (workers need
    // the URL of the script to be loaded, and dynamically loading a cross-origin
    // script does not work).
    PDFJS.disableWorker = true;
    let doc = yield PDFJS.getDocument(dataBuffer);
    ret.numpages = doc.numPages;

    let metaData = yield doc.getMetadata();

    ret.info = metaData.info;
    ret.metadata = metaData.metadata;

    let counter = options.max <= 0 ? doc.numPages : options.max;
    counter = counter > doc.numPages ? doc.numPages : counter;

    for (var i = 1; i <= counter; i++) {
        yield doc.getPage(i).then(pageData => options.pagerender(pageData, ret));
    }

    ret.numrender = counter;
    doc.destroy();

    return ret;
}

module.exports = co.wrap(PDF);
