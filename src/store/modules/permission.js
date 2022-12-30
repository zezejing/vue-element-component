import { asyncRoutes, constsRoutes } from "@/router";
const rules = ["a"];

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role));
  } else {
    return true;
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export const filterAsyncRoutes = (routes, roles) => {
  let res = [];
  routes.forEach(item => {
    let route = { ...item };
    if (hasPermission(roles, route)) {
      if (route.children) {
        route.children = filterAsyncRoutes(route.children, roles);

        if (route.redirect && route.children.findIndex(i => i.path === route.redirect) === -1) {
          route.redirect = route.children.filter(i => !i.hidden)[0].path;
        }
      }
      res.push(route);
    }
  });
  return res;
};

const state = {
  routes: []
};
const mutations = {
  SET_ROUTES: (state, routes) => {
    // state.addRoutes = routes;
    state.routes = constsRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }) {
    let accessedRoutes = [];
    if (rules.includes("admin")) {
      accessedRoutes = asyncRoutes || [];
    } else {
      accessedRoutes = filterAsyncRoutes(asyncRoutes, rules);
    }
    commit("SET_ROUTES", accessedRoutes);
    return accessedRoutes;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
