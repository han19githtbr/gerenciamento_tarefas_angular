# Projeto

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## Para builds de produção:

ng build --configuration production

ou: npx ng build --configuration production

ou: npx ng build --configuration=production --optimization=false

## Deploy to vercel

npm install -g vercel

ou npm i -g vercel


# Criar arquivo vercel.json na raiz

{
  "buildCommand": "npm run build",
  "outputDirectory": "dist/gerenciamento-tarefas-angular",
  "devCommand": "ng serve",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}


vercel login

vercel

vercel --prod --force


# Para sempre abrir o terminal como Administrador:


Ctrl + Shift + P


"terminal.integrated.profiles.windows": {
  "PowerShell": {
    "source": "PowerShell",
    "icon": "terminal-powershell",
    "args": ["-NoExit"]
  }
},
"terminal.integrated.defaultProfile.windows": "PowerShell"


# Isso vai mostrar a pasta onde o nvm instalou as versões do Node

nvm root


# rode

notepad ~/.bashrc


# No bloco de notas que abrir, adicione esta linha no final:

export PATH="$PATH:/c/Users/w540 1/AppData/Local/nvm/v16.20.2"


# Salve o arquivo, volte ao Git Bash e rode:

source ~/.bashrc
node --version



# Para o seguinte erro:

ng serve
Node.js version v16.20.2 detected.
The Angular CLI requires a minimum Node.js version of v18.19.

Please update your Node.js version or visit https://nodejs.org/ for additional instructions.


# Usar a alternativa


Ah, temos um conflito! O Angular CLI global que está instalado é o v16, e ele exige no mínimo Node 18. Mas o projeto usa Angular 13, que precisa do Node 16.
O problema é que o ng que está sendo chamado é o CLI global (v16) e não o do projeto (v13).
A solução é chamar o ng direto do projeto, sem usar o global:

npx ng serve
