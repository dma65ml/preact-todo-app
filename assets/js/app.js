/**
 * POINT D'ENTREE PRINCIPAL DE L'APPLICATION
 *
 * Ce module:
 * 1. Importe Preact et le composant racine TodoApp
 * 2. Fournit une méthode init() pour démarrer l'app
 * 3. Rend le composant racine dans le DOM
 */
define(["preact", "assets/js/components/TodoApp"], function (preact, TodoApp) {
  return {
    /**
     * Initialise l'application Preact
     */
    init: function () {
      // Récupère la fonction render de Preact
      const render = preact.render;

      // Crée une instance du composant racine TodoApp
      const appComponent = preact.h(TodoApp, null);

      // Rend le composant dans le conteneur #app
      render(appComponent, document.getElementById("app"));
    },
  };
});
