FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies with Yarn (my choice)
RUN yarn install
COPY . .

# Expose port 3000 (React dev server)
EXPOSE 3000

# Start the development server using Yarn
CMD ["yarn", "start"]