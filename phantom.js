// Phantom.js

function expect(obj, keys) {
  return keys.every(k => Object.prototype.hasOwnProperty.call(obj, k));
}

function findMissing(input, expected) {
  return expected.filter(k => !Object.prototype.hasOwnProperty.call(input, k));
}

function random(a = null, b = null) {
    if(a == null && b == null) {
        return Math.floor(Math.random() * 101);
    } else if(a != null && b == null) {
        return Math.floor(Math.random() * a);
    } else if(a != null && b != null) {
        let min;
        let max;
        if(a > b) {
            min = Math.ceil(b);
            max = Math.floor(a);
            return Math.floor(Math.random() * (max - min)) + min;
        } else if(a < b) {
            min = Math.ceil(a);
            max = Math.floor(b);
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            return Math.floor(Math.random() * a);
        }
    }
}

function is(item, targetClass) {
    return item instanceof targetClass;
}

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getRemoteImg(url) {
  try {
    const res = await fetch(url);
    const blob = res.blob();
    return URL.createObjectURL(blob);
  } catch(err) {
    console.error("An error occured: " + err);
    return null;
  }
}

async function getRemoteAudio(url) {
  const ctx = new window.AudioContext();
  try {
    const res = await fetch(url);
    if(!res.ok) throw new Error("An HTTP error occured: " + res.status);
    const arrBuffer = await res.arrayBuffer();
    const audBuffer = await ctx.decodeAudioData(arrBuffer);
    const source = ctx.createBufferSource();
    source.buffer = audBuffer;
    source.connect(ctx.destination);
    return source;
  } catch(err) {
    console.error("An error occured: " + err);
    return null;
  }
}

/**
 * A function to download content.
 * @param {string} cont - The content to be downloaded.
 * @param {string} type - The file type.
 * @param {string} name - The filename.
 * @param {string} ext - The file extension.
 */
function download(cont, type, name, ext) {
  const blob = new Blob([cont], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.href = url;
  a.download = `${name}.${ext}`;
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadJSON(cont, name, space = 4) {
  download(JSON.stringify(cont, null, space), "application/json", name, "json");
}

export { expect, findMissing, random, is, wait, getRemoteImg, getRemoteAudio, download, downloadJSON };