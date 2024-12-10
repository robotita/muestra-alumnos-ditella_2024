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

export const dataURL = "json/respuestas-form_2024.json";

//export const dataURL = (anio) => `json/respuestas-form_${anio}.json`;