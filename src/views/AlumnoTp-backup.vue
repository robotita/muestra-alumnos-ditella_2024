<template>
  <div class="container bg-dark">
    <!--close-->
    <router-link
      :to="{
        path: '/alumno/' + `${$route.params.nombre}-${$route.params.apellido}`,
        query: { anio: Number(anio) },
      }"
    >
      <img id="cerrar" src="/cerrar.png" />
    </router-link>
    <!--close-->

    <aside>
      <div id="header">
        <div id="anuario">
          <router-link
            :to="{
              path: `/`,
              query: { anio: Number(anio) },
            }"
          >
            Anuario <br />
            {{ anio }}
          </router-link>
        </div>
      </div>

      <router-link
        :to="{
          path:
            '/alumno/' + `${$route.params.nombre}-${$route.params.apellido}`,
          query: { anio: Number(anio) },
        }"
      >
        <h1>{{ $route.params.nombre }} {{ $route.params.apellido }}</h1>
      </router-link>
      <p>{{ $route.params.key }}</p>
      <br />
      <p>
        {{ descripcion }}
      </p>
    </aside>

    <main>
      <div class="carousel">
        <div class="slides" ref="slidesRef">
          <div
            class="slide active"
            v-for="(imagen, index) in imagenesAsociadas"
            :key="index"
          >
            <!--video o img-->
            <span v-if="imagen.endsWith('.mp4') || imagen.endsWith('.mov')">
              <!--VIDEO-->
              <video controls>
                <source :src="imagen" type="video/mp4" />
                Tu navegador no soporta el tag de video.
              </video>
              <!--VIDEO-->
            </span>
            <span v-else>
              <!-- :src="imagen" CAMBIAR SEGUIR -->
              <img :src="imagen" alt="slide image" ref="imageRef" />
            </span>
            <!--//video o img-->
          </div>
        </div>

        <!--controls-->
        <div class="controls">
          <div
            class="control next-slide"
            @click="() => changeSlide(false)"
          ></div>
          <div class="control prev-slide" @click="changeSlide"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { fetchData, getDataURL } from "../helpers/api";

const props = defineProps({
  anio: Number,
});
const anio = computed(() => props.anio);

const route = useRoute();
const nombre = route.params.nombre;
const apellido = route.params.apellido;
const alumnos = ref([]);
const alumno = ref(null);
const imagenesAsociadas = ref([]);
const nombreTp = route.params.key;
const descripcion = ref(""); //Cargando descripción

const slidesRef = ref(null);
const imageRef = ref(null);
const currentRef = ref(0);

const links = ref({});

const obtenerMaterias = () => {
  const linksArray = [];

  for (const key in alumno.value) {
    if (alumno.value[key].includes(`imgs/${anio.value}/`)) {
      console.log("key", key);
      //const newKey = `http://localhost:5173/#/alumno-tp/${nombre}-${apellido}-${key}`;

      //arreglo rápido
      const currentUrl = window.location.href;
      const parts = currentUrl.split("#/");
      const parteAnterior = parts[0];
      //console.log("Parte anterior a #/:", parteAnterior);
      //arreglo rápido
      const newKey = `${parteAnterior}#/alumno-tp/${nombre}-${apellido}-${key}`;
      console.log("newKey", newKey);
      linksArray.push(newKey);
    }
  }
  links.value = linksArray;
};

