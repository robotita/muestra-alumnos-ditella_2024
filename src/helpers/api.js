// api.js
export const fetchData = async (dataURL) => {
  try {
    const response = await fetch(dataURL);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.error("Failed to fetch data from the URL");
      return null;
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return null;
  }
};

export const dataURL =
//"https://opensheet.elk.sh/1Y-w4R4bqReTZOH3Ci8PYhZ4TCR0ru-dZm-qUp_Q1-gU/Respuestas%20de%20formulario%201"; //original
"https://opensheet.elk.sh/1eAgJOrtx8oGLf1L43IxoydMOWqwnvM_vIE0Y8zmdj9E/Respuestas%20de%20formulario%201";
//googledocs > https://docs.google.com/spreadsheets/d/1eAgJOrtx8oGLf1L43IxoydMOWqwnvM_vIE0Y8zmdj9E/edit#gid=140568844

export const transformarURL = (url) => {
  const regex = /open\?id=([^&]+)/;
  const match = url.match(regex);
  const id = match[1];
  return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`; //NEW LINE OF CODE
  //return `https://drive.google.com/uc?id=${id}`; //OLD LINE OF CODE
};


export const thumbailImg = (url) => {
  const regex = /open\?id=([^&]+)/;
  const match = url.match(regex);
  const id = match[1];
  return `https://drive.google.com/thumbnail?id=${id}`;
};

export const iframeURL = (url) => {
  const regex = /open\?id=([^&]+)/;
  const match = url.match(regex);
  const id = match[1];
  return `https://drive.google.com/file/d/${id}/preview`;
};
