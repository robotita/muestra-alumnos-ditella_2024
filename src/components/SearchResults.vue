<template>
  <div id="visualizador">
    <div class="slidecontainer">
      <input
        type="range"
        min="16"
        max="100"
        v-model="sliderValue"
        class="slider"
        id="myRange"
      />
    </div>

    <div id="showimg" @click="mostrarImagenes" :class="{ active: !mostrarImg }">
      <svg viewBox="0 0 100 80" width="40" height="40">
        <rect width="100" height="20"></rect>
        <rect y="30" width="100" height="20"></rect>
        <rect y="60" width="100" height="20"></rect>
      </svg>
    </div>

    <div id="showlist" @click="mostrarImagenes" :class="{ active: mostrarImg }">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        viewBox="0 0 512 512"
        id="IconChangeColor"
      >
        <title>ionicons-v5-i</title>
        <path
          d="M240,240H32V32H240Z"
          id="mainIconPathAttribute"
          stroke-width="0"
          stroke="#ff0000"
        ></path>
        <path
          d="M480,240H272V32H480Z"
          id="mainIconPathAttribute"
          stroke="#ff0000"
        ></path>
        <path
          d="M240,480H32V272H240Z"
          id="mainIconPathAttribute"
          stroke="#ff0000"
        ></path>
        <path
          d="M480,480H272V272H480Z"
          id="mainIconPathAttribute"
          stroke="#ff0000"
        ></path>
      </svg>
    </div>
  </div>

  <div id="contenedorListado" ref="scrollDivThumbs" @wheel="handleScroll">
    <ul id="alumnos" ref="scrollDivNombres">
      <li
        v-for="(alumno, id) in filteredAlumnos"
        :key="alumno.Page"
        :style="{
          fontSize: `${sliderValue}px`,
          width: `${sliderValue * 0.6}vw`,
        }"
        :class="{ seleccionado: alumno.id === alumnoSeleccionadoId }"
        :data-materia="
          JSON.stringify(Object.keys(getMateriasConImagenes(alumno)))
        "
      >
        <router-link
          :to="{
            path: `/alumno/${alumno.Nombre.toLowerCase()}-${alumno.Apellido.toLowerCase()}`,
            query: { anio },
          }"
        >
          <small>{{ alumno.Nombre }} {{ alumno.Apellido }} </small>

          <div
            v-for="(url, materia) in getMateriasConImagenes(alumno)"
            :key="materia"
          >
            <img
              :src="url"
              height="100"
              :style="{ height: `${sliderValue * 3}px` }"
              v-if="
                materia.startsWith(materiaSeleccionada + ' -') ||
                materiaSeleccionada === null
              "
            />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";
import { fetchData, dataURL } from "../helpers/api";

const props = defineProps({
  query: String,
  materiaSeleccionada: String,
  anio: Number,
});

const anio = computed(() => props.anio);
const alumnos = ref([]);
const sliderValue = ref(40);
const mostrarImg = ref(false);

onMounted(async () => {
  //console.log("mounted");
  const jsonData = await fetchData(dataURL);
  if (jsonData) {
    alumnos.value = jsonData;
  }
});

watch([sliderValue, mostrarImg], ([newSliderValue, newMostrarImg]) => {
  const divAlumnos = document.getElementById("alumnos");

  ajustarAnchoDiv(newMostrarImg, newSliderValue);
});

const filteredAlumnos = computed(() => {
  const query = props.query.toLowerCase();
  const materiaSeleccionada = props.materiaSeleccionada
    ? props.materiaSeleccionada.toLowerCase()
    : null;

  const sortedAlumnos = [...alumnos.value].sort((a, b) => {
    // Comparar apellidos en minúsculas
    const apellidoA = a.Apellido.toLowerCase();
    const apellidoB = b.Apellido.toLowerCase();

    if (apellidoA < apellidoB) return -1;
    if (apellidoA > apellidoB) return 1;
    return 0;
  });

  return sortedAlumnos.filter((s) => {
    const fullName = `${s.Nombre} ${s.Apellido}`.toLowerCase();
    const materias = Object.keys(getMateriasConImagenes(s))
      .join(" ")
      .toLowerCase();

    const nombreApellidoMatch = fullName.includes(query); // Filtrar por nombre y apellido

    // Filtrar por materia
    //const materiaMatch = !materiaSeleccionada || materias.startsWith(materiaSeleccionada);
    const materiaMatch =
      !materiaSeleccionada || materias.includes(materiaSeleccionada + " -");
    return nombreApellidoMatch && materiaMatch;
  });
});

