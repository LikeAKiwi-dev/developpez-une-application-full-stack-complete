# FAQ Utilisateur — MDD (Monde de Dév)

Cette FAQ explique les principaux cas d’usage de l’application, ainsi que les erreurs courantes et leurs solutions.

---

## 1) À quoi sert MDD ?

MDD est un MVP de réseau social pour développeurs permettant de :
- créer un compte et se connecter
- s’abonner à des topics (JavaScript, Java, Python, Web3, etc.)
- consulter un fil d’actualité basé sur les topics suivis
- publier des posts
- commenter des posts
- consulter et modifier son profil (page /me)

---

## 2) Comment se connecter rapidement ?

Un compte de test peut être créé via un script SQL (voir section "Données de test" dans le README).
Ensuite :
1. Aller sur la page de connexion
2. Renseigner l’email et le mot de passe
3. Valider

Si la connexion échoue, voir la section “Erreurs courantes”.

---

## 3) Je ne vois pas de posts dans le fil (feed). Pourquoi ?

Causes fréquentes :
- Aucun topic n’est suivi
- Aucun post n’existe encore sur les topics suivis

Solutions :
- Aller sur la page Thèmes et s’abonner à un ou plusieurs topics
- Créer un post sur un topic, puis revenir sur le feed
- Vérifier que la base contient bien des topics (données de test)

---

## 4) Comment s’abonner à un topic ?

1. Aller sur la page Thèmes
2. Cliquer sur “S’abonner” sur un topic

Résultat :
- Le topic est ajouté à la liste des abonnements
- Le fil d’actualité affichera ensuite les posts liés à ces topics

---

## 5) Comment publier un post ?

1. Aller sur la page de création d'article
2. Sélectionner un topic
3. Renseigner un titre et un contenu
4. Valider

Erreurs possibles :
- Topic non sélectionné
- Titre ou contenu vide
- Session expirée (voir section JWT / 401)

---

## 6) Comment commenter un post ?

1. Ouvrir le détail d’un post
2. Saisir un commentaire
3. Envoyer

Erreurs possibles :
- Commentaire vide
- Session expirée (401)
- Post introuvable (404 si le post a été supprimé ou si l’URL est incorrecte)

---

## 7) Je suis déconnecté “tout seul”. Pourquoi ?

Cause la plus fréquente :
- Le token JWT a expiré (JWT_EXPIRATION_MS)

Solution :
- Se reconnecter
- Si cela arrive trop vite, vérifier la variable JWT_EXPIRATION_MS côté backend

---

# Erreurs courantes et solutions

## A) Erreur “401 Unauthorized” (non autorisé)

Signification :
- L’utilisateur n’est pas authentifié
- Le token JWT est absent, invalide ou expiré

Solutions :
- Se reconnecter
- Vérifier que le frontend envoie bien l’en-tête :
  Authorization: Bearer <token>
- Vérifier que les variables d’environnement JWT sont bien configurées :
  JWT_SECRET
  JWT_EXPIRATION_MS

---

## B) Erreur “403 Forbidden” (interdit)

Signification :
- L’utilisateur est authentifié mais n’a pas les droits sur la ressource

Solutions :
- Vérifier que l’utilisateur est connecté
- Vérifier que l’endpoint n’est pas restreint à un rôle spécifique (si applicable)

---

## C) Erreur “404 Not Found” (introuvable)

Causes fréquentes :
- URL invalide
- Ressource supprimée (post / topic)
- Mauvaise base URL API dans le frontend

Solutions :
- Vérifier la route dans le frontend
- Vérifier la configuration API dans :
  front/src/environments/environment.ts
- Vérifier que le backend tourne bien sur http://localhost:8080

---

## D) Erreur “500 Internal Server Error”

Causes fréquentes :
- Erreur backend (exception)
- Base de données non accessible
- Données manquantes / incohérentes

Solutions :
- Regarder les logs du backend dans la console
- Vérifier la configuration DB_* (voir README)
- Vérifier que la base est créée et que les tables existent
- Vérifier que les données de test ont été insérées (topics + user)

---

## E) Le backend ne démarre pas (erreur de configuration JWT)

Symptômes :
- Le backend plante au démarrage
- Erreurs liées au secret / expiration JWT

Solutions :
- Configurer les variables d’environnement dans IntelliJ :
  JWT_SECRET
  JWT_EXPIRATION_MS
- Vérifier “Run > Edit Configurations > Environment Variables”
- Cocher “Include system environment variables”

---

## F) Le backend ne démarre pas (erreur base de données)

Symptômes :
- erreurs de connexion (Access denied, Communications link failure, Unknown database, etc.)

Solutions :
- Vérifier que MySQL tourne
- Vérifier les variables :
  DB_HOST
  DB_PORT
  DB_NAME
  DB_USER
  DB_PASSWORD
- Vérifier que la base DB_NAME existe
- Exécuter le script schema.sql
- Vérifier l’utilisateur MySQL et ses droits

---

## G) Je n’ai aucun topic dans l’application

Cause :
- La table topic est vide

Solution :
- Exécuter le script SQL de données de test (topics)

---

# Problèmes Postman (tests API)

## Je reçois 401 sur les routes protégées via Postman

Solution :
1. Faire d’abord un login
2. Récupérer le token JWT dans la réponse
3. Dans Postman, ajouter le header :
   Authorization: Bearer <token>

Astuce :
- Utiliser un Environment Postman avec une variable token
- Automatiser la récupération du token via un script “Tests” dans la requête Login

---

# Questions fréquentes

## Quel navigateur utiliser ?
Chrome ou Edge fonctionnent. Pour Cypress, il faut utiliser un navigateur compatible (Edge/Chrome selon la configuration).

## Est-ce normal que ce soit un MVP ?
Oui. Les fonctionnalités sont volontairement simples (inscription, login, topics, feed, posts, commentaires, profil).

## Où trouver les logs en cas de bug ?
- Backend : console IntelliJ / terminal (mvn spring-boot:run)
- Frontend : console navigateur (F12)

---

# Support

Si un problème persiste :
- vérifier que le backend et le frontend sont lancés
- vérifier les variables DB_* et JWT_*
- vérifier que la base contient schema + données de test
- relancer backend puis frontend
