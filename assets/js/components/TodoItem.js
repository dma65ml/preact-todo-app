/**
 * COMPOSANT POUR UNE TACHE INDIVIDUELLE
 *
 * Ce composant:
 * - Affiche une tâche
 * - Gère les interactions utilisateur
 * - Est un composant "dumb" (sans état)
 */
define(["preact"], function (preact) {
  // Raccourcis Preact
  const { h } = preact; // Fonction hyperscript
  const html = window.htm.bind(h); // Initialise HTM

  /**
   * Composant fonctionnel TodoItem
   * @param {Object} props - Propriétés
   * @param {Object} props.todo - Données de la tâche
   * @param {Function} props.onToggle - Handler pour basculer l'état
   * @param {Function} props.onDelete - Handler pour suppression
   */
  return function TodoItem({ todo, onToggle, onDelete }) {
    /**
     * RENDU AVEC HTM:
     * Syntaxe proche du HTML
     */
    return html`
      <div class=${`todo-item ${todo.completed ? "completed" : ""}`}>
        <!-- Case à cocher pour compléter/incompléter -->
        <input
          type="checkbox"
          class="todo-checkbox"
          checked=${todo.completed}
          onChange=${() => onToggle(todo.id)}
        />

        <!-- Texte de la tâche -->
        <div class="todo-text">${todo.text}</div>

        <!-- Bouton de suppression -->
        <button class="todo-delete" onClick=${() => onDelete(todo.id)}>
          Supprimer
        </button>
      </div>
    `;
  };
});
