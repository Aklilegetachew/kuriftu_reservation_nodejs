# Specify a base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the application code to the container
COPY package*.json ./

# Install dependencies
RUN npm install -f

# Copy the application code to the container
COPY . .

# Expose the port that the application is running on
EXPOSE 8000

# Run the application when the container starts
CMD ["npm", "run", "dev"]