const changeSlide = (next = true) => {
  const slides = slidesRef.value;
  const slideWidth = 100; // Ancho de cada slide en porcentaje
  const slideIndexOffset = 2;

  let current = currentRef.value;

  // Buscar todos los videos y pausarlos
  slides.querySelectorAll("video").forEach((video) => {
    video.pause();
  });

  // Remove 'active' class from all slides
  slides.querySelectorAll(".slide").forEach((slider) => {
    slider.classList.remove("active");
  });

  // Calculate new current index
  const newCurrentIndex =
    Math.abs(current / slideWidth) + (next ? slideIndexOffset : 0);
  //console.log("currentIndex", newCurrentIndex);

  // Add 'active' class to the new current slider
  const newCurrentSlider = slides.querySelector(
    `.slide:nth-child(${newCurrentIndex})`
  );
  if (newCurrentSlider) {
    newCurrentSlider.classList.add("active");
  }

  // Check if reached the last or first slide
  if (next) {
    current -= slideWidth;
    if (current < -slideWidth * (slides.childElementCount - 1)) {
      //current = 0;
      redirectToLinkNext(); // Redirigir al llegar al último slide
    }
  } else {
    current += slideWidth;
    if (current > 0) {
      //current = -slideWidth * (slides.childElementCount - 1);
      redirectToLinkPrev();
    }
  }

  currentRef.value = current;
  slides.style.left = `${current}%`;

  adjustImageSize();
};

const adjustImageSize = () => {
  // Esperar a que el DOM se renderice completamente
  setTimeout(() => {
    const slides = slidesRef.value;
    const currentIndex = Math.round(-currentRef.value / 100);
    const image = slides.children[currentIndex]?.querySelector("img");
    const video = slides.children[currentIndex]?.querySelector("video");
    //console.log(image);

    if (image) {
      const aspectRatio = image.naturalWidth / image.naturalHeight;

      //en realidad 16:9 / => 1.77777777778
      if (aspectRatio > 1.7) {
        image.style.height = "auto";
        image.style.width = "100%";
      } else {
        image.style.width = "auto";
        image.style.height = "100%";
      }
    }

    if (video) {
      const aspectRatio = video.naturalWidth / video.naturalHeight;
      //console.log("aspectratio", aspectRatio);

      //en realidad 16:9 / => 1.77777777778
      if (aspectRatio > 1.7) {
        video.style.height = "auto";
        video.style.width = "100%";
      } else {
        video.style.width = "auto";
        video.style.height = "100%";
      }
    }
  }, 0);
};

const redirectToLinkNext = () => {
  const linkIndex = links.value.findIndex((link) =>
    link.includes(nombreTp.trim())
  );
  if (linkIndex !== -1) {
    let nextIndex = (linkIndex + 1) % links.value.length;
    const link = links.value[nextIndex];
    const url = new URL(link, window.location.origin);

    url.searchParams.set("anio", anio.value);
    const fullUrl = `${url.toString()}?anio=${anio.value}`;

    window.location.href = fullUrl;
    setTimeout(() => {
      window.location.reload(true);
    }, 50);
  } else {
    console.error(`No se encontró el enlace correspondiente a ${nombreTp}`);
  }
};

const redirectToLinkPrev = () => {
  const linkIndex = links.value.findIndex((link) =>
    link.includes(nombreTp.trim())
  );
  if (linkIndex !== -1) {
    let prevIndex = (linkIndex - 1 + links.value.length) % links.value.length;
    const link = links.value[prevIndex];
    const url = new URL(link, window.location.origin);

    url.searchParams.set("anio", anio.value);
    const fullUrl = `${url.toString()}?anio=${anio.value}`;

    window.location.href = fullUrl;
    setTimeout(() => {
      window.location.reload(true);
    }, 50);
  } else {
    console.error(`No se encontró el enlace correspondiente a ${nombreTp}`);
  }
};

