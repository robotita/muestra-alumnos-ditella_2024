// api.js
export const getDataURL = (anio) => `json/respuestas-form_${anio}.json`;

export const fetchData = async (anio) => {
  try {
    const dataURL = getDataURL(anio);
    const response = await fetch(dataURL);
    if (response.ok) {
      const jsonData = await response.json();
      return jsonData;
    } else {
      console.error(`Failed to fetch data for year ${anio}`);
      return null;
    }
  } catch (error) {
    console.error(`An error occurred fetching data for year ${anio}:`, error);
    return null;
  }
};