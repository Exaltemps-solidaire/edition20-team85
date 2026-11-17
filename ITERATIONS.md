# Plan d'itérations — La Sauvegarde du Nord (équipe G9QV8W)

**Plan validé le 2026-11-17.**

- **Source du plan** : proposé par l'agent. La passation ne contient pas de plan de livraison (`cadrage/6-plan-de-livraison.md`), pas d'hypothèses de version (`cadrage/5-hypotheses.md`) et pas de PRD (`cadrage/7-prd.md`) — tous trois marqués « Pas encore produit ». Le découpage s'appuie donc sur `cadrage/3-solution.md`, `prototype/index.html` et l'ordre de priorité de `cadrage/2-idees-priorisees.md`.
- **Temps restant annoncé** : 120 minutes (question posée le 2026-11-17, avant planification).
- **Temps restant au début de l'itération 1** : 90 minutes (2026-11-17).
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
- **Bilan** : _à remplir en fin d'itération._

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
- **Bilan** : _à remplir en fin d'itération._

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
- **Bilan** : _à remplir en fin d'itération._

---

## À venir (objectifs ordonnés, non détaillés)

4. Le statut « envoyé au magistrat » et la date d'envoi sont visibles depuis l'écran de situation (historique minimal).
5. Stabilisation finale pour le pitch : relecture des textes, vérification du parcours complet sur l'URL publique, correctifs mineurs — pas de nouvelle fonctionnalité.
