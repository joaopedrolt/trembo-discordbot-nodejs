<h2 align="center">Trembo Discord Bot</h2>

## Índice

* [Descrição](#descrição)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Funcionalidades](#funcionalidades)
* [Como Executar o Projeto](#como-executar-o-projeto)
   * [Instalação Local](#instalação-local)
* [Autoria](#autoria)
* [Imagens do Projeto](#imagens-do-projeto)

## Descrição

Bot de música para Discord com suporte a músicas do YouTube.

## Linguagens

* NodeJS v18

## Dependências

* DiscordJS v14
* Discord-Player
* FFmpeg

## Funcionalidades

* Bot de música para Discord com suporte a músicas do YouTube.

## Como Executar o Projeto

<h4><a href="https://joaopedrolt.github.io/whatsapp-clone-reactjs/">Você pode acessar esse projeto clicando aqui</a></h3>
> Possibilidade de haver indisponibilidade por conta do host

#### Instalação Local

1. Clonar ou fazer download do projeto.
2. Instale as dependências do projeto
```bash
npm install
```
3. Crie um projeto no Firebase Console e habilite o Firebase Authentication, Firebase Database, Firebase Store.
4. Crie um App no Facebook Apps, habilite o produto Facebook Login e o configure como o Firebase Auth.
5. Copie as credenciais do Firebase e crie um arquivo chamado FirebaseConfig.js na pasta ./src seguindo os padrões do arquivo firebaseConfig.copy.js como exemplo. Adicione as seguintes credenciais no arquivo FirebaseConfig.js:
```bash
export default {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
};
```
6. Inicie o projeto em modo desenvolvimento:
```bash
    npm run dev
```
## Autoria

Este projeto foi criado por mim, João Pedro Lima Teixeira, como uma iniciativa pessoal para desenvolver minhas habilidades, qualquer utilização desse software deve obrigatoriamente conter créditos.

## Imagens do Projeto

<div><img src="http://drive.google.com/uc?export=view&id=1w2RoarqaIuvTxtcBMmb_h4l8ecGlGHYD" width=600 alt="Login" /></div>
<div><img src="http://drive.google.com/uc?export=view&id=13E-3pi79DVQLAAqtjKFJcgGYTH0hLd0_" width=600 alt="Main" /></div>
<div><img src="http://drive.google.com/uc?export=view&id=1MTCX2HeLGcimkePnfVa_DIJ3qflKTlo_" width=600 alt="Chat" /></div>
