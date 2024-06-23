// src/app/utils/imageUtils.js
import fs from 'fs';
import path from 'path';

export function getRandomImagesFromSubfolders(mainFolder, numImages) {
    const imagePaths = [];
    const subdirs = fs.readdirSync(mainFolder);

    subdirs.forEach((subdir) => {
        const subdirPath = path.join(mainFolder, subdir);
        if (fs.lstatSync(subdirPath).isDirectory()) {
            const images = fs.readdirSync(subdirPath).map(img => path.join('/public', subdir, img));
            imagePaths.push(...images.slice(0, numImages));
        }
    });

    return imagePaths.sort(() => 0.5 - Math.random()).slice(0, numImages);
}
