/**
 * MODELE DE DONNEES ET LOGIQUE METIER
 *
 * Ce module:
 * - Gère l'état global des données (todos)
 * - Contient la logique métier (ajout, suppression, etc.)
 * - Implémente un pattern Observer pour les mises à jour
 */
define(["assets/js/storage"], function (storage) {
  // Objet principal du modèle
  const TodoModel = {
    todos: [], // Liste des tâches
    error: null, // Message d'erreur
    listeners: [], // Liste des abonnés aux changements

    /**
     * INITIALISATION:
     * - Charge les données depuis le stockage
     * - Notifie les écouteurs
     */
    init: function () {
      this.todos = storage.load();
      this.notify(); // Première notification
    },

    /**
     * ABONNEMENT AUX CHANGEMENTS (pattern Observer)
     * @param {Function} callback - Fonction à appeler lors des changements
     */
    subscribe: function (callback) {
      this.listeners.push(callback);
    },

    /**
     * DESABONNEMENT
     * @param {Function} callback - Fonction à désabonner
     */
    unsubscribe: function (callback) {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    },

    /**
     * NOTIFICATION DES ABONNES
     */
    notify: function () {
      this.listeners.forEach((cb) => cb());
    },

    /**
     * AJOUT D'UNE TACHE
     * @param {string} text - Texte de la tâche
     * @returns {boolean} - Succès de l'opération
     */
    add: function (text) {
      // Validation: texte non vide
      if (!text || text.trim() === "") {
        this.error = "Le texte de la tâche ne peut pas être vide";
        this.notify();
        return false;
      }

      // Création de la nouvelle tâche
      const todo = {
        id: Date.now(), // ID unique basé sur le timestamp
        text: text.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };

      // Ajout à la liste
      this.todos.push(todo);
      this.save(); // Persistance
      this.error = null; // Reset erreur
      this.notify(); // Notification des abonnés
      return true;
    },

    /**
     * BASCULEMENT DE L'ETAT D'UNE TACHE
     * @param {number} id - ID de la tâche
     */
    toggle: function (id) {
      const todo = this.todos.find((t) => t.id === id);
      if (todo) {
        todo.completed = !todo.completed; // Inverse l'état
        this.save();
        this.notify();
      }
    },

    /**
     * SUPPRESSION D'UNE TACHE
     * @param {number} id - ID de la tâche
     */
    remove: function (id) {
      // Filtre pour supprimer la tâche
      this.todos = this.todos.filter((t) => t.id !== id);
      this.save();
      this.notify();
    },

    /**
     * SAUVEGARDE DANS LE STOCKAGE
     */
    save: function () {
      storage.save(this.todos);
    },

    /**
     * CALCUL DES STATISTIQUES
     * @returns {Object} - Total, complétées, restantes
     */
    getStats: function () {
      const total = this.todos.length;
      const completed = this.todos.filter((t) => t.completed).length;
      const remaining = total - completed;
      return { total, completed, remaining };
    },

    /**
     * EFFACEMENT DES MESSAGES D'ERREUR
     */
    clearError: function () {
      if (this.error) {
        this.error = null;
        this.notify();
      }
    },
  };

  // Initialisation immédiate au chargement
  TodoModel.init();

  // Exporte le modèle pour les autres modules
  return TodoModel;
});
