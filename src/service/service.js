const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const script = require('./dcSeriesSequenceProvider');

app.use(cors());

app.get('/', async function(req, res) {
    console.time('Processing Time');
    let ans = await script.getEpisodesInChronologicalOrder();
    console.log('Received a request at ' + new Date());
    console.timeEnd('Processing Time');
    res.send(ans);
});

app.listen(port, () => console.log(`Server started on port ${port}!`));