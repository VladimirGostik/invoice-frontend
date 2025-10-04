# Používame základný Node.js image (verzia 20 je aktuálna a stabilná)
FROM node:20-alpine

# Nastavíme pracovný adresár v kontajneri
WORKDIR /app

# Skopírujeme súbory pre inštaláciu závislostí
COPY package*.json ./

# Inštalácia závislostí (npm install)
RUN npm install

# Skopírujeme zvyšok aplikácie
COPY . .

# Sprístupníme port, na ktorom beží Vite (zvyčajne 5173)
EXPOSE 5173

# Príkaz pre spustenie vývojového servera
# '--host' je kritické, aby bol server prístupný zvonku kontajnera
CMD ["npm", "run", "dev", "--", "--host"]