# Usa a imagem oficial do Node.js para construir o projeto
FROM node:18 AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código do projeto para dentro do container
COPY . .

# Constrói o projeto React
RUN npm run build

# Usa a imagem oficial do Nginx para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos estáticos do build para o diretório padrão do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expõe a porta 80 para o servidor Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]