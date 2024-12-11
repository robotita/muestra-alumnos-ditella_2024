<template>
  <div class="content" :class="`anio-${anio}`">
    <aside>
      <h1>
        <a href="#" @click="reset"> Anuario<br />{{ anio }} </a>
      </h1>

      <div id="search">
        <span class="placeholder" v-show="!query">
          <span>|</span>
          Tu nombre
        </span>
        <input type="text" @focus="reset" v-model="query" />
        <button @click="reset" v-if="query">x</button>
      </div>

      <h2>Materias</h2>
      <ul>
        <li
          v-for="(materia, index) in obtenerMaterias()"
          :key="index"
          :class="{ active: index === indiceActivo }"
        >
          <a href="#" @click="filtrarPorMateria(materia.nombre, index)">
            {{ materia.nl }}
          </a>
        </li>
      </ul>

      <div id="navegar">
        <span v-if="anio === 2024" @click="cambiarAnio(anio - 1)">
          &lt; ver Anuario {{ anio - 1 }}
        </span>
        <span v-else @click="cambiarAnio(anio + 1)">
          &gt; ver Anuario {{ anio + 1 }}
        </span>
      </div>
    </aside>

    <main>
      <search-results
        :query="query"
        :materiaSeleccionada="materiaSeleccionada"
        :anio="anio"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import SearchResults from "../components/SearchResults.vue";

const anio = ref(2024);

const cambiarAnio = async (nuevoAnio) => {
  if (nuevoAnio === 2023 || nuevoAnio === 2024) {
    anio.value = nuevoAnio;
  }
};

const query = ref("");
const materiaSeleccionada = ref(null);
const indiceActivo = ref(null);
const placeholderText = ref("");

const reset = () => {
  query.value = "";
  materiaSeleccionada.value = null;
  indiceActivo.value = null;
};

const materiasPorAnio = ref({
  2023: [
    { nombre: "Lab I", nl: "Laboratorio de Diseño I" },
    { nombre: "Lab II", nl: "Laboratorio de Diseño II" },
    { nombre: "Lab III", nl: "Laboratorio de Diseño III" },
    { nombre: "Lab IV", nl: "Laboratorio de Diseño IV" },
    { nombre: "Lab V", nl: "Laboratorio de Diseño V" },
    { nombre: "Lab VI", nl: "Laboratorio de Diseño VI" },
    { nombre: "Lab VII", nl: "Laboratorio de Diseño VII" },
    { nombre: "Lab VIII", nl: "Laboratorio de Diseño VIII" },
    { nombre: "DGC", nl: "Diseño y Gestión Cultural" },
    { nombre: "POD", nl: "Programación Orientada al Diseño" },
    { nombre: "VI", nl: "Visualización de la Información" },
    { nombre: "FabLab", nl: "FabLab" },
  ],
  2024: [
    { nombre: "Lab I", nl: "Laboratorio de Diseño I" },
    // { nombre: "Lab II", nl:"Laboratorio de Diseño II"},
    { nombre: "Lab III", nl: "Laboratorio de Diseño III" },
    //{ nombre: "Lab IV", nl: "Laboratorio de Diseño IV" },
    { nombre: "Lab V", nl: "Laboratorio de Diseño V" },
    //{ nombre: "Lab VI", nl: "Laboratorio de Diseño VI" },
    { nombre: "Lab VII", nl: "Laboratorio de Diseño VII" },
    //{ nombre: "Lab VIII", nl: "Laboratorio de Diseño VIII" },
    { nombre: "DGC", nl: "Diseño y Gestión Cultural" },
    { nombre: "POD", nl: "Programación Orientada al Diseño" },
    { nombre: "VI", nl: "Visualización de la Información" },
    //{ nombre: "FabLab", nl: "FabLab"},
  ],
});

const obtenerMaterias = () => {
  return (
    materiasPorAnio.value[anio.value] ||
    materiasPorAnio.value[Math.max(...Object.keys(materiasPorAnio.value))]
  );
};

const filtrarPorMateria = (nombreMateria, index) => {
  if (indiceActivo.value === index) {
    indiceActivo.value = null;
    materiaSeleccionada.value = null;
  } else {
    materiaSeleccionada.value = nombreMateria;
    indiceActivo.value = index;
  }
};

onMounted(() => {
  startBlinking();
});

onUnmounted(() => {
  stopBlinking();
});

const startBlinking = () => {
  const intervalId = setInterval(() => {
    placeholderText.value =
      placeholderText.value === "" ? "Tu nombre |" : "Tu nombre";
  }, 500);

  placeholderText.intervalId = intervalId;
};

const stopBlinking = () => {
  clearInterval(placeholderText.intervalId);
};
</script>

<style scoped lang="scss">
*:focus {
  outline: none;
}

.content {
  display: flex;
  padding: 2vw;
  width: 100vw;
  height: 100vh;
  column-gap: 3vw;

  &.anio-2023 {
    background:#000;
    color:#FFF;
  }
}

aside {
  display: flex;
  flex-direction: column;
  border-right: 2px solid #000;
  height: 100%;
  width: 26vw;
  min-width: 26vw;
  max-width: 26vw;

  h1 {
    margin-bottom: 70px;
    line-height: 1;
    font-size: 2rem;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
    }
  }

  #search {
    display: flex;
    margin-bottom: 105px;

    .placeholder {
      position: absolute;
      top: 50%;
      //left: 10px;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      color: #aaa;
      font-size: 2rem;
      z-index: -1;
      span {
        margin-right: 5px;
        animation: blink-2dc54a20 0.5s infinite alternate;
        font-family: georgia;
        font-size: 1.5rem;
        position: relative;
        margin-left: 2px;
        top: -2px;
        //background-color: red;
        border-left: 1px solid #000;
        color: white;
      }
    }

    input[type="text"] {
      width: 80%;
      font-size: 2rem;
      border: none;
      font-family: unset;
      background: none;
    }

    button {
      background: none;
      border: 0;
      color: #808080;
      font-size: 2rem;
      color: #000;

      &:hover {
        //  opacity: 0.8;
      }
    }
  }

  h2 {
    border-bottom: 2px solid;
    margin-bottom: 10px;
    max-width: 87%;
    font-size: 2rem;
  }

  ul {
    font-size: 2rem;
    line-height: 1;

    li {
      &:hover {
        text-decoration: underline;
        color: #000;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
        //padding-bottom: 0.2rem;
        opacity: 1;
      }
      &.active {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
        padding-bottom: 0.2rem;
      }
    }
  }

  #navegar {
    font-size: 2rem;
    margin-top: auto;
  }
}

main {
  width: 67vw;
  min-width: 67vw;
  max-width: 67vw;
}

#search {
  position: relative;
}

@keyframes blink {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
