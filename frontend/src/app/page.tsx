import styles from "./page.module.css";

const situation = {
  famille: "Famille Martin",
  mesure: "Mesure AEMO · depuis le 14 mars 2025",
  acteurs: {
    enfant: { role: "Enfant", nom: "Léa, 9 ans" },
    juge: { role: "Juge", nom: "Mme Perrin" },
    assistant: { role: "Assistant social", nom: "Moi" },
    parent: "Parent · M. Martin",
  },
  actions: [
    "Capturer ce que j'entends",
    "Rédiger le rapport d'intervention",
    "Envoyer au magistrat",
  ],
};

export default function Home() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.labelService}>Intervention en cours</div>
        <h1>{situation.famille}</h1>
        <div className={styles.subtitle}>{situation.mesure}</div>
      </header>

      <section className={styles.relationsArea}>
        <div className={styles.areaLabel}>Acteurs de la situation</div>
        <div className={styles.relationsDiagram}>
          <div className={styles.actorBubble}>
            {situation.acteurs.enfant.role}
            <br />
            <span className={styles.actorNom}>{situation.acteurs.enfant.nom}</span>
          </div>
          <div className={styles.actorBubble}>
            {situation.acteurs.juge.role}
            <br />
            <span className={styles.actorNom}>{situation.acteurs.juge.nom}</span>
          </div>
          <div className={`${styles.actorBubble} ${styles.central}`}>
            {situation.acteurs.assistant.role}
            <br />
            <span className={styles.actorNom}>{situation.acteurs.assistant.nom}</span>
          </div>
        </div>
        <div className={styles.parentRow}>→ {situation.acteurs.parent}</div>
      </section>

      <div className={styles.sectionTitle}>Que faire maintenant ?</div>
      <ul className={styles.actionList}>
        {situation.actions.map((action) => (
          <li key={action} className={styles.actionItem}>
            <span>{action}</span>
            <span className={styles.actionArrow}>›</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
