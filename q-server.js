var quotesPerPage = 20

// packages
var querystring = require('querystring')
var nedb = require('nedb')
var db = new nedb({filename: "q.db", autoload: true})

var express = require('express')
var app = express()

var bodyParser = require('body-parser')

// body
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'jade')
app.set('x-powered-by', false)
app.use('/static', express.static('static'))

var helptext_api = {
    _links: {
	"quotes" : {
	    "href": "/api/quotes",

	    "add": {
		"method": "POST",
		"href": "/api/quotes/",
		"schema": {
		    "authors": "[]",
		    "date": "YYYY-MM-DD",
		    "text": "string",
		},
	    },
	    "query": {
		"method": "GET",
		"href": "/api/quotes?date=YYYY-MM-DD&author=AUTHORID",
	    },
	}
    }
}

app.get('/', function (req, res) {
    var query = { }
    var title = 'Quotes'
    var skip = 0
    var limit = quotesPerPage
    var nextIndex
    var prevIndex
    var keyQuery

    console.log(Date() + ' GET / (' + querystring.stringify(req.query) + ') request from ' + req.ip)

    if (req.query.id) {
	query._id = req.query.id
        keyQuery = querystring.stringify({'id': req.query.id})
    }

    if (req.query.author) {
	query.authors = req.query.author
	title += ' for ' + req.query.author
	if (!keyQuery)
	    keyQuery = querystring.stringify({'author': req.query.author})
    }

    if (req.query.date) {
	query.date = req.query.date
	title += ' on ' + req.query.date
	if (!keyQuery)
	    keyQuery = querystring.stringify({'date': req.query.date})
    }

    if (keyQuery)
	keyQuery = '?' + keyQuery
    else
	keyQuery = '?'

    skip = +req.query.index
    if (isNaN(skip))
	skip = 0
    prevIndex = skip - limit > 0 ? skip - limit : 0
    nextIndex = skip + limit

    db.find(query).sort({'timestampAdded': -1}).skip(skip).limit(limit).exec(function (err, doc) {
	res.render('query', {doc: doc, title: title, nextIndex: nextIndex, prevIndex: prevIndex, keyQuery: keyQuery })
    })
})

app.get('/api', function (req, res) {
    console.log(Date() + ' GET /api request from ' + req.ip)
    res.send(helptext_api)
})

app.get('/api/quotes', function (req, res) {
    var query = { }

    console.log(Date() + ' GET /api/quotes request from ' + req.ip)

    if (req.query.id) {
	query._id = req.query.id
    }
    if (req.query.date) {
	query.date = req.query.date
    }
    if (req.query.author) {
	query.authors = req.query.author
    }
    db.find(query, function(err, doc) {
	if (doc) {
	    res.json(doc)
	}
    })
})

app.post('/api/quotes', function (req, res, next) {

    var docs = []

    console.log(Date() + ' POST /api/quotes request from ' + req.ip)

    for (var i = 0; i < req.body.length; i++) {
	var o = req.body[i]

	if (o.authors && o.text && o.date) {
	    var d = Date.now()
	    docs.push({	authors: o.authors,
			text: o.text,
			date: o.date,
			timestampAdded: d})
	} else {
	    res.status(400).send('Bad request')
	    console.log(Date() + ' POST /api/quotes FAILED for IP ' + req.ip + ', body: ' + JSON.stringify(req.body))
	    return
	}
    }
    console.log(Date() + ' POST /api/quotes OK for IP ' + req.ip + ', body: ' + JSON.stringify(req.body))
    db.insert(docs, function(err, doc) { })
    res.json(docs)
})

app.listen(8001)
