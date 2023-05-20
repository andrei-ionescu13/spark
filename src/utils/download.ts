export const download = (blob, fileName) => {
  const url = window.URL.createObjectURL(new Blob([blob]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute(
    "download",
    fileName
  );
  document.body.appendChild(link);
  link.click();

  // Clean up and remove the link
  link.parentNode.removeChild(link);
}