1- Criar uma pasta para este projeto, e no node.js command prompt navegar para dentro desta nova pasta criada

2- Criar um novo projeto: (command prompt) npm init, e no entry point escrever: app.js

3- Instalar os packages necessarios: npm install express ejs body-parser mongodb mongoose request request-promise winston --save

4- Colocar os ficheiros do git (pastas views, public e ficheiro app.js) dentro da pasta criada

5- No node.js command prompt escrever: node app.js


Obs: Depois de fazer estes passos, o projeto irá criar automaticamente uma pasta chamada "logs" com o ficheiro "citysLogFile.log", onde para 
cada call feita à API do openweathermap (sempre que fôr adicionada uma cidade),  irá criar o registo com o url do request feito.