const tpDescripcion = ref([
  //LabI - 1.2.3-
  {
    nombre: "Lab I - di:game",
    descripcion:
      "Diseño de juego de piezas combinables para lograr distintas tipologías compositivas mediante la exploración de materiales, soportes y niveles de complejidad, desplegando constantes y variables en las interacciones del sistema.",
  },
  {
    nombre: "Lab I - De la forma a la imagen",
    descripcion:
      "Diseño de pieza editorial con progresiones y gradientes abstractas y figurativas. Se define un sistema de lenguaje concreto de formas, colores, grafismos e imágenes mediante la exploración de grados de semejanza o familiaridad que ciertas configuraciones formales pueden tener respecto a universos temáticos.",
  },
  {
    nombre: "Lab I - di:haus",
    descripcion:
      "Proyecto inscrito en la lógica del “diseño de superficies” adaptativas a diferentes condiciones y soportes a través de un mismo sistema de elementos formales y cromáticos en el espacio. Supone una transformación de la manera en que se ve y entiende una volumetría o una espacialidad.",
  },
  {
    nombre: "Lab I - lenguaje",
    descripcion:
      "Experiencia exploratoria de técnicas manuales y digitales para el procesamiento y tratamiento de imágenes, con el fin de traducir material icónico a un nueva gramática visual construida a partir de diversos recursos gráficos, cromáticos y compositivos, poniendo en juego la noción de identidad y diferenciación.",
  },
  {
    nombre: "Lab I - lalalab",
    descripcion:
      "Proyecto centrado en la creación de elementos para una situación comunicacional concreta: el relanzamiento de un álbum en vinilo y su promoción. Se investigaron los códigos culturales y visuales alrededor de un género musical y se produjo un lenguaje visual para el desarrollo de un sistema de piezas con distintas funciones y contextos de uso.",
  },
  //LabII
  {
    nombre: "Lab II - Labzine",
    descripcion:
      "Fanzine asociado a una producción audiovisual que propone explorar las posibilidades de lo denotativo y lo connotativo en las relaciones de la tríada imagen-palabra-espacio gráfico de la página. El proyecto constituye una primera aproximación al diseño de la comunicación.",
  },
  {
    nombre: "Lab II - Expolab",
    descripcion:
      "Proyecto centrado en la producción de sentido para una situación comunicacional concreta: la exposición de objetos de distintos ámbitos de la cultura. A partir del recorte estratégico de un tema en particular, se seleccionaron recursos acordes para la proyectación de un sistema de piezas orientadas a un público específico.",
  },
  {
    nombre: "Lab II - Clips",
    descripcion:
      "Imágenes y palabras en movimiento junto con información sonora (ritmos, velocidades y timbres) se integran en piezas audiovisuales breves que trabajan los principios del motion design —el diseño de la forma en movimiento— para abordar las gramáticas elementales de lo cinético.",
  },
  {
    nombre: "Lab II - id:lab",
    descripcion:
      "Sistema de piezas editoriales impresas —y con funciones comunicacionales diferenciadas— centradas en el desarrollo de una identidad para un espacio donde públicos o consumidores específicos realizan prácticas y actividades concretas (librería, coleccionismo, gaming, crafts, etc.).",
  },
  {
    nombre: "Lab II - Visualizer",
    descripcion:
      "Registros de videos, imágenes y palabras en movimiento junto con información sonora (ritmos, velocidades y timbres) integrados en una pieza audiovisual que acompaña la circulación de un tema musical. Se trabajan los principios del motion design (el diseño de la forma en movimiento).",
  },
  {
    nombre: "Lab II - Línea de tiempo",
    descripcion:
      "Práctica integradora de fundamentos y metodologías propios del ámbito del diseño de información. Se trabaja en cómo la comprensión de datos en torno a un evento histórico puede interpretarse y comunicarse de maneras diferentes, de acuerdo a distintas matrices de organización y visualización.",
  },
  {
    nombre: "Lab II - info:lab",
    descripcion:
      "Exploración de narrativas informativas construidas en torno a un hito sociocultural complejo y trabajadas sobre dos medios/soportes: un display tridimensional y una pieza audiovisual.",
  },

  //LabIII
  {
    nombre: "Lab III - Semántica móvil",
    descripcion:
      "Diseño de un móvil a partir del análisis del código semántico de un diseñador icónico contemporáneo: Marianne Brandt, Ettore Sottsass, Francisco Gómez Paz, Ronan y Erwan Bouroullec, Karim Rashid, Matali Crasset, Zaha Hadid, Humberto y Fernando Campana.",
  },
  {
    nombre: "Lab III - Diseño al cubo",
    descripcion:
      "Diseño de un cubo que emita luz y resuelva tres categorías funcionales (encendido, agarre, apoyo o anclaje) cumpliendo con las exigencias y las necesidades del contexto asignado (playa, jardín o avión).",
  },
  {
    nombre: "Lab III - Juego de construcción",
    descripcion:
      "Diseño de un juego de construcción a partir del análisis e interpretación de soluciones presentes en la naturaleza: estructuras, tramas, módulos y vínculos.",
  },

  //LabIV
  {
    nombre: "Lab IV - Alimentos autoprocesados",
    descripcion:
      "Diseño de un producto que, sin uso de electricidad, procese algún alimento y facilite la autoproducción en el hogar para reemplazar el consumo de ultraprocesados.",
  },
  {
    nombre: "Lab IV - Equipamiento para espacios culturales",
    descripcion:
      "Diseño de un sistema de equipamiento para un espacio cultural tomando en cuenta los siguientes elementos: una superficie de descanso, un soporte expositivo y un soporte de comunicación.",
  },
  {
    nombre: "Lab IV - Juego de construcción",
    descripcion:
      "Diseño de un juego de construcción a partir del análisis e interpretación de soluciones presentes en la naturaleza (estructuras, tramas, módulos y vínculos).",
  },
  {
    nombre: "Lab IV - Parasite",
    descripcion:
      "Diseño para la fabricación con impresión 3D de un accesorio que permita ampliar, mejorar o resignificar la usabilidad de un producto ya existente y presente en la universidad.",
  },
  {
    nombre: "Lab IV - Refill",
    descripcion:
      "Diseño de un producto personal reutilizable para usuarios que compran a granel alimentos secos en dietéticas, productos de limpieza en almacenes, alimentos para mascotas en veterinarias y helado en heladerías.",
  },
  {
    nombre: "Lab IV - Juego urbano",
    descripcion:
      "Diseño de un juego de construcción —de implantación fija y de uso público para exteriores y usuarios de un lugar específico del AMBA que definió cada equipo— a partir del análisis y la interpretación de soluciones presentes en la naturaleza (estructuras, tramas, módulos y vínculos).",
  },
  //LabV
  {
    nombre: "Lab V - Fanpage",
    descripcion:
      "Diseño y edición de una pieza gráfica a partir de la mirada propia sobre un artista con dos instancias de lectura: un recorrido secuencial de revista y un póster de impacto.",
  },
  {
    nombre: "Lab V - Contar historias",
    descripcion:
      "Desarrollo de una narrativa web interactiva con temática libre y desde una perspectiva propia, profundizando en su complejidad y su conexión emocional.",
  },
  {
    nombre: "Lab V - Reserva natural",
    descripcion:
      "Diseño de experiencia informativa para la Reserva Ecológica de Costanera Sur que proponga conectar con el lugar desde una perspectiva sensible con el entorno y la naturaleza.",
  },
  {
    nombre: "Lab V - Experiencia informativa",
    descripcion:
      "Diseño de experiencia informativa para el Centro Cultural Recoleta con el propósito de potenciar la experiencia de los visitantes mediante la conexión con el lugar y comprender su valor.",
  },
  //LabVI -  De Marziani
  {
    nombre: "Lab VI - De Marziani - Entornos lumínicos",
    descripcion:
      "Diseño de experiencia lumínica y sonora inmersiva que aborda dimensiones espaciales y temporales e incorpora la figura del visitante en el desarrollo experiencial. Se emplea la técnica de pixel mapping para controlar el comportamiento de las luces, programando escenas de forma visual e intuitiva.",
  },
  {
    nombre: "Lab VI - De Marziani - Entorno audiovisual",
    descripcion:
      "Diseño de pieza audiovisual inmersiva, de carácter abstracto y sensorial, para ser reproducida en una sala de imagen digital.",
  },
  {
    nombre: "Lab VI - De Marziani - Experiencia inmersiva interactiva",
    descripcion:
      "Diseño de experiencia inmersiva e interactiva a partir de una temática libre, utilizando sonido, luz y video controlados por el visitante, desplegando información en una sala de exhibición.",
  },
  {
    nombre: "Lab VI - De Marziani - Experiencia inmersiva",
    descripcion:
      "Diseño de experiencia inmersiva e interactiva a partir de una temática libre, utilizando sonido, luz y video controlados por el visitante, desplegando información en una sala de exhibición.",
  },
  //LabVI -  Berrecil
  {
    nombre: "Lab VI - Becerril - Diseño de videojuego de arcade",
    descripcion:
      "Desarrollo en equipo de un videojuego de arcade 100% finalizado y jugable para explorar el diseño de mecánicas y narrativas específicas de los videojuegos e interiorizar la práctica del prototipado, la iteración y el testeo como herramientas fundamentales en el proceso creativo.",
  },
  {
    nombre: "Lab VI - Becerril - Juego de mesa original",
    descripcion:
      "Concepción (de la idea y de la mecánica central), desarrollo (de prototipos; iteración y testeo), contextualización de mecánicas (temáticas y arte), exploración de componentes y materiales de producción, balance de mecánicas, desarrollo de libro de reglas y producción final (diseño gráfico, packaging y materialidad) de un juego de mesa original.",
  },
  //LabVII
  {
    nombre: "Lab VII - De Marziani - Video mapping",
    descripcion:
      "Realización de un video mapping para la presentación de un dispositivo tecnológico utilizando un set de elementos y superficies propuestos e incorporando diseño sonoro.",
  },
  {
    nombre: "Lab VII - De Marziani - Espacio interactivo",
    descripcion:
      "Diseño y desarrollo de un espacio multimedia interactivo que integre tecnologías para comunicar información de forma innovadora y efectiva (uso de técnicas de proyección de video, mapping, iluminación, sonido multicanal y toma de decisiones en relación con las instancias de interacción) para potenciar la experiencia del visitante.",
  },

  //LabVII - no se subió nada

  //LabVIII
  {
    nombre: "Lab VIII - Proyecto final de Carrera. Working in Progress",
    descripcion:
      "Proyecto-tesis nacida de una matriz de temas, enfoques y problemas que estructura las distintas investigaciones proyectuales que permiten avanzar en el tipo de outputs a desarrollar, las herramientas materiales y tecnológicas necesarias, los lenguajes y modelos organizativos y los prototipos para la verificación de las propuestas y las resoluciones.",
  },
  {
    nombre: "Lab VIII - Fase 1. Visualización de procesos previos",
    descripcion:
      "Objeto gráfico que, con una lectura no secuencial, múltiples puntos de entrada, capas de información, contenidos, datos y diversos niveles de codificación, permita evaluar información capaz de ofrecer oportunidades de optimización del proceso de diseño.",
  },
  {
    nombre: "Lab VIII - Fase 2. Proyecto y campo temático",
    descripcion:
      "Definición del campo temático y ámbito de trabajo del proyecto. Se establece la relación entre la necesidad identificada y las acciones de diseño propuestas y se analizan los contextos, los destinatarios, los objetivos, las escalas de intervención, el impacto, los antecedentes y las interacciones proyectuales entre distintos ámbitos del diseño.",
  },
  {
    nombre: "Lab VIII - Brief",
    descripcion:
      "Cierre de la primera etapa de trabajo, con la definición de las problemáticas, los usuarios, los actores, el contexto, las necesidades, los objetivos, el alcance y la proyección: enunciados que pondrán en marcha procesos de diseño. Se ejemplifican y representan gráficamente tales acciones describiendo el enfoque y anticipando su materialización.",
  },
  {
    nombre: "Lab VIII - Fase 3. Planteo general y analítico del proyecto",
    descripcion:
      "Entrega de medio término articulada en cuatro outputs: la descripción del proyecto (antecedentes, investigación); la visualización y organización de su totalidad, de sus componentes y de sus relaciones internas y externas; la representación de sus componentes y la presentación de las diferentes propuestas en cuanto que acciones de diseño adoptadas.",
  },
  {
    nombre: "Lab VIII - Fase 4. Detalle de componentes y recursos",
    descripcion:
      "Profundización en el desarrollo, las relaciones y las jerarquías de los diferentes componentes del proyecto en su totalidad, desde la verificación de su funcionamiento conceptual y práctico hasta aspectos relacionados con los modos de diseño adoptados, la elección de la materialidad posible y las posibles estrategias de comunicación.",
  },

  //DGC
  {
    nombre: "DGC -  Fanzine",
    descripcion:
      "La identidad como edición. Publicación impresa de carácter libre realizada a partir del concepto de edición. Identidad de una subcolección confeccionada a partir de la Colección de Diseño del Museo de Arte Moderno de Buenos Aires.",
  },
  {
    nombre: "DGC - Brand Book",
    descripcion:
      "Diseño integral de una exhibición. Manual de marca y aplicaciones de la identidad de una exhibición imaginada para el Museo de Arte Moderno de Buenos Aires, con los lineamientos de las piezas impresas, digitales y espaciales para conformar el diseño integral de un sistema de identidad.",
  },
  {
    nombre: "DGC - Video-Teaser",
    descripcion:
      "Identidad en un leguaje contemporáneo. Presentación animada o teaser del proyecto de identidad para una exhibición basada en la Colección de Diseño del Museo de Arte Moderno de Buenos Aires. En el video se reinterpretan conceptos vistos desde diferentes perspectivas.",
  },

  // POD
  {
    nombre: "POD - Araujo - Líneas aleatorias",
    descripcion:
      "Composición visual aleatoria usando figuras elementales. Randomización de variables tales como el color, el grosor, la longitud y la opacidad.",
  },
  {
    nombre: "POD - Araujo - Generador de tramas iterativas",
    descripcion:
      "Creación de un programa que genere una composición textural tipo empapelado o tela. Los patrones, geométricos u orgánicos, que conforman la trama están diseñados para que puedan ser usados infinitamente.",
  },
  {
    nombre: "POD - Araujo - Interactivo audiovisual",
    descripcion:
      "Desarrollo de un interactivo que genera una salida visual, en tiempo real, a partir de los datos de un audio. El fin es la creación de un “instrumento audiovisual” que permita al usuario ejecutar efectos visuales a partir de la interacción con el teclado.",
  },
  {
    nombre: "POD - Araujo - Tipografia interactiva",
    descripcion:
      "Diseño de un nuevo alfabeto tipográfico expresivo en p5.js y desarrollo de un interactivo que permite al usuario verlo completo en distintas variantes de tamaños, filtros, colores, deformaciones, movimiento, composición de palabras, etc.",
  },
  {
    nombre: "POD - Araujo - Proyecto final",
    descripcion:
      "Programación de interactivo basado en temas como videojuegos, visualización de datos, IA o aplicaciones interactivas. Se integran los conceptos de programación aprendidos y la investigación de herramientas para alcanzar el objetivo planteado por el equipo.",
  },
  {
    nombre: "POD - Zárate - Generador de tramas",
    descripcion:
      "Creación de un programa que genere una composición textural tipo empapelado o tela. Los patrones, geométricos u orgánicos, que conforman la trama están diseñados para que puedan ser usados infinitamente.",
  },
  {
    nombre: "POD - Zárate - Canción con visualización iterativa",
    descripcion:
      "Desarrollo de un patrón abstracto que refleja la estructura de una canción usando valores de escala de grises o componentes RGB (incluidas transparencias).",
  },
  {
    nombre: "POD - Prof. Zárate - Instrumento sinestésico",
    descripcion:
      "Creación de un instrumento sinestésico audiovisual con una salida simultánea de imágenes y sonidos. La interacción del usuario con la computadora a través del teclado (o el mouse) genera una respuesta visual o sonora.",
  },
  {
    nombre: "POD - Fairbairn - Líneas aleatorias",
    descripcion:
      "Composición visual aleatoria a pantalla completa usando, como figuras elementales, solamente líneas.",
  },
  {
    nombre: "POD - Fairbairn - Generador de tramas",
    descripcion:
      "Creación de un programa que genera una composición textural tipo empapelado o tela. Los patrones, geométricos u orgánicos, que conforman la trama están diseñados para que puedan ser usados infinitamente.",
  },
  {
    nombre: "POD - Fairbairn - Visualización de datos",
    descripcion:
      "Programación de representación de datos en un archivo JSON sobre un tema específico buscando ir más allá de la sola presentación de datos matemáticos en gráficos.",
  },
  {
    nombre: "POD - Fairbairn - Instalación audiovisual interactiva",
    descripcion:
      "Creación de una instalación interactiva audiovisual para informar y concientizar sobre los Objetivos de Desarrollo Sostenible de las Naciones Unidas.",
  },
  {
    nombre: "POD - Torres - Space Invaders",
    descripcion:
      "Dibujo con p5.js de uno de los alienígenas del videojuego Space Invaders (1978), del diseñador Toshihiro Nishikado.",
  },
  {
    nombre: "POD - Torres - Líneas aleatorias",
    descripcion:
      "Composición visual aleatoria a pantalla completa usando, como figuras elementales, solamente líneas.",
  },
  {
    nombre: "POD - Torres - Generador de tramas",
    descripcion:
      "Creación de un programa que genera una composición textural tipo empapelado o tela. Los patrones, geométricos u orgánicos, que conforman la trama están diseñados para que puedan ser usados infinitamente.",
  },
  {
    nombre: "POD - Torres - Visualización de datos",
    descripcion:
      "Programación de representación de datos en un archivo JSON sobre un tema específico buscando ir más allá de la sola presentación de datos matemáticos en gráficos.",
  },
  {
    nombre: "POD - Torres - Instalación audiovisual interactiva",
    descripcion:
      "Creación de una instalación interactiva audiovisual para informar y concientizar sobre los Objetivos de Desarrollo Sostenible de las Naciones Unidas.",
  },

  // VI
  {
    nombre: "VI - Gráfica instructiva",
    descripcion:
      "Desarrollo de un instructivo que sintetice el paso a paso para para la realización de una tarea, una acción o un proceso.",
  },
  {
    nombre: "VI - Gráfica estadística",
    descripcion:
      "Visualización de información estadística a partir del análisis de una base de datos y entrecruzando diferentes categorías.",
  },
  {
    nombre: "VI - Gráfica estadística e interactiva",
    descripcion:
      "Representación didáctica una estructura, un fenómeno o un proceso para diferentes plataformas.",
  },

  // FabLab
  {
    nombre: "FabLab -  Introducción a la maquetería y el prototipado ",
    descripcion:
      "Realización de maqueta funcional de luminaria diseñada a partir de rasgos morfológicos y constructivos estudiados en distintas sillas y modelada en 3D mediante Rhinoceros.",
  },
  {
    nombre: "FabLab - Manifestaciones alienígenas",
    descripcion:
      "Representación fotorrealista, creada con herramientas de renderizado e inteligencia artificial, de un patrón generado con Grasshoper —plug-in de diseño computacional y paramétrico para Rhinoceros 3D— a partir del mensaje de una civilización extraterrestre aún sin descifrar.",
  },
  {
    nombre: "FabLab - Laberinto electrónico",
    descripcion:
      "Diseño y fabricación de un laberinto de mesa con piezas previamente modeladas en 3D y movimiento generado por motores y controlado por mandos analógicos, todo conectado mediante una placa controladora Arduino.",
  },
  {
    nombre: "FabLab - Luz y forma",
    descripcion:
      "Diseño de luminarias y realización de maquetas funcionales a partir de diferentes tipologías formales asignadas por los docentes, con el objetivo de experimentar distintos métodos de transformación de materiales y técnicas de maquetería.",
  },
  {
    nombre: "FabLab - Las ciudades invisibles",
    descripcion:
      "Diseño de un objeto que —inspirado en los escritos de Italo Calvino sobre ciudades imaginarias y materializado mediante la combinando de herramientas de fabricación digital y componentes de electrónica— permite a una esfera realizar un recorrido de un punto A a un punto B.",
  },
]);

