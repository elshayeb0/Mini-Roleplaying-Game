const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

async function copy(src, dest) {
  const stat = await fs.promises.stat(src).catch(()=>null);
  if (!stat) return;
  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const items = await fs.promises.readdir(src);
    await Promise.all(items.map(i => copy(path.join(src, i), path.join(dest, i))));
  } else {
    await fs.promises.mkdir(path.dirname(dest), { recursive: true });
    await fs.promises.copyFile(src, dest);
  }
}

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['main.js'],
      bundle: true,
      minify: true,
      outfile: 'dist/main.js',
      platform: 'browser'
    });

    // copy static files
    await copy('index.html', 'dist/index.html');
    await copy('style.css', 'dist/style.css');
    await copy('README.md', 'dist/README.md');
    await copy('assets', 'dist/assets');

    console.log('Build complete — files in dist/');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

build();
