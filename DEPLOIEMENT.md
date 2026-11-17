# Déploiement

Application pour les travailleurs sociaux de La Sauvegarde du Nord, pour qu'ils passent moins de
temps à écrire et plus de temps à écouter. Itération 1 : écran de situation d'une famille suivie
(données en dur), rien de dynamique encore.

## Services

- `frontend/` : export statique Next.js servi par nginx, port 80 du conteneur (8080 côté serveur).
  **C'est le service exposé.**
- `api/` : service Node, port 8081 du conteneur (8081 côté serveur). Sert `/health` et `/sante`
  pour l'instant, aucune route métier.

## Services externes appelés

Aucun à cette itération. Le frontend n'appelle pas encore l'API.

## Fragile / inachevé

- Les trois actions de l'écran de situation (« Capturer ce que j'entends », « Rédiger le rapport
  d'intervention », « Envoyer au magistrat ») sont affichées mais ne font rien : prévues aux
  itérations 2 et 3.
- Une seule situation (famille Martin), en dur dans `frontend/src/app/page.tsx` : pas encore de
  liste de situations ni de base de données.

## Contact

- Équipe : Équipe 85 (squad MARIONINENGLAND, code G9QV8W).
- Association : aucun contact nominatif fiable dans la passation — les noms cités dans
  `passation/PASSATION.md` sont des composites reconstitués, pas des personnes réelles (voir
  l'avertissement en tête de ce fichier). À demander aux cadreurs avant le pitch.
