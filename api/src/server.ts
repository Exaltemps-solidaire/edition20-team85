// Service api du gabarit : écoute sur PORT (8081 par défaut), journaux sur la sortie standard.
// Lancé directement par Node (suppression des types TypeScript), sans étape de compilation.
import { createServer } from "node:http";
import { router } from "./routes.ts";

const port = Number(process.env.PORT ?? 8081);

function repondre(res: import("node:http").ServerResponse, statut: number, corps: unknown) {
  if (corps === undefined) {
    res.writeHead(statut).end();
  } else {
    res.writeHead(statut, { "Content-Type": "application/json" }).end(JSON.stringify(corps));
  }
}

const serveur = createServer((req, res) => {
  const methode = req.method ?? "GET";
  if (methode === "POST") {
    const morceaux: Buffer[] = [];
    req.on("data", (morceau) => morceaux.push(morceau));
    req.on("end", () => {
      let corps: unknown;
      try {
        corps = JSON.parse(Buffer.concat(morceaux).toString("utf8") || "{}");
      } catch {
        return repondre(res, 400, { erreur: "JSON invalide" });
      }
      const { statut, corps: reponse } = router(methode, req.url ?? "/", corps);
      repondre(res, statut, reponse);
    });
    return;
  }
  const { statut, corps } = router(methode, req.url ?? "/");
  repondre(res, statut, corps);
});

serveur.listen(port, () => console.log(`api : à l'écoute sur le port ${port}`));

// Arrêt propre : le conteneur reçoit SIGTERM, on termine les requêtes en cours avant de sortir.
for (const signal of ["SIGTERM", "SIGINT"] as const) {
  process.on(signal, () => {
    console.log(`api : ${signal} reçu, arrêt`);
    serveur.close(() => process.exit(0));
  });
}
