export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  const htmlStrings = list.map(templateFn);
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const response = await fetch(path);
  return response.text();
}

export async function loadHeaderFooter() {
  const header = document.querySelector("#main-header");
  const footer = document.querySelector("#main-footer");

  if (!header || !footer) {
    return;
  }

  const basePath = import.meta.env.BASE_URL;
  let [headerTemplate, footerTemplate] = await Promise.all([
    loadTemplate(`${basePath}partials/header.html`),
    loadTemplate(`${basePath}partials/footer.html`),
  ]);

  headerTemplate = headerTemplate.replaceAll("__BASE_URL__", basePath);
  footerTemplate = footerTemplate.replaceAll("__BASE_URL__", basePath);

  renderWithTemplate(headerTemplate, header);
  renderWithTemplate(footerTemplate, footer);
}
