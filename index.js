require('dotenv').config();

const { default: axios } = require('axios');
const express = require('express');
const app = express();
const port = 3000;

const getToken = () => {
  const token = process.env.AUTH_TOKEN || null;

  if(!token) {
    throw new Error('Missing token');
  }
  return token;
}

const generateAuth = (username, token) => {
  return Buffer.from(`${username}:${token}`).toString('base64');
}

const AUTH_TOKEN = getToken();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/projects', async (request, response) => {
    try {
      const path = 'https://dev.azure.com/kmilo93sd/_apis/projects?api-version=6.0';
      const auth_token = generateAuth('kmilo93sd', AUTH_TOKEN);
      console.log('auth token:', auth_token)    
      const result = await axios.get(path,{ headers: { Authorization: `Basic ${auth_token}` } });
      console.log('PROJECTS', result.data);
      return response.json({ projects: result.data });
    } catch (error) {
      console.log("ERROR:", error.message);
      return response.status(500).json({ message: "Something was wrong on call api service" });      
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});