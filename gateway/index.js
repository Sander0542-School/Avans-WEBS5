const express = require('express');
const cors = require('cors');
const routes = require('routes');

const app = express();
const port = process.env.PORT || 80;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Gateway running on port ${port}`);
})
