/* ============================================================
   GENESIS AI — SPA Router
   Hash-based single-page application routing
   ============================================================ */

export class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.onNavigate = null;
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  }

  register(path, handler) {
    this.routes[path] = handler;
    return this;
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve() {
    const hash = window.location.hash || '/';
    const page = this.routes[hash];
    if (page) {
      if (this.onNavigate) this.onNavigate(hash);
      this.currentPage = hash;
      page();
    } else if (this.routes['/']) {
      this.currentPage = '/';
      this.routes['/']();
    }
  }

  getCurrentPath() {
    return window.location.hash || '/';
  }
}

export const router = new Router();
