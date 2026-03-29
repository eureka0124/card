/**
 * 정적 명함 사이트 빌드: dist/에 배포용 파일을 복사합니다.
 * GitHub Actions의 setup-node는 package.json engines와 맞추면 됩니다.
 */
const fs = require("fs");
const path = require("path");

const root = __dirname;
const dist = path.join(root, "dist");

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

function main() {
  const indexPath = path.join(root, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("build: index.html 이 없습니다.");
    process.exit(1);
  }

  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  fs.copyFileSync(indexPath, path.join(dist, "index.html"));

  const assetsDir = path.join(root, "assets");
  if (fs.existsSync(assetsDir)) {
    copyRecursive(assetsDir, path.join(dist, "assets"));
  }

  console.log("build: 완료 → dist/");
}

main();
