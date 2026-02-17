# Développez une application full-stack complète

---

# Installation et démarrage du projet

Le projet est une application full-stack composée de :

- Backend Spring Boot (port 8080)
- Frontend Angular (port 4200)

---

# Architecture du projet

Le projet suit une architecture full-stack séparée :

Backend : API REST sécurisée développée avec Spring Boot  
Frontend : Single Page Application développée avec Angular  
Base de données : MySQL (script SQL fourni)

## Communication

- Le frontend consomme l’API REST via HTTP (JSON)
- Authentification sécurisée via JWT
- Les routes sensibles sont protégées côté backend

## Ports utilisés

Backend : http://localhost:8080  
Frontend : http://localhost:4200

---

# Prérequis

- Git
- Java JDK 21
- Maven 3.9.3 ou supérieur
- Node.js (version LTS recommandée)
- npm
- MySQL

---

# Installation

## Cloner le dépôt

```bash
git clone https://github.com/LikeAKiwi-dev/developpez-une-application-full-stack-complete.git
cd developpez-une-application-full-stack-complete-main
```

## Installer les dépendances frontend

```bash
cd front
npm install
```

---

# Configuration de la base de données

Le backend utilise des variables d’environnement pour la configuration de la base de données.

Variables nécessaires :

DB_HOST  
DB_PORT  
DB_NAME  
DB_USER  
DB_PASSWORD

### Exemple

DB_HOST=localhost  
DB_PORT=3306  
DB_NAME=projet5  
DB_USER=projet5  
DB_PASSWORD=projet5_password

---

## Initialisation de la base

Le script SQL de création est disponible dans :

```
back/src/main/resources/schema.sql
```

Créer la base de données avant le lancement du backend.

---

# Données de test (Topics et utilisateur)

Afin de pouvoir tester rapidement l’application, il est recommandé d’insérer des données initiales dans la base.

## Script SQL à exécuter

Exécuter le script suivant dans votre base de données :

```sql
-- Insertion des topics
INSERT INTO topics (name, description, created_at) VALUES
('JavaScript', 'Lorem Ipsum is simply dummy text of the printing industry.', NOW()),
('Java', 'Lorem Ipsum is simply dummy text of the printing industry.', NOW()),
('Python', 'Lorem Ipsum is simply dummy text of the printing industry.', NOW()),
('Web3', 'Lorem Ipsum is simply dummy text of the printing industry.', NOW());

-- Création d’un utilisateur de test
INSERT INTO users (email, username, password_hash, created_at)
VALUES (
  'test@mail.com',
  'test',
  '$2a$10$PTf15pik9mGmwazyBS/ulOvSGZfUxX8ycBQUM1mvcz5Sb8PnI3B86',
  NOW()
);
```

---

## Compte utilisateur de test

Email : test@mail.com  
Username : test  
Mot de passe : Password123!

Ce compte permet de tester immédiatement l’authentification JWT.

---

# Configuration de la sécurité JWT

Le backend utilise des variables d’environnement pour la configuration du JWT.

Variables nécessaires :

JWT_SECRET  
JWT_EXPIRATION_MS

### Exemple

JWT_SECRET=VotreCleSecreteTresLongueEtComplexe  
JWT_EXPIRATION_MS=86400000

86400000 correspond à 24 heures (en millisecondes).

---

# Configuration des variables d’environnement dans IntelliJ IDEA

1. Aller dans Run > Edit Configurations
2. Sélectionner la configuration Spring Boot
3. Ouvrir la section "Environment Variables"
4. Ajouter :

DB_HOST=localhost  
DB_PORT=3306  
DB_NAME=projet5  
DB_USER=projet5  
DB_PASSWORD=projet5_password  
JWT_SECRET=VotreCleSecreteTresLongueEtComplexe 
JWT_EXPIRATION_MS=86400000

5. Valider avec OK

Important : cocher "Include system environment variables".

---

# Démarrage du backend

Depuis la racine du projet ou le dossier back :

```bash
mvn spring-boot:run
```

Le backend est accessible à :

http://localhost:8080

---

# Démarrage du frontend

Depuis le dossier front :

```bash
ng serve
```

Frontend accessible à :

http://localhost:4200

---

# Configuration API côté frontend

Vérifier l’URL du backend dans :

```
front/src/environments/environment.ts
```

Exemple :

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api'
};
```

---

# Ressources

## Collection Postman

Collection disponible dans :

```
resources/Mdd.postman_collection.json
```

---

# Tests et couverture de code

---

# Frontend — Tests unitaires et d’intégration (Jest)

### Lancer les tests

```bash
npm run test
```

### Générer le rapport de couverture

```bash
npm run test:coverage
```

Rapport :

```
front/coverage/jest/lcov-report/index.html
```

---

# Frontend — Tests End-to-End (Cypress)

Prérequis :

- Backend démarré
- Frontend démarré

### Lancer les tests

```bash
npm run e2e
```

ou

```bash
npx cypress open
```

# Backend — Tests unitaires et d’intégration (JUnit / Mockito)

### Lancer les tests backend

```bash
mvn test
```

### Générer le rapport JaCoCo

```bash
mvn verify
```

Rapport disponible dans :

```
back/target/site/jacoco/index.html
```

Si le seuil minimum n’est pas atteint, la commande échoue automatiquement.

---

# Conformité aux exigences

Le projet respecte un minimum de 70 % de couverture pour les tests.

Les seuils sont configurés pour échouer automatiquement si le minimum requis n’est pas atteint.
