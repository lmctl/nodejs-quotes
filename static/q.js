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

    ed = document.getElementById('ndate')
    eq = document.getElementById('nquote')
    ea = document.getElementById('nauthors')

    q.date = ed.value
    q.quote = eq.value

    var a = ea.value
    q.authors = a.split(/\s*,\s*/)

    if (q.quote == null || q.quote == "") {
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



}
