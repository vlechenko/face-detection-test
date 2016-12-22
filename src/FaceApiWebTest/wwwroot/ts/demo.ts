﻿import sources from "./image-sources";
import loadBlobAsync from "./libs/load-blob";
import loadImageAsync from "./libs/load-image";
import blobToBase64Async from "./libs/blob-to-base64";

import * as R from "./face-detection/rect";
import * as azure from "./face-detection/azure";
import * as google from "./face-detection/google";
import * as detector from "./face-detection/detector";
import * as api from "./api-keys";

function drawRects(rects: R.IRectangle[], style: string, ctx: CanvasRenderingContext2D): void {
    for (let rect of rects) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = style;
        ctx.rect(rect.left, rect.top, rect.width, rect.height);
        ctx.stroke();
    }
}

async function run(): Promise<void> {
    const list = document.getElementById("list") as HTMLUListElement;

    try {
        let detected = 0;
        let total = 0;

        for (let src of sources()) {
            const blob = await loadBlobAsync(src);
            const img = await loadImageAsync(src);

            const canvas = document.createElement("canvas");
            canvas.width = 300;
            canvas.height = 200;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            const googleResult = document.createElement("span");
            const azureResult = document.createElement("span");
            const detectorResult = document.createElement("span");
            googleResult.style.color = "red";
            azureResult.style.color = "blue";
            detectorResult.style.color = "black";

            const li = document.createElement("li");
            li.appendChild(canvas);
            const p = document.createElement("p");
            p.appendChild(googleResult);
            p.appendChild(azureResult);
            p.appendChild(detectorResult);
            li.appendChild(p);

            list.appendChild(li);

            const gPromise = blobToBase64Async(blob)
                .then(content => google.faceDetectionAsync(content, api.keys.google))
                .then(rects => {
                    drawRects(rects, 'rgba(255, 0, 0, 0.75)', ctx);
                    googleResult.innerText = rects.length > 0 ? "google" : "";
                }, e => {
                    googleResult.innerText = "google: error";
                });

            const aPromise = azure.faceDetectionAsync(blob, api.keys.azure)
                .then(rects => {
                    drawRects(rects, 'rgba(0, 0, 255, 0.75)', ctx);
                    azureResult.innerText = rects.length > 0 ? "azure" : "";
                }, e => {
                    azureResult.innerText = "azure: error";
                });

            const dPromise = detector.faceDetectionAsync(img)
                .then(rects => {
                    drawRects(rects, 'rgba(0, 0, 0, 0.75)', ctx);
                    detectorResult.innerText = rects.length > 0 ? "detector" : "";
                }, e => {
                    detectorResult.innerText = "detector: error";
                });

            await Promise.all([gPromise, aPromise, dPromise]);
        }
    } catch (e) {
        alert(e);
    }
}

run();

export = 0;