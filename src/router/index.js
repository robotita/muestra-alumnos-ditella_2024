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
  },
  {
    path: "/alumno-tp/:nombre-:apellido-:key",
    name: "AlumnoTp",
    component: AlumnoTp,
  },
];

const router = createRouter({
  routes,
  history: createWebHashHistory(),
});

export default router;
// history: createWebHistory(),
