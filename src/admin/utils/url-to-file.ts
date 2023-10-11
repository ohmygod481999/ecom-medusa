const toDataURL = async (url: string): Promise<string> =>
  fetch(url)
    .then(response => response.blob())
    .then(
      blob =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }),
    );

function dataURLtoFile(dataurl: string, filename: string): File {
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mime});
}

export const urlToFile = async (
  url: string,
  fileName: string,
): Promise<File> => {
  const dataUrl = await toDataURL(url);

  return dataURLtoFile(dataUrl, fileName);
};
