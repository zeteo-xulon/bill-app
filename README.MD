# INSTALL BACKEND

## How to run the API locally :


### Clone the projet:
```
git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

### Go to the project directory :
```
cd Billed-app-FR-Back
```

### Install project dependancies :

```
npm install
```

### Run the API :

```
npm run:dev
```

### Access to the PAI :

The API is locally available on port `5678`, go to `http://localhost:5678`

### administrateur : 
```
utilisateur : admin@company.tld 
mot de passe : admin
```
### employé :
```
utilisateur : employee@company.tld
mot de passe : employee
```

# INSTALL FRONTEND

## Project Architecture:
This project, known as the frontend, is connected to a backend API service that you should also launch locally.

The backend project can be found here: https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-back

## Organizing Your Workspace:
For proper organization, you can create a folder named "bill-app" in which you will clone the backend project, and subsequently, the frontend project:

Clone the backend project into the "bill-app" folder:


```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Back.git
```

```
bill-app/
   - Billed-app-FR-Back
```

Clone the frontend project into the "bill-app" directory:
```
$ git clone https://github.com/OpenClassrooms-Student-Center/Billed-app-FR-Front.git
```

```
bill-app/
   - Billed-app-FR-Back
   - Billed-app-FR-Front
```

## How to Run the Application Locally?

### Step 1 - Launch the Backend:

Follow the instructions in the backend project's README.

### Step 2 - Launch the Frontend:

Go to the cloned repository:
```
$ cd Billed-app-FR-Front
```

Install the npm packages (described in `package.json`):
```
$ npm install
```

Install live-server to launch a local server:
```
$ npm install -g live-server
```

Launch app :
```
$ live-server
```

Then go to this address : `http://127.0.0.1:8080/`


## How to launch all the Jest test ?

```
$ npm run test
```

## How to launch a single Jest test ?

Installez jest-cli :

```
$npm i -g jest-cli
$jest src/__tests__/your_test_file.js
```

## How to see coverage ?

`http://127.0.0.1:8080/coverage/lcov-report/`

## Accounts and users :

You can connect using this accounts:

### administrator : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### employee :
```
utilisateur : employee@test.tld
mot de passe : employee
```

