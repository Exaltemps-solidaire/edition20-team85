import { describe, expect, it } from "vitest";
import { ajouterNote, composerRapport, router, statutEnvoi } from "./routes.ts";

describe("router", () => {
  it("répond 200 sur les deux routes de santé", () => {
    expect(router("GET", "/health").statut).toBe(200);
    expect(router("GET", "/sante?x=1").statut).toBe(200);
  });

  it("répond 404 sur une route inconnue ou une méthode non prévue", () => {
    expect(router("GET", "/api/v1/inconnue").statut).toBe(404);
    expect(router("POST", "/health").statut).toBe(404);
  });

  it("rejette une note vide ou faite d'espaces, sur POST /api/v1/notes", () => {
    expect(router("POST", "/api/v1/notes", { texte: "" }).statut).toBe(400);
    expect(router("POST", "/api/v1/notes", { texte: "   " }).statut).toBe(400);
  });

  it("accepte une note non vide et la retrouve ensuite sur GET /api/v1/notes", () => {
    const creation = router("POST", "/api/v1/notes", { texte: "  Léa semble sereine  " });
    expect(creation.statut).toBe(201);
    const liste = router("GET", "/api/v1/notes").corps as { notes: { texte: string }[] };
    expect(liste.notes.some((n) => n.texte === "Léa semble sereine")).toBe(true);
  });
});

describe("ajouterNote", () => {
  it("coupe les espaces superflus et refuse une note vide", () => {
    expect(ajouterNote("   ")).toBeNull();
    expect(ajouterNote("  bonjour  ")?.texte).toBe("bonjour");
  });
});

describe("composerRapport", () => {
  it("retourne un message explicite quand aucune note n'est capturée", () => {
    expect(composerRapport([])).toContain("Aucune note");
  });

  it("compose un texte à partir des notes capturées", () => {
    const texte = composerRapport([{ texte: "Léa semble sereine", creeLe: "2026-01-01T00:00:00.000Z" }]);
    expect(texte).toContain("Léa semble sereine");
  });
});

describe("statut d'envoi du rapport", () => {
  it("enregistre une date d'envoi retrouvable sur GET /api/v1/rapport", () => {
    expect(statutEnvoi()).toBeNull();
    const creation = router("POST", "/api/v1/rapport/envoi");
    expect(creation.statut).toBe(201);
    const rapport = router("GET", "/api/v1/rapport").corps as { envoyeLe: string | null };
    expect(rapport.envoyeLe).not.toBeNull();
  });
});