const obtenerDescripcion = (nombreMateria) => {
  setTimeout(() => {
    const materiaEncontrada = tpDescripcion.value.find(
      (materia) => materia.nombre === nombreMateria
    );
    descripcion.value = materiaEncontrada.descripcion;
  }, 1000);
};

onMounted(async () => {
  const jsonData = await fetchData(props.anio);
  if (jsonData) {
    alumnos.value = jsonData;
    alumno.value = alumnos.value.find(
      (alumno) =>
        alumno.Nombre.toLowerCase() === route.params.nombre &&
        alumno.Apellido.toLowerCase() === route.params.apellido
    );
  }

  if (alumno.value) {
    // Limpia las claves del objeto alumno
    Object.keys(alumno.value).forEach((key) => {
      const trimmedKey = key.trim();
      if (key !== trimmedKey) {
        alumno.value[trimmedKey] = alumno.value[key];
        delete alumno.value[key];
      }
    });

    imagenesAsociadas.value = alumno.value[nombreTp.trim()]
      ? alumno.value[nombreTp.trim()].split(", ")
      : [];
  }

  adjustImageSize();
  obtenerMaterias();
  if (nombreTp) {
    obtenerDescripcion(nombreTp);
    //console.log("nombreTp", nombreTp);
  }
  console.log("links", links);
  setTimeout(() => {}, 1000);
});
</script>

