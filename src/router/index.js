import { createWebHistory, createWebHashHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import AlumnoDetalle from "../views/AlumnoDetalle.vue";
import AlumnoTp from "../views/AlumnoTp.vue";

const routes = [

  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/alumno/:nombre-:apellido",
    name: "AlumnoDetalle",
    component: AlumnoDetalle,
    props: route => ({
      anio: route.query.anio,
    }),
  },
  {
    path: "/alumno-tp/:nombre-:apellido-:key",
    name: "AlumnoTp",
    component: AlumnoTp,
    props: route => ({
      anio: route.query.anio,
    }),
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
// history: createWebHistory(),