//wheel
//const scrollDiv = ref(null);

const scrollDivThumbs = ref(null);
const scrollDivNombres = ref(null);

const handleScroll = (event) => {
  let container;

  if (mostrarImg.value === true) {
    container = scrollDivThumbs.value;
  } else {
    container = scrollDivNombres.value;
  }
  //const container = scrollDiv.value;
  const toLeft = event.deltaY < 0 && container.scrollLeft > 0;
  const toRight =
    event.deltaY > 0 &&
    container.scrollLeft < container.scrollWidth - container.clientWidth;

  if (toLeft || toRight) {
    event.preventDefault();
    container.scrollLeft += event.deltaY;
  }
};

//
const ajustarAnchoDiv = (mostrar, sliderValue) => {
  const divAlumnos = document.getElementById("alumnos");

  if (divAlumnos) {
    divAlumnos.style.width = "";

    if (mostrar) {
      if (sliderValue < 20) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 12 //6.5
        }px`;
      } else if (sliderValue >= 20 && sliderValue < 30) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 10 //5
        }px`;
      } else if (sliderValue >= 30 && sliderValue < 35) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 9 //4.6
        }px`;
      } else if (sliderValue >= 35 && sliderValue < 45) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 9 //4.2
        }px`;
      } else if (sliderValue >= 45 && sliderValue < 55) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 7.4 //3.4
        }px`;
      } else if (sliderValue >= 55 && sliderValue < 65) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 7 //3
        }px`;
      } else if (sliderValue >= 65 && sliderValue < 75) {
        divAlumnos.style.width = `${
          (divAlumnos.clientWidth * sliderValue) / 5.5 //2.38
        }px`;
      } else {
        divAlumnos.style.width = `${
          divAlumnos.clientWidth * (sliderValue / 4.55)
        }px`;
      }
    }
  }
};

const mostrarImagenes = () => {
  const contenedorListado = document.getElementById("contenedorListado");
  contenedorListado.classList.toggle("showing-images");
  mostrarImg.value = !mostrarImg.value;

  const divAlumnos = document.getElementById("alumnos");
  //console.log("mostrarImg", mostrarImg.value);
  ajustarAnchoDiv(mostrarImg.value, sliderValue.value);
};

const getMateriasConImagenes = (alumno) => {
  const materiasConImagenes = {};

  for (const materia in alumno) {
    if (
      (materia.startsWith("Lab") ||
        materia.startsWith("DGC") ||
        materia.startsWith("POD") ||
        materia.startsWith("VI") ||
        materia.startsWith("FabLab")) &&
      typeof alumno[materia] === "string" &&
      alumno[materia] !== ""
    ) {
      const urls = alumno[materia].split(", ");
      materiasConImagenes[materia] = urls[0]; // primer imagen de cada materia
    }
  }

  return materiasConImagenes;
};
</script>

<style scoped lang="scss">
#contenedorListado {
  #alumnos {
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    flex-wrap: wrap;
    height: 80vh; /* 5 items x 50px = 250px*/
    line-height: 1;
    // overflow-x: scroll;
    // overflow-y: hidden;
    overflow: hidden;
    column-gap: 30px;
    padding-left: 0.5rem;

    li {
      min-width: 200px;
      text-transform: capitalize;
      //display: flex;
      align-items: flex-start;

      a small {
        display: block; /* Por defecto, muestra el elemento small */
      }
      a img {
        display: none; /* Por defecto, oculta las imágenes */
      }
      &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
        //padding-bottom: 0.2rem;
        opacity: 1;
      }
    }
  }

  &.showing-images {
    overflow-y: hidden;
    width: 67vw;
    height: 77vh;

    #alumnos {
      flex-direction: unset;
      display: flex;
      flex-wrap: wrap;
      column-gap: 0;
      // width: 1000vw;

      li {
        min-width: unset !important;
        width: unset !important;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 30px;

        a {
          display: flex;
          flex-direction: row;

          div {
            background: rgb(27, 27, 27);
            margin-right: 30px;
            max-width: 400px;
            overflow: hidden;
          }
          div:last-child {
          }
          small {
            display: none; /* Oculta nombres */
          }

          img {
            display: block;
            border: 1px solid rgb(212, 212, 212);
          }
        }
      }
    }
  }
}

#visualizador {
  display: flex;
  .active {
    svg {
      opacity: 1;
    }
  }

  svg {
    opacity: 0.3;
  }
}
</style>