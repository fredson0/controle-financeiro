# Usa a imagem oficial do Node.js como base
FROM node:18

# Instala o netcat para o script de espera e limpa o cache do apt-get
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia apenas os arquivos package.json e package-lock.json para instalar as dependências
COPY package*.json ./

# Instala as dependências no ambiente Linux do container
RUN npm install

# Copia o restante do código da aplicação para dentro do container
COPY . .

# Copia o script de espera para o container
COPY wait-for-db.sh /wait-for-db.sh
RUN chmod +x /wait-for-db.sh

# Expõe a porta usada pelo servidor
EXPOSE 3001

# Comando para iniciar a aplicação com o script de espera
CMD ["/wait-for-db.sh", "npm", "start"]