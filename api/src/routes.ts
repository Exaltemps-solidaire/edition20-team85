// Routage de l'API, sans dépendance : une fonction pure, testable sans démarrer de serveur.
// Le proxy d'entrée envoie /api/... à ce service sans retirer le préfixe : les routes métier
// se déclarent donc sous /api/v1/... ; /health et /sante restent à la racine (port 8081).

export type Reponse = { statut: number; corps?: unknown };
export type Note = { texte: string; creeLe: string };

// Stockage en mémoire : perdu au redémarrage du conteneur. Suffisant pour l'itération 2 ;
// une base de données persistante est hors périmètre tant qu'elle n'est pas demandée.
const notes: Note[] = [];

export function ajouterNote(texte: string): Note | null {
  const propre = texte.trim();
  if (propre === "") return null;
  const note: Note = { texte: propre, creeLe: new Date().toISOString() };
  notes.push(note);
  return note;
}

export function listerNotes(): Note[] {
  return notes;
}

export function router(methode: string, url: string, corps?: unknown): Reponse {
  const chemin = new URL(url, "http://api").pathname;
  if (methode === "GET" && (chemin === "/health" || chemin === "/sante")) {
    return { statut: 200, corps: { status: "ok" } };
  }
  if (chemin === "/api/v1/notes") {
    if (methode === "GET") {
      return { statut: 200, corps: { notes: listerNotes() } };
    }
    if (methode === "POST") {
      const texte = typeof corps === "object" && corps !== null ? (corps as Record<string, unknown>).texte : undefined;
      if (typeof texte !== "string") return { statut: 400, corps: { erreur: "texte manquant" } };
      const note = ajouterNote(texte);
      if (note === null) return { statut: 400, corps: { erreur: "note vide" } };
      return { statut: 201, corps: note };
    }
  }
  return { statut: 404 };
}
