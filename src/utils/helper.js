export const handleOpenLink = (link) => {
  let url = link;
  if (!url.match(/^https?:\/\//i)) {
    url = "http://" + url;
  }
  window.open(url, "_blank");
};
