// Define search engine endpoints and their keywords
const engines = {
    "default": "g",
    "g": {
        "url": "https://google.com/search?q={query}",
        "name": "Google"
    },
    "i": {
        "url": "https://www.google.com/search?q={query}&tbm=isch",
        "name": "Google Images"
    },
    "imdb": {
        "url": "https://www.imdb.com/find?q={query}",
        "name": "IMDb"
    },
    "a": {
        "url": "https://www.amazon.com/s?k={query}",
        "name": "Amazon"
    }
}

const stripProtocol = function(u) {
    return u.replace(/(^\w+:|^)\/\//, '')
}

const hasProtocol = function(u) {
    protocolRegex = new RegExp(/^(\w+:|^)\/\//)
    if (u.match(protocolRegex)) {
        return true
    }
    return false
}

const isUrl = function(q) {
    // return true if q is a valid URL
    urlRegex = new RegExp(/^[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/)
    if (stripProtocol(q).match(urlRegex)) {
        return true
    }
    return false
}

const buildUrl = function(e, q) {
    if (e === "url") {
        if (hasProtocol(q)) {
            return q
        }
        return "http://" + q
    }

    // build URL for passed engine if configured
    return engines[e]['url'].replace('{query}', encodeURI(q))
}

const setEngine = function(e) {
    document.getElementById('omni-engine').innerHTML = engines[e]['name']
    document.getElementById('omni-engine-key').innerHTML = e
}

const removeEngine = function() {
    document.getElementById('omni-engine').innerHTML = ""
    document.getElementById('omni-engine-key').innerHTML = ""
}

const detectEngine = function(event) {
    // grab value of text box to strip engine out of
    query = document.getElementById('omni-search').value
    // Grab first word from search query and return if there isn't a match
    match = query.match(/(^\w+\s)/)

    engine = match ? match[1].trim() : false

    if (engine in engines) {
        setEngine(engine)
    } else {
        removeEngine()
    }
}

const doQuery = function() {
    let url = ""
    let query = document.getElementById('omni-search').value
    let engine = document.getElementById('omni-engine-key').innerHTML

    // if query is a valud url just go
    if (isUrl(query)) {
        engine = "url"
    }

    if (engine !== "") { // if an engine was already selected generate URL and go
        url = new URL(buildUrl(engine, query.replace(engine + " ", "")))
    } else { // no engine and not a url, use default engine
        url = new URL(buildUrl(engines["default"], query))
    }

    window.location.href = url.toString()
}
