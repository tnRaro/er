const fs = require("fs");
const path = require("path");

const PUBLIC_DIR = path.resolve(__dirname, "../public/");

const rules = [
  {
    path: "c",
    pattern: /^CharLobby_(\d{3}).png$/,
    rename: (_, $1) => + $1 + ".png"
  },
  {
    path: "i",
    pattern: /^ItemIcon_(\d{6}).png$/,
    rename: (_, $1) => + $1 + ".png"
  }
];

for (const rule of rules) {
  const rulePath = path.resolve(PUBLIC_DIR, rule.path);
  for (const filename of fs.readdirSync(rulePath)) {
    if (rule.pattern.test(filename)) {
      const oldPath = path.resolve(rulePath, filename);
      const newPath = path.resolve(rulePath, filename.replace(rule.pattern, rule.rename));
      fs.renameSync(oldPath, newPath);
    }
  }
}