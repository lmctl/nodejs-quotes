window.onload = pageload

function pageload()
{
    var d = new Date()
    var e = document.getElementById('ndate')
    if (e)
	e.value = d.getFullYear() + '-' + (1 + d.getMonth()) + '-' + d.getDate()
}

function hideNew()
{
    document.getElementById('newquote').style.display = "none"
    var e = document.getElementById('plus')
    e.innerHTML = "+"
    e.onclick = showNew
}

function showNew()
{
    document.getElementById('newquote').style.display = "inline"
    var e = document.getElementById('plus')
    e.innerHTML = "-"
    e.onclick = hideNew
}

function addquote()
{
    var q = {}
    var isErr = false

    var ed = document.getElementById('ndate')
    var eq = document.getElementById('nquote')
    var ea = document.getElementById('nauthors')

    q.date = ed.value
    q.text = eq.value

    var a = ea.value
    q.authors = a.split(/\s*,\s*/)

    if (q.text == null || q.text == "") {
	eq.className = "error"
	isErr = true
    } else
	eq.className = ""

    if (q.date == null || q.date == "") {
	ed.className = "error"
	isErr = true
    } else
	ed.className = ""

    if (a == null || a == "" ) {
	ea.className = "error"
	isErr = true
    } else
	ea.className = ""

    if (isErr)
	return

    var x = new XMLHttpRequest()
    x.open('POST', '/api/quotes')
    x.onreadystatechange = function () {
	if (x.readyState != XMLHttpRequest.DONE)
	    return
	if (x.status != 200)
	    document.getElementById('errorMark').style.display = "inline"
	else {
	    document.getElementById('errorMark').style.display = "none"
	    location.reload()
	}
    }
    x.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    x.send(JSON.stringify([ q ]))
}