<style scoped lang="scss">
.bg-dark {
  background: #000;
  color: #fff;
  padding: 0 !important;
  height: 100%;
  overflow: hidden;
}

.container {
  display: flex;

  aside {
    padding: 2vw;
    border-right: 2px solid #000;
    height: 100vh;
    width: 26vw;

    #header {
      //margin-bottom: 16px;

      #anuario {
        line-height: 1;
        font-size: 2rem;
        margin-bottom: 70px;

        &:hover {
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-thickness: 2px;
        }
      }
    }

    h1 {
      font-size: 2rem;
      line-height: 1;
      text-transform: capitalize;
      //margin-bottom: 20px;

      &:hover {
        text-decoration: underline;
        text-underline-offset: 3px;
        text-decoration-thickness: 2px;
      }
    }

    p {
      margin-bottom: 0;
      font-size: 2rem;
      line-height: 1;
    }
  }

  main {
    width: 74vw;
  }
}

//CARROUSEL
#cerrar {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:hover {
    opacity: 0.5;
  }
}
.carousel {
  // width: 74vw;
  width: 100%;
  height: 100vh;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);

  &:hover .controls {
    opacity: 1;
  }

  .controls {
    opacity: 0;
    display: flex;
    position: absolute;
    top: 50%;
    left: 0;
    justify-content: space-between;
    width: 100%;
    z-index: 99999;
    transition: all ease 0.5s;

    .control {
      margin: 0 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 282px;
      height: 197px;
      background-color: rgba(255, 255, 255, 0.7);
      opacity: 0.5;
      transition: ease 0.3s;
      cursor: pointer;
      background-size: 100% auto;

      &.prev-slide {
        background: url(/flecha-der.png) no-repeat;
      }

      &.next-slide {
        background: url(/flecha-izq.png) no-repeat;
      }
      &:hover {
        opacity: 1;
      }
    }
  }

  .slides {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    display: flex;
    width: 100%;
    transition: 1s ease-in-out all;

    .slide {
      min-width: 74vw;
      width: 100%;
      height: 100vh;
      text-align: center;
      // display: flex;
      display: inline-flex;
      // align-items: center;
      justify-content: center;
      overflow: hidden;
      opacity: 0;
      transition: opacity 0.3s;

      &.active {
        opacity: 1;
      }
      img,
      video {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
        //chequear este centrado
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        -webkit-transform: translateY(-50%);
        object-fit: contain;
      }
    }
  }
}
</style>
