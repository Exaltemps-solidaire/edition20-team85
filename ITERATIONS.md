# Plan d'itérations — La Sauvegarde du Nord (équipe G9QV8W)

**Plan validé le 2026-11-17.**

- **Source du plan** : proposé par l'agent. La passation ne contient pas de plan de livraison (`cadrage/6-plan-de-livraison.md`), pas d'hypothèses de version (`cadrage/5-hypotheses.md`) et pas de PRD (`cadrage/7-prd.md`) — tous trois marqués « Pas encore produit ». Le découpage s'appuie donc sur `cadrage/3-solution.md`, `prototype/index.html` et l'ordre de priorité de `cadrage/2-idees-priorisees.md`.
- **Temps restant annoncé** : 120 minutes (question posée le 2026-11-17, avant planification).
- **Temps restant au début de l'itération 1** : 90 minutes (2026-11-17).
- **Temps restant au début de l'itération 2** : 75 minutes (2026-11-17).
- **Temps restant au début de l'itération 3** : 60 minutes (2026-11-17). Le développeur confirme le gabarit déterministe (pas d'appel LLM) pour le rapport — lève le ❓ ci-dessous.
- **Durée du tour de test de l'équipe** : 10 minutes.
- **Capacité estimée** : chaque itération coûte son codage (≤10 min) + ~5 min de publication + 10 min de tour de test, soit 18 à 25 min. 120 minutes permettent environ 5 itérations.

## Hors périmètre

- ✂️ **Famille d'idées n°3 (« idées dont le sens reste à préciser », 1 point)** : jeu, jumeau, ballon — leur sens n'est pas défini dans la passation et leur score de vote est marginal. Exclue de ce plan ; à ne reprendre que si l'équipe le demande explicitement.
- Le Dictaphone / enregistrement audio réel (famille n°1) : complexité (permissions micro, stockage audio, transcription) incompatible avec un budget de 10 min de codage. Remplacé par une capture texte, qui répond au même besoin (« capturer ce qui est dit ») dans le temps imparti.
- L'envoi réel au magistrat (email, API externe) : mocké en statut local pour les itérations prévues ici. À lever en itération ultérieure si le temps le permet et si l'équipe le confirme.

## ⚠️ Points à signaler

- ⚠️ Aucune hypothèse de version n'a été fournie par les cadreurs : les critères d'acceptation ci-dessous sont dérivés directement du prototype et des familles d'idées priorisées, pas d'une hypothèse validée. À faire confirmer par l'équipe au premier tour de test.
- ❓ **Itération 3** : le prototype tague le texte du rapport « Rédigé par l'assistant », ce qui peut désigner un véritable agent IA (famille d'idées n°2, 9 points) ou un gabarit déterministe. Je prévois un **gabarit simple à partir des notes capturées**, sans appel à un modèle de langage, pour rester dans le budget de 10 minutes et éviter une dépendance nouvelle (clé LLM, latence) non validée. Si l'équipe veut un vrai appel au modèle (passerelle `llm.internal`, mode anthropic), c'est une itération à part entière — à confirmer avec les cadreurs avant de la lancer.
- ⚠️ Le budget total (≈111 min pour 5 itérations) est proche des 120 minutes disponibles, sans marge confortable. Si le temps restant se réduit en cours de route, la dernière itération prévue sera sacrifiée en premier au profit de la stabilisation.

---

## Itération 1 : L'écran de situation de la famille Martin est en ligne

- **Dans le périmètre** : déployer le squelette (api + frontend selon le gabarit déjà posé), afficher l'écran 1 du prototype (« Vue de la situation ») avec les données en dur de la famille Martin (enfant, juge, assistant social, parent) et la liste d'actions, sans comportement derrière les actions.
- **Hors périmètre** : toute action cliquable au-delà de la navigation (capture, rédaction, envoi), toute donnée dynamique ou persistée.
- **Critères d'acceptation** :
  - Étant donné l'application déployée, quand on ouvre l'URL publique, alors l'écran « Vue de la situation » affiche la famille Martin et les trois actions du prototype.
  - Étant donné l'application en ligne, quand on appelle `/health` et `/sante` (sur 8080 pour le front), alors les deux répondent 200.
  - Étant donné le dépôt, quand on lance `./scripts/verifier-deployabilite.sh`, alors aucune borne du contrat de déployabilité n'est signalée.
