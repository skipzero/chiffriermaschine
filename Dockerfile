# Start your image with a node base image
FROM node:23

# The /app directory should act as the main application directory
WORKDIR /app

# Copy the app package and package-lock.json file
COPY package*.json ./

# Copy local directories to the current local directory of our docker image (/app)
COPY ./src ./src
COPY ./dist ./dist
COPY ./index.html ./index.html

# Install node packages, install serve, build the app, and remove dependencies at the end
RUN npm install \
    && npm install -g serve \
    && ls -al \
    && npm run build \
    && rm -fr node_modules

EXPOSE 7153

# Start the app using serve command
CMD [ "serve", "-s", "-p", "7153", "dist" ]