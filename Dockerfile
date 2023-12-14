FROM node:16
RUN mkdir -p /app/api
WORKDIR /app/api
COPY package*.json ./
RUN npm install			   
COPY . .

RUN npm run build
RUN ls -a

RUN chmod +x entrypoint.sh

EXPOSE 3000

CMD ["/bin/bash", "./entrypoint.sh"]