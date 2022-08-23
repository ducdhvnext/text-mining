const express = require('express')
const app = express();
const natural = require('natural');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.get('/', (req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    res.write("<html><head><meta charset='UTF-8'></head><body style='text-align:center'>");
    res.write("<h1>Vnext Wordcloud</h1>");
    res.write("<form method='POST' action='/text-mining'>");
    res.write("<div style='margin-bottom:20px'><textarea style='font-size: 16px' name='text' rows='10' cols='60'></textarea></div>");
    res.write("<button type='submit'>Submit</button>");
    res.write("</form></body></html>");
    res.end();
})
app.post('/text-mining', async function (req, res) {
    var text = req.body.text;
    console.log(text);
    var tokenizer = new natural.TokenizerJa();
    let data = tokenizer.tokenize(text);
    let result = {};
    let sub = 'はをにがの';
    data.forEach((d) => {
        if (!sub.includes(d)) {
            if (result[d] != null) {
                result[d] = result[d] + 1;
            } else {
                result[d] = 1;
            }
        } 
    })
    let format = []
    for (const property in result) {
        format.push({
            word: property,
            count: result[property]
        })
    }
    format.sort((a, b)=> {
        return b.count - a.count;
    })
    res.writeHead(200, {
        "Content-Type": "text/html",
    });
    res.write("<html><head><meta charset='UTF-8'></head><body style='text-align:center'>");
    res.write("<h1><a href=''>Vnext Wordcloud</a></h1>");
    res.write("<table style='border-top: 1px solid; border-left: 1px solid'>");
    res.write("<tr>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>#</td>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>Word</td>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>Count</td>");
    res.write("</tr>");
    format.forEach((d, index) => {
        res.write("<tr>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>" + index + "</td>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>" + d.word  + "</td>");
    res.write("<td style='padding: 10px;border-right: 1px solid; border-bottom: 1px solid'>" + d.count  + "</td>");
    res.write("</tr>");
    })
    res.write("</table></body></html>");
    res.end();
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})