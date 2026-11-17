import { describe, expect, it } from "vitest";
import { ajouterNote, router } from "./routes.ts";

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
