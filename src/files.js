const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "src"); // Change if your project is elsewhere
const allFiles = [];
const usedFiles = new Set();

// Function to recursively scan for files
function scanDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".ts") || file.endsWith(".tsx")) {
      allFiles.push(fullPath);
    }
  });
}

// Scan the entire project
scanDir(projectRoot);

// Scan each file for imports
allFiles.forEach((file) => {
  const content = fs.readFileSync(file, "utf-8");
  allFiles.forEach((checkFile) => {
    if (content.includes(path.basename(checkFile, path.extname(checkFile)))) {
      usedFiles.add(checkFile);
    }
  });
});

// Find unused files
const unusedFiles = allFiles.filter((file) => !usedFiles.has(file));

console.log("🔍 Unused Files Found:");
console.log(unusedFiles.length ? unusedFiles : "No unused files found.");
