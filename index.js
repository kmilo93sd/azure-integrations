require('dotenv').config();

const { default: axios } = require('axios');
const express = require('express');
const app = express();
const port = 3000;

const generateToken = (username, token) => {
  return Buffer.from(`${username}:${token}`).toString('base64');
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/projects', async (request, response) => {
    try {
      
      const { token } = request.headers;
      if(!token) {
        return response.status(400).json({ message: 'Missing token' });
      }
      const { organization, username } = request.query;
      if(!organization) {
        return response.status(400).json({ message: 'Missing organization' });
      }
      if(!username) {
        return response.status(400).json({ message: 'Missing username' });
      }
      
      const path = `https://dev.azure.com/${organization}/_apis/projects?api-version=6.0`;
      const authToken = generateToken(username, token);  
      const result = await axios.get(path,{ headers: { Authorization: `Basic ${authToken}` } });
      return response.json({ projects: result.data });
    } catch (error) {
      console.log("ERROR:", error.message);
      if(error.response && error.response.status === 401) {
        return response.status(401).json({ message: "Provided token is invalid" }); 
      }
      return response.status(500).json({ message: "Something was wrong on call api service" });      
    }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});