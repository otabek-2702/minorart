import { clearUserSession } from '@/helpers';
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory, RouteMeta } from 'vue-router'
import routes from '~pages'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...setupLayouts(routes),
  ],
})

// Global navigation guard with proper typing
router.beforeEach((to, from, next) => {
  // Check if authentication is required for this route
  if (to.matched.some((record) => (record.meta as RouteMeta).requiresAuth)) {
    const token = localStorage.getItem("accessToken");
    // const userData = JSON.parse(localStorage.getItem("userData") ?? "{}");

    // const isLoggedIn = token && userData?.name;
    const isLoggedIn = token;

    if (!isLoggedIn && to.name !== "Login") {
      clearUserSession();
      return next({ name: "Login", query: { to: to.path.slice(1) ?? "" } });
    }
  }

  // If no checks are required, continue to the requested route
  next();
});

export default router
