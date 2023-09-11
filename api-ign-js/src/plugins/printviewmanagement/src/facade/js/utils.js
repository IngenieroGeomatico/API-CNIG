import { getValue } from './i18n/language';
// eslint-disable-next-line import/first
import JsZip from 'jszip';
// eslint-disable-next-line import/first
import { saveAs } from 'file-saver';

// ID and CLASS
const LOADING_CLASS = 'printing';
const CONTAINER_QUEUE_CLASS = 'm-printviewmanagement-queue';
const FINISHED_CLASS = 'finished';
const ID_QUEUE_CONTAINER = '#m-georefimage-queue-container';
// FORMAT IMAGE (png|jpeg)
const REGEX_FORMAT_IMAGE = /^data:image\/(png|jpeg);base64,/;

/**
* This function creates list element.
*
* @public
* @function
* @api stable
*/
export function createQueueElement(title) {
  const queueElem = document.createElement('li');
  queueElem.innerHTML = title || getValue('notitle');
  return queueElem;
}

// Show Container Queue
export function showQueueElement(element) {
  const e = element;
  if (e.style.display === 'none') {
    e.style.display = 'block';
  }
}


// Return container queue
export function getQueueContainer(html) {
  return html.querySelector(ID_QUEUE_CONTAINER);
}

// Insert element in Container Queue
export function innerQueueElement(html, elementTitle) {
  const elementQueueContainer = getQueueContainer(html);
  showQueueElement(html.querySelector(`.${CONTAINER_QUEUE_CLASS}`));
  const queueEl = createQueueElement(elementTitle.value);
  if ([...elementQueueContainer.childNodes].length > 0) {
    elementQueueContainer.insertBefore(queueEl, elementQueueContainer.firstChild);
  } else {
    elementQueueContainer.appendChild(queueEl);
  }
  queueEl.classList.add(LOADING_CLASS);
  return queueEl;
}

// Remove element in Container Queue
export function removeLoadQueueElement(queueEl) {
  queueEl.classList.remove(LOADING_CLASS);
  queueEl.classList.add(FINISHED_CLASS);
}

// Remove all element Container Queue
export function removeQueueElements(html) {
  const elementQueueContainer = getQueueContainer(html);
  const elements = [...elementQueueContainer.childNodes];
  if (elements.length === 0) { return; }

  elements.forEach((element) => {
    elementQueueContainer.removeChild(element);
  });

  elementQueueContainer.parentElement.style.display = 'none';
}

// Generate wld file
export function createWLD(bbox, dpi, size) {
  const Px = (((bbox[2] - bbox[0]) / size[0]) * (72 / dpi)).toString();
  const GiroA = (0).toString();
  const GiroB = (0).toString();
  const Py = (-((bbox[3] - bbox[1]) / size[1]) * (72 / dpi)).toString();
  const Cx = (bbox[0] + (Px / 2)).toString();
  const Cy = (bbox[3] + (Py / 2)).toString();
  return Px.concat('\n', GiroA, '\n', GiroB, '\n', Py, '\n', Cx, '\n', Cy);
}

// Create jsZip file
export function createZipFile(files, type, titulo) {
  const zip = new JsZip();

  files.forEach(({ name, data, base64 }) => {
    zip.file(name, data, { base64 });
  });

  zip.generateAsync({ type: 'blob' }).then((content) => {
    // see FileSaver.js
    saveAs(content, titulo.concat(type));
  });
}

// Generate title
export function generateTitle(titulo = '') {
  if (titulo === '' || titulo === getValue('notitle')) {
    const f = new Date();
    return 'mapa_'.concat(f.getFullYear(), '-', f.getMonth() + 1, '-', f.getDay() + 1, '_', f.getHours(), f.getMinutes(), f.getSeconds());
  }
  return titulo;
}

// Get base64 image
export function getBase64Image(imgUrl, format) {
  const formatType = format || 'jpeg';
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.setAttribute('crossorigin', 'anonymous');
    img.src = imgUrl;
    img.onload = function can() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL(`image/${formatType}`, 1.0);
      resolve(dataURL.replace(REGEX_FORMAT_IMAGE, ''));
    };

    img.onerror = function rej() {
      Promise.reject(new Error(getValue('exception.loaderror')));
      M.dialog.error(getValue('exception.imageError'));
    };
  });
}

// Get base64 image client
export function getBase64ImageClient(canvasMap, format) {
  const formatType = format || 'jpeg';
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Establece el atributo crossOrigin en 'anonymous' para permitir el acceso a recursos de origen cruzado.
    img.src = canvasMap.toDataURL(); // Convierte el canvas original a una URL de imagen base64


    img.onload = function can() {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL(`image/${formatType}`).replace(REGEX_FORMAT_IMAGE, ''));
    };

    img.onerror = function rej() {
      reject(new Error(getValue('exception.loaderror')));
      M.dialog.error(getValue('exception.imageError'));
    };
  });
}

// Services SIG Geoprint List
export const LIST_SERVICES = `
    <section>
      <h1>TO-DO DEFINIR</h1>
    </section>
   
`;
