<template>
  <div class="container">
    <div id="header">
      <div id="anuario">
        <router-link to="/">
          Anuario <br />
          {{ anio }}
        </router-link>
      </div>

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
      </div>
    </div>

    <h1>{{ nombre }} {{ apellido }}</h1>

    <p v-if="alumno">Cohorte {{ alumno.Cohorte }}</p>

    <p>
      <span v-for="(value, key) in filteredData" :key="key">
        <router-link
          :to="{
            path: `/alumno-tp/${formatear(nombre)}-${formatear(
              apellido
            )}-${key}`,
            query: { anio: Number(anio) },
          }"
        >
          {{ key }}

          <br />
        </router-link>
      </span>
    </p>

    <div id="thumbails">
      <div id="megaContainer" ref="scrollDiv" @wheel="handleScroll">
        <div id="container">
          <!--thumbails-->
          <span v-for="(value, key) in filteredData" :key="key">
            <router-link
              :to="{
                path: `/alumno-tp/${formatear(nombre)}-${formatear(
                  apellido
                )}-${key}`,
                query: { anio: Number(anio) },
              }"
            >
              <template
                v-for="(imageUrl, index) in value.split(', ')"
                :key="index"
              >
                <video
                  v-if="imageUrl.endsWith('.mp4') || imageUrl.endsWith('.mov')"
                  muted
                  autoplay
                  :style="{ height: `${sliderValue * 5}px` }"
                >
                  <source :src="imageUrl" type="video/mp4" />
                  Tu navegador no soporta el tag de video.
                </video>

                <img
                  v-else
                  :src="imageUrl"
                  :style="{ height: `${sliderValue * 5}px` }"
                />
              </template>
            </router-link>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchData, getDataURL } from "../helpers/api";
import { useZoom } from "../zoom.js";

const props = defineProps({
  anio: Number,
});
const anio = computed(() => props.anio);

const { sliderValue, outputValue, updateOutput } = useZoom();

const route = useRoute();
const nombre = route.params.nombre;
const apellido = route.params.apellido;

const alumnos = ref([]);
const alumno = ref(null);
const filteredData = ref({});

const scrollDiv = ref(null);

const handleScroll = (event) => {
  const container = scrollDiv.value;
  const toLeft = event.deltaY < 0 && container.scrollLeft > 0;
  const toRight =
    event.deltaY > 0 &&
    container.scrollLeft < container.scrollWidth - container.clientWidth;

  if (toLeft || toRight) {
    event.preventDefault();
    container.scrollLeft += event.deltaY;
  }
};

const filterData = () => {
  for (const key in alumno.value) {
    //console.log("key", key);
    //console.log("alumno.value", alumno.value);
    if (alumno.value[key].includes("imgs/2024/")) {
      filteredData.value = { ...filteredData.value, [key]: alumno.value[key] };
    }
  }
};

const formatear = (n) => {
  return n.replace(/^\s+/, "");
  //.replace(/\s+/g, '_') // Reemplaza espacios con guiones bajos
  //.replace(/[^a-zA-Z0-9_]/g, ''); // Elimina caracteres especiales excepto guiones bajos
};

onMounted(async () => {
  const jsonData = await fetchData(props.anio);
  if (jsonData) {
    alumnos.value = jsonData;

    // Buscar al alumno en el JSON
    alumno.value = alumnos.value.find(
      (alumno) =>
        alumno.Nombre.toLowerCase() === nombre &&
        alumno.Apellido.toLowerCase() === apellido
    );
  }
  filterData();
});
</script>

<style scoped lang="scss">
.container {
  #header {
    display: flex;
    //margin-bottom: 16px;

    #anuario {
      width: 29vw;
      line-height: 1;
      font-size: 2rem;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
      }
    }

    #visualizador {
      flex-grow: 1;
    }
  }

  h1 {
    font-size: 5.5rem;
    text-transform: capitalize;
    line-height: 1;
    margin-bottom: 1rem;
    letter-spacing: -0.1rem;
  }
  p {
    margin-bottom: 0;
    font-size: 2rem;
    line-height: 1;

    span:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
    }
  }
}

#megaContainer {
  width: 100%;
  // overflow: auto;
  overflow: hidden;
  #container {
    display: inline-block;
    overflow-x: auto;
    width: max-content;
    position: relative;
  }
}

#thumbails {
  margin-top: 3rem;
  width: 100%;
  overflow: hidden;
  img,
  video {
    margin-right: 30px;
    margin-bottom: 30px;
    border: 1px solid rgb(212, 212, 212);
    background: #272727;

    &:hover {
      opacity: 0.7;
    }
  }
}
</style>