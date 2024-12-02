const express = require('express'); 
const app = express();
const authRoutes = require('./routes/auth.routes')
app.use(authRoutes)

app.listen(3000);
