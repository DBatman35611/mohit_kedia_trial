const chokidar = require('chokidar');
const mammoth = require('mammoth');
const marked = require('marked');
const fs = require('fs-extra');
const path = require('path');

// Configure marked for security
marked.setOptions({
    headerIds: false,
    mangle: false
});

// Paths
const DOCS_DIR = path.join(__dirname, 'blog', 'documents');
const MARKDOWN_DIR = path.join(__dirname, 'blog', 'markdown');
const HTML_DIR = path.join(__dirname, 'blog', 'html');

// Ensure directories exist
fs.ensureDirSync(DOCS_DIR);
fs.ensureDirSync(MARKDOWN_DIR);
fs.ensureDirSync(HTML_DIR);

// Convert docx to markdown
async function convertDocxToMarkdown(docxPath) {
    try {
        const result = await mammoth.convertToMarkdown({ path: docxPath });
        const markdown = result.value;
        const fileName = path.basename(docxPath, '.docx');
        const markdownPath = path.join(MARKDOWN_DIR, `${fileName}.md`);
        await fs.writeFile(markdownPath, markdown);
        return markdownPath;
    } catch (error) {
        console.error('Error converting docx to markdown:', error);
        throw error;
    }
}

// Convert markdown to HTML
async function convertMarkdownToHtml(markdownPath) {
    try {
        const markdown = await fs.readFile(markdownPath, 'utf-8');
        const html = marked.parse(markdown);
        const fileName = path.basename(markdownPath, '.md');
        const htmlPath = path.join(HTML_DIR, `${fileName}.html`);
        
        // Create HTML template
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    <link rel="stylesheet" href="/public/styles.css">
    <link rel="stylesheet" href="/public/header.css">
    <link rel="stylesheet" href="/public/footer.css">
    <link rel="stylesheet" href="/public/blog.css">
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet">
</head>
<body>
    <div class="page-wrapper">
        <div class="header">
            <div class="left-box">
                <img src="/CA_logo_2.png" alt="Company Logo">
            </div>
            <div class="section yellow">
                <a href="/index.html">Mohit Kedia & Associates</a>
            </div>
            <div class="section orange">
                <div class="hamburger-menu" onclick="toggleMenu()">
                    &#9776;
                </div>
                <div class="sub-sections">
                    <a class="sub-section home" href="/index.html">Home</a>
                    <a class="sub-section About" href="/about.html">About us</a>
                    <a class="sub-section Services" href="/services.html">Services</a>
                    <a class="sub-section Blog" href="/blog.html">Blog</a>
                    <a class="sub-section Laws" href="/laws.html">Legal</a>
                    <a class="sub-section Contact" href="/contact.html">Contact us</a>
                </div>
            </div>
        </div>

        <div class="green-banner">
            <p>${fileName.replace(/-/g, ' ')}</p>
        </div>

        <div class="blog-content">
            ${html}
        </div>
    </div>
    <div id="footer" class="footer">
        <div class="footer-quick-links">
            <div class="footer-links-title">Quick Links</div>
            <div class="footer-links">
                <a href="/disclaimer.html">Disclaimer</a>
                <a href="/laws.html">Rules & Reg</a>
            </div>
        </div>
    </div>
    <script src="/public/header.js"></script>
    <script src="/public/script.js"></script>
</body>
</html>`;

        await fs.writeFile(htmlPath, htmlContent);
        return htmlPath;
    } catch (error) {
        console.error('Error converting markdown to HTML:', error);
        throw error;
    }
}

// Process a new docx file
async function processNewDocx(docxPath) {
    try {
        // Skip temporary Word files
        if (path.basename(docxPath).startsWith('~$')) {
            console.log(`Skipping temporary file: ${docxPath}`);
            return;
        }

        console.log(`Processing docx file: ${docxPath}`);
        const markdownPath = await convertDocxToMarkdown(docxPath);
        const htmlPath = await convertMarkdownToHtml(markdownPath);
        console.log(`Successfully processed ${docxPath} to ${htmlPath}`);
    } catch (error) {
        console.error('Error processing docx file:', error);
    }
}

// Process all existing docx files
async function processExistingFiles() {
    try {
        const files = await fs.readdir(DOCS_DIR);
        for (const file of files) {
            if (file.endsWith('.docx') && !file.startsWith('~$')) {
                await processNewDocx(path.join(DOCS_DIR, file));
            }
        }
    } catch (error) {
        console.error('Error processing existing files:', error);
    }
}

// Watch for new docx files
const watcher = chokidar.watch(path.join(DOCS_DIR, '*.docx'), {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true
});

// Process existing files when starting up
processExistingFiles().then(() => {
    console.log('Finished processing existing files');
});

watcher
    .on('add', processNewDocx)
    .on('change', processNewDocx)
    .on('unlink', async (filePath) => {
        const fileName = path.basename(filePath, '.docx');
        try {
            await fs.remove(path.join(MARKDOWN_DIR, `${fileName}.md`));
            await fs.remove(path.join(HTML_DIR, `${fileName}.html`));
            console.log(`Removed processed files for ${fileName}`);
        } catch (error) {
            console.error('Error removing processed files:', error);
        }
    });

console.log('Blog processor started. Watching for new docx files...'); 