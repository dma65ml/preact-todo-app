/**
 * COMPOSANT RACINE DE L'APPLICATION
 *
 * Ce composant:
 * - Gère l'état global de l'UI (nouvelle tâche)
 * - Contient la logique d'interaction utilisateur
 * - Utilise HTM pour la syntaxe JSX-like
 */
define([
  "preact",
  "preact/hooks",
  "assets/js/TodoModel",
  "assets/js/components/TodoItem",
], function (preact, hooks, TodoModel, TodoItem) {
  // Raccourcis pour les fonctionnalités Preact
  const { h } = preact; // Fonction hyperscript pour créer des éléments
  const { useState, useEffect } = hooks; // Hooks React pour gérer l'état local
  const html = window.htm.bind(h); // Initialise HTM avec Preact

  /**
   * Composant fonctionnel TodoApp
   * Utilise des hooks pour gérer son état
   */
  return function TodoApp() {
    // ETAT LOCAL: Gère la valeur du champ de saisie
    const [newTodo, setNewTodo] = useState("");

    // ETAT LOCAL: Version pour forcer le re-rendu
    const [version, setVersion] = useState(0);

    /**
     * ABONNEMENT AU MODELE:
     * - S'abonne aux changements du modèle
     * - Force un re-rendu quand le modèle change
     * - Seulement au montage (dépendances vides [])
     */
    useEffect(() => {
      // Callback qui incrémente la version pour forcer le rendu
      const callback = () => setVersion((v) => v + 1);

      // S'abonne au modèle
      TodoModel.subscribe(callback);

      // Fonction de nettoyage: désabonnement
      return () => TodoModel.unsubscribe(callback);
    }, []);

    /**
     * GESTION DE LA SOUMISSION DU FORMULAIRE
     * @param {Event} e - Événement de soumission
     */
    const handleSubmit = (e) => {
      e.preventDefault(); // Empêche le rechargement de la page

      // Tente d'ajouter la nouvelle tâche via le modèle
      if (TodoModel.add(newTodo)) {
        setNewTodo(""); // Réinitialise le champ si succès
      }
    };

    // Raccourcis pour les gestionnaires d'événements
    const handleToggle = (id) => TodoModel.toggle(id);
    const handleDelete = (id) => TodoModel.remove(id);

    // Données à afficher
    const stats = TodoModel.getStats(); // Statistiques
    const error = TodoModel.error; // Message d'erreur
    const todos = TodoModel.todos; // Liste des tâches

    /**
     * RENDU AVEC HTM:
     * Syntaxe JSX-like sans compilation
     */
    return html`
      <div class="todo-app">
        <!-- Titre de l'application -->
        <h1 class="todo-header">Ma Todo List</h1>

        <!-- Formulaire d'ajout -->
        <form class="todo-form" onSubmit=${handleSubmit}>
          <input
            type="text"
            class="todo-input"
            placeholder="Ajouter une nouvelle tâche..."
            value=${newTodo}
            onInput=${(e) => {
              // Met à jour l'état local à chaque frappe
              setNewTodo(e.target.value);
              // Efface les erreurs précédentes
              TodoModel.clearError();
            }}
          />
        </form>

        <!-- Affichage conditionnel des erreurs -->
        ${error ? html`<div class="error-message">${error}</div>` : null}

        <!-- Affichage conditionnel de la liste -->
        ${todos.length === 0
          ? html`<div class="empty-state">
              Aucune tâche pour le moment. Ajoutez-en une !
            </div>`
          : html`
              <ul class="todo-list">
                ${todos.map(
                  (todo) => html`
                    <!-- Chaque élément de liste a une clé unique pour l'optimisation -->
                    <li key=${todo.id}>
                      <!-- Composant TodoItem pour afficher une tâche -->
                      <${TodoItem}
                        todo=${todo}
                        onToggle=${handleToggle}
                        onDelete=${handleDelete}
                      />
                    </li>
                  `,
                )}
              </ul>
            `}

        <!-- Affichage conditionnel des statistiques -->
        ${stats.total > 0
          ? html`
              <div class="todo-stats">
                <span>Total: ${stats.total}</span>
                <span>Terminées: ${stats.completed}</span>
                <span>Restantes: ${stats.remaining}</span>
              </div>
            `
          : null}
      </div>
    `;
  };
});