- **Hypothèse de l'équipe couverte** : aucune — non fournie par les cadreurs (voir ⚠️ ci-dessus). Ce choix reproduit fidèlement l'écran 1 du prototype retenu.
- **Codage estimé** : 5 minutes (le squelette `api/`/`frontend/` existe déjà ; il reste l'écran et les fichiers de déploiement).
- **Fichiers prévus** : `frontend/src/app/page.tsx`, `.env.example`, `DEPLOIEMENT.md`, `/srv/team85/app/podman-compose.yml`.
- **Tests unitaires prévus** : aucun — balisage pur, pas de logique métier à cette itération (conforme à la DoD : pas de test sur du balisage).
- **Étapes ajoutées à la démo** : ouvrir l'application, constater l'écran « Vue de la situation » avec la famille Martin.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (chrono `.iterations/1.debut`/`1.fin`), largement sous le budget de 10 minutes. Aucun dépassement, aucune question posée au développeur sur ce point.
  - **Durée totale de l'itération (codage + déploiement + publication)** : environ 15 minutes.
  - **Critères d'acceptation** : les 3 sont satisfaits — écran avec la famille Martin en ligne (vérifié localement, `curl localhost:8080/` renvoie le HTML avec « Famille Martin »), `/health` et `/sante` répondent 200 sur 8080 et 8081, `./scripts/verifier-deployabilite.sh` ne signale aucune borne ni alarme.
  - **Reporté** : rien de prévu n'a été reporté. Hors plan initial : la démo e2e (`e2e/demo.spec.ts`) a été mise à jour mais ne peut pas être exécutée sur cette VM — Chromium installé par Playwright nécessite des bibliothèques système absentes (`libnspr4` et consorts). Ce n'est pas bloquant (la démo n'est pas dans la DoD) ; à signaler à l'équipe plateforme si on veut la faire tourner ici un jour.
  - **Ce que le harnais a bloqué ou refusé** : rien. Le hook `verifier-avant-signal.sh` a laissé passer `signaler-version.sh 1` du premier coup.
  - **Incident de déploiement et correction** : les deux premiers `podman build` ont échoué (`short-name "node:24-alpine" did not resolve to an alias`), conformément à l'avertissement du `/CLAUDE.md` racine. Corrigé en qualifiant les images de base en `docker.io/library/...` dans `api/Dockerfile` et `frontend/Dockerfile` (commit séparé).
  - **Modifications** :
    - `frontend/src/app/page.tsx` : remplace la page `create-next-app` par l'écran « Vue de la situation » (famille Martin, acteurs, 3 actions), données en dur — sert le critère 1.
    - `frontend/src/app/page.module.css` : styles repris de la charte du prototype (`encre`/`ardoise`/`papier`/`appui`) pour cet écran — sert le critère 1.
    - `frontend/nginx.conf` : repris du gabarit de sécurité de la plateforme (`core-platform/templates/nginx.conf`), `connect-src` réduit à `'self'`, routes `/health` et `/sante` conservées — sert le critère 2.
    - `.env.example` : liste la seule variable lue pour l'instant (`PORT`) — sert le critère 3 (contrat de déployabilité).
    - `DEPLOIEMENT.md` : page de déploiement (services, externes, fragile, contact) — sert le critère 3.
    - `podman-compose.yml` : recette de déploiement (réseau `core-network`, ports 8080/8081) — sert le critère 1 (mise en ligne).
    - `api/Dockerfile`, `frontend/Dockerfile` : image de base qualifiée en `docker.io/library/...` — correctif nécessaire au déploiement, sert le critère 1.
    - `e2e/demo.spec.ts` : étape « Je vois la situation de la famille Martin » ajoutée (hors DoD).

## Itération 2 : On peut capturer une note pendant l'intervention et la retrouver

- **Dans le périmètre** : l'action « Capturer ce que j'entends » ouvre un formulaire de note texte ; la note est envoyée à l'API (`POST /api/v1/notes`), persistée (mémoire ou base selon ce qui est déjà câblé), et réaffichée dans une liste sur l'écran de situation (`GET /api/v1/notes`).
- **Hors périmètre** : dictaphone/audio réel, trame d'entretien structurée, plusieurs situations ou familles.
- **Critères d'acceptation** :
  - Étant donné l'écran de situation, quand on clique « Capturer ce que j'entends », alors un formulaire de saisie de note s'affiche.
  - Étant donné une note saisie et validée, quand on revient à l'écran de situation, alors la note apparaît dans la liste.
  - Étant donné l'API, quand on appelle `POST /api/v1/notes` avec une note vide, alors elle est rejetée (validation).
- **Hypothèse de l'équipe couverte** : aucune fournie ; répond à la famille d'idées n°1 (« capturer ce qui est dit ou vécu pendant l'intervention », 10 points, la mieux votée).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `api/src/routes.ts`, `api/src/routes.test.ts`, un nouveau composant/écran de capture côté frontend, le composant liste de notes sur l'écran de situation.
- **Tests unitaires prévus** : 2 — validation d'une note vide rejetée, ajout puis récupération d'une note dans le store.
- **Étapes ajoutées à la démo** : capturer une note depuis l'écran de situation, vérifier qu'elle apparaît dans la liste.
- **Bilan** :
  - **Durée de codage réelle** : 6 minutes (chrono `.iterations/2.debut`/`2.fin`), sous le budget de 10 minutes. Aucun dépassement, aucune question posée au développeur sur ce point.
  - **Critères d'acceptation** : les 3 sont satisfaits. Clic sur « Capturer ce que j'entends » ouvre le formulaire (vérifié par code et par l'étape e2e ajoutée) ; la note soumise réapparaît dans la liste sans rechargement de page (état local mis à jour après le `POST`, vérifié aussi en curl sur le conteneur déployé : `POST` puis `GET /api/v1/notes` retrouve la note) ; `POST /api/v1/notes` avec un texte vide ou fait d'espaces répond 400 (vérifié par test unitaire et par curl sur le déploiement).
  - **Reporté** : rien. La persistance reste en mémoire (perdue au redémarrage du conteneur) — assumé dans le code (commentaire dans `routes.ts`), à lever seulement si l'équipe demande une vraie base.
  - **Ce que le harnais a bloqué ou refusé** : rien. `verifier-deployabilite.sh` n'a signalé aucune borne ; `signaler-version.sh 2` est passé du premier coup.
  - **Modifications** :
    - `api/src/routes.ts` : ajoute le type `Note`, le store en mémoire, `ajouterNote`/`listerNotes`, et les routes `GET`/`POST /api/v1/notes` — sert les critères 2 et 3.
    - `api/src/server.ts` : ajoute le parsing JSON du corps des requêtes `POST` (nécessaire pour recevoir le texte de la note) — sert le critère 2.
    - `api/src/routes.test.ts` : 3 tests ajoutés (note vide rejetée, note valide retrouvée en liste) + bloc dédié à `ajouterNote` (trim, rejet du vide) — protège les critères 2 et 3.
    - `frontend/src/app/page.tsx` : rend l'action « Capturer ce que j'entends » cliquable, affiche le formulaire de saisie, appelle l'API et affiche la liste des notes capturées — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles du formulaire de capture et de la liste de notes — sert le critère 1.
    - `e2e/demo.spec.ts` : étape « Je capture une note pendant l'intervention » ajoutée (hors DoD ; toujours non exécutable sur cette VM, voir bilan de l'itération 1).

## Itération 3 : Le rapport de la visite est pré-rédigé à partir des notes et peut être envoyé

- **Dans le périmètre** : l'écran « Rédiger le rapport » compose un texte à partir des notes capturées (gabarit déterministe, voir ❓ ci-dessus), tagué « Rédigé par l'assistant » ; le bouton « Envoyer au magistrat » marque le rapport comme envoyé (statut local, pas d'envoi réel).
- **Hors périmètre** : génération par un modèle de langage, envoi réel (email/API externe), édition manuelle du texte par le travailleur social.
- **Critères d'acceptation** :
  - Étant donné des notes capturées pour la situation, quand on ouvre l'écran « Rédiger le rapport », alors un texte composé à partir de ces notes s'affiche, tagué « Rédigé par l'assistant ».
  - Étant donné le rapport affiché, quand on clique « Envoyer au magistrat », alors un statut « envoyé » s'affiche sans rechargement d'erreur.
  - Étant donné aucune note capturée, quand on ouvre l'écran « Rédiger le rapport », alors un message explicite remplace le texte (pas de rapport vide silencieux).
- **Hypothèse de l'équipe couverte** : aucune fournie ; répond à la famille d'idées n°2 (« un outil ou agent numérique pour accompagner la rédaction », 9 points).
- **Codage estimé** : 10 minutes.
- **Fichiers prévus** : `api/src/routes.ts` (composition du rapport + statut d'envoi), `api/src/routes.test.ts`, composant écran « Rédiger le rapport » côté frontend.
- **Tests unitaires prévus** : 2 — composition du texte à partir d'une liste de notes, cas sans note.
- **Étapes ajoutées à la démo** : depuis l'écran de situation, aller à « Rédiger le rapport », constater le texte composé, cliquer « Envoyer au magistrat », constater le statut.
- **Bilan** :
  - **Durée de codage réelle** : 1 minute (chrono `.iterations/3.debut`/`3.fin`), très sous le budget de 10 minutes. Aucun dépassement.
  - **Critères d'acceptation** : les 3 sont satisfaits. Le clic sur « Rédiger le rapport d'intervention » ouvre l'écran avec un texte composé à partir des notes capturées, tagué « Rédigé par l'assistant » (vérifié par code et en curl sur le déploiement : une note ajoutée réapparaît en puce dans `GET /api/v1/rapport`) ; le clic sur « Envoyer au magistrat » affiche le statut « Envoyé au magistrat » sans rechargement (état local) ; sans note capturée, le texte est remplacé par un message explicite (« Aucune note n'a encore été capturée... »), vérifié par test unitaire et en curl sur un store neuf.
  - **Reporté** : rien. Conformément au ❓ tranché par le développeur en tête d'itération, le gabarit reste déterministe — aucun appel à `llm.internal` introduit.
  - **Ce que le harnais a bloqué ou refusé** : rien. `verifier-deployabilite.sh` n'a signalé aucune borne ; `signaler-version.sh 3` est passé du premier coup.
  - **Modifications** :
    - `api/src/routes.ts` : ajoute `composerRapport(notes)` (gabarit déterministe, cas sans note géré explicitement) et la route `GET /api/v1/rapport` — sert les critères 1 et 3.
    - `api/src/routes.test.ts` : 2 tests ajoutés sur `composerRapport` (cas vide, cas avec notes) — protège les critères 1 et 3.
    - `frontend/src/app/page.tsx` : rend l'action « Rédiger le rapport d'intervention » cliquable, ajoute l'écran « Rédiger le rapport » (texte composé, tag IA, bouton d'envoi mocké, retour à l'écran de situation) — sert les critères 1 et 2.
    - `frontend/src/app/page.module.css` : styles de l'écran rapport (bloc, tag, statut envoyé, boutons primaire/secondaire) repris de la charte du prototype — sert le critère 1.
    - `e2e/demo.spec.ts` : étape « Je vois le rapport pré-rédigé puis je l'envoie au magistrat » ajoutée (hors DoD ; toujours non exécutable sur cette VM, voir bilan de l'itération 1).

---

## À venir (objectifs ordonnés, non détaillés)

4. Le statut « envoyé au magistrat » et la date d'envoi sont visibles depuis l'écran de situation (historique minimal).
5. Stabilisation finale pour le pitch : relecture des textes, vérification du parcours complet sur l'URL publique, correctifs mineurs — pas de nouvelle fonctionnalité.
