"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Note = { texte: string; creeLe: string };

const situation = {
  famille: "Famille Martin",
  mesure: "Mesure AEMO · depuis le 14 mars 2025",
  acteurs: {
    enfant: { role: "Enfant", nom: "Léa, 9 ans" },
    juge: { role: "Juge", nom: "Mme Perrin" },
    assistant: { role: "Assistant social", nom: "Moi" },
    parent: "Parent · M. Martin",
  },
};

type Ecran = "situation" | "rapport";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [captureOuverte, setCaptureOuverte] = useState(false);
  const [texte, setTexte] = useState("");
  const [ecran, setEcran] = useState<Ecran>("situation");
  const [rapportTexte, setRapportTexte] = useState("");
  const [envoyeLe, setEnvoyeLe] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/notes")
      .then((reponse) => reponse.json())
      .then((donnees: { notes: Note[] }) => setNotes(donnees.notes))
      .catch(() => {
        // L'API n'est pas joignable en chemin relatif hors de la passerelle d'entrée (voir DEPLOIEMENT.md).
      });
    fetch("/api/v1/rapport")
      .then((reponse) => reponse.json())
      .then((donnees: { envoyeLe: string | null }) => setEnvoyeLe(donnees.envoyeLe))
      .catch(() => {
        // L'API n'est pas joignable en chemin relatif hors de la passerelle d'entrée (voir DEPLOIEMENT.md).
      });
  }, []);

  async function soumettreNote(evenement: React.FormEvent) {
    evenement.preventDefault();
    if (texte.trim() === "") return;
    const reponse = await fetch("/api/v1/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texte }),
    });
    if (reponse.ok) {
      const note: Note = await reponse.json();
      setNotes((precedentes) => [...precedentes, note]);
      setTexte("");
      setCaptureOuverte(false);
    }
  }

  function ouvrirRapport() {
    setEcran("rapport");
    fetch("/api/v1/rapport")
      .then((reponse) => reponse.json())
      .then((donnees: { texte: string; envoyeLe: string | null }) => {
        setRapportTexte(donnees.texte);
        setEnvoyeLe(donnees.envoyeLe);
      })
      .catch(() => {
        // L'API n'est pas joignable en chemin relatif hors de la passerelle d'entrée (voir DEPLOIEMENT.md).
      });
  }

  async function envoyerAuMagistrat() {
    const reponse = await fetch("/api/v1/rapport/envoi", { method: "POST" });
    if (reponse.ok) {
      const donnees: { envoyeLe: string } = await reponse.json();
      setEnvoyeLe(donnees.envoyeLe);
    }
  }

  if (ecran === "rapport") {
    return (
      <div className={styles.page}>
        <header className={styles.header}>
          <div className={styles.labelService}>Rapport d&apos;intervention</div>
          <h1>{situation.famille}</h1>
          <div className={styles.subtitle}>Visite en cours</div>
        </header>

        <div className={styles.rapportBloc}>
          <span className={styles.tagIA}>Rédigé par l&apos;assistant</span>
          <p className={styles.rapportTexte}>{rapportTexte}</p>
        </div>

        {envoyeLe ? (
          <div className={styles.statutEnvoye}>Envoyé au magistrat le {new Date(envoyeLe).toLocaleString("fr-FR")}</div>
        ) : (
          <button className={styles.btnPrimary} onClick={envoyerAuMagistrat}>
            Envoyer au magistrat
          </button>
        )}
        <button className={styles.btnSecondaire} onClick={() => setEcran("situation")}>
          Reprendre plus tard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.labelService}>Intervention en cours</div>
        <h1>{situation.famille}</h1>
        <div className={styles.subtitle}>{situation.mesure}</div>
        {envoyeLe && (
          <div className={styles.badgeEnvoye}>
            Envoyé au magistrat le {new Date(envoyeLe).toLocaleString("fr-FR")}
          </div>
        )}
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
        <li
          className={styles.actionItem}
          onClick={() => setCaptureOuverte(true)}
          role="button"
          tabIndex={0}
        >
          <span>Capturer ce que j&apos;entends</span>
          <span className={styles.actionArrow}>›</span>
        </li>
        <li
          className={styles.actionItem}
          onClick={ouvrirRapport}
          role="button"
          tabIndex={0}
        >
          <span>Rédiger le rapport d&apos;intervention</span>
          <span className={styles.actionArrow}>›</span>
        </li>
        <li className={styles.actionItem}>
          <span>Envoyer au magistrat</span>
          <span className={styles.actionArrow}>›</span>
        </li>
      </ul>

      {captureOuverte && (
        <form className={styles.captureForm} onSubmit={soumettreNote}>
          <textarea
            className={styles.captureTextarea}
            value={texte}
            onChange={(e) => setTexte(e.target.value)}
            placeholder="Ce que j'entends pendant l'intervention…"
            required
            autoFocus
          />
          <button type="submit" className={styles.captureBouton}>
            Enregistrer la note
          </button>
        </form>
      )}

      <div className={styles.sectionTitle}>Notes capturées ({notes.length})</div>
      <ul className={styles.notesList}>
        {notes.map((note, index) => (
          <li key={index} className={styles.noteItem}>
            {note.texte}
          </li>
        ))}
      </ul>
    </div>
  );
}
