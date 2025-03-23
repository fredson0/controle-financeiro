# Usa a imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e package-lock.json antes de instalar as dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação para dentro do container
COPY . .

# Expõe a porta usada pelo servidor (ajuste se necessário)
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
