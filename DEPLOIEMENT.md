# Déploiement

Application pour les travailleurs sociaux de La Sauvegarde du Nord, pour qu'ils passent moins de
temps à écrire et plus de temps à écouter. Écran de situation d'une famille suivie : capture de
notes pendant l'intervention, rapport pré-rédigé à partir de ces notes, et statut d'envoi au
magistrat.

## Services

- `frontend/` : export statique Next.js servi par nginx, port 80 du conteneur (8080 côté serveur).
  **C'est le service exposé.** Appelle l'API en chemin relatif (`/api/v1/...`).
- `api/` : service Node, port 8081 du conteneur (8081 côté serveur). Sert `/health`, `/sante`, et
  les routes métier `/api/v1/notes` (GET/POST) et `/api/v1/rapport` (GET), `/api/v1/rapport/envoi`
  (POST).

## Services externes appelés

Aucun. Le rapport est composé par un gabarit déterministe côté API, pas par un appel à la
passerelle LLM (`llm.internal`) — choix du développeur pour cette itération.

## Fragile / inachevé

- Les notes et le statut d'envoi sont stockés en mémoire dans le conteneur `api` : perdus à chaque
  redémarrage. Pas de base de données persistante.
- Une seule situation (famille Martin), en dur dans `frontend/src/app/page.tsx` : pas encore de
  liste de situations.
- L'envoi au magistrat est un statut local (date enregistrée côté API) : aucun email ni appel à un
  système externe n'est réellement déclenché.
- Le rapport est un gabarit déterministe (liste des notes capturées), pas une rédaction par un
  modèle de langage.

## Contact

- Équipe : Équipe 85 (squad MARIONINENGLAND, code G9QV8W).
- Association : aucun contact nominatif fiable dans la passation — les noms cités dans
  `passation/PASSATION.md` sont des composites reconstitués, pas des personnes réelles (voir
  l'avertissement en tête de ce fichier). À demander aux cadreurs avant le pitch.
