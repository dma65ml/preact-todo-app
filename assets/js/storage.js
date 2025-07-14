/**
 * MODULE DE STOCKAGE
 *
 * Ce module:
 * - Simule un stockage persistant
 * - Pourrait être remplacé par localStorage
 */
define([], function () {
  // Base de données en mémoire
  let data = [];

  return {
    /**
     * CHARGEMENT DES DONNEES
     * @returns {Array} - Liste des tâches
     */
    load: function () {
      try {
        // En production: utiliser localStorage
        // const stored = localStorage.getItem('todos');
        // return stored ? JSON.parse(stored) : [];
        return data;
      } catch (e) {
        console.error("Erreur lors du chargement des données:", e);
        return [];
      }
    },

    /**
     * SAUVEGARDE DES DONNEES
     * @param {Array} todos - Liste des tâches à sauvegarder
     */
    save: function (todos) {
      try {
        // En production: utiliser localStorage
        // localStorage.setItem('todos', JSON.stringify(todos));

        // Copie du tableau pour éviter les mutations
        data = [...todos];
        console.log("Données sauvegardées:", data);
      } catch (e) {
        console.error("Erreur lors de la sauvegarde:", e);
      }
    },
  };
});
