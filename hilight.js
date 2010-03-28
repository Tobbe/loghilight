function Highlighter() {}

Highlighter.prototype.highlight = function (logText, wordsToHighlight) {
	hitlist = this.findMatches(logText, wordsToHighlight);
	hitlist.sort(function(lhs, rhs) {
		if (lhs.index < rhs.index) {
			return -1;
		} else if (lhs.index > rhs.index) {
			return 1;
		}

		// lhs.index == rhs.index
		// </span> before <span ... >
		if (lhs.text[1] == '/' && rhs.text[1] != '/') {
			return -1;
		} else if (lhs.text[1] != '/' && rhs.text[1] == '/') {
			return 1;
		}

		return 0;
	});

	var output = "";

	var previousHit = new Hit(0, 0, '', '');
	hitlist.forEach(function(hit, index) {
		output += this.htmlEncode(logText.substring(previousHit.index, hit.index)) + hit.text;
		previousHit = hit;
	}.scope(this));

	var t = logText.substring(previousHit.index)
	output += this.htmlEncode(t);

	return output;
};

Highlighter.prototype.findMatches = function (logText, wordsToHighlight) {
	if (!logText || !wordsToHighlight) {
		return [];
	}

	var logLines = logText.split(/\r\n|\r|\n/);
	var hits = [];
	var newlineCharCount = 1; // At least one
	if (logText[logLines[0].length + 1] == '\n' || logText[logLines[0].length + 1] == '\r') {
		newlineCharCount = 2;
	}

	var wordsToHilight = wordsToHighlight.split(/\r\n|\r|\n/);
	wordsToHilight = wordsToHilight.filter(function(line) {
		return line != "";
	});

	var i = 0;
	var accumulatedLength = 0;
	while (i < logLines.length) {
		wordsToHilight.forEach(function(w, index) {
			var regex = new RegExp(w, "g");
			var matchArray = null;
			var line = "";

			while ((matchArray = regex.exec(logLines[i])) != null) {
				var foundAt = matchArray.index;
				var matchLen = matchArray[0].length;

				hits.push(new Hit(i, accumulatedLength + foundAt, matchArray[0], '<span class="hl' + index % 6 + '">'));
				hits.push(new Hit(i, accumulatedLength + foundAt + matchLen, matchArray[0], '</span>'));

				line = logLines[i].substring(0, foundAt);
			}
		});

		accumulatedLength += logLines[i].length + newlineCharCount;

		++i;
	}

	return hits;
};

Highlighter.prototype.htmlEncode = function(htmlString) {
	var encoded = "";
	for (var i = 0; i < htmlString.length; ++i) {
		encoded += this.htmlEncodeChar(htmlString[i]);
	}

	return encoded;
};

Highlighter.prototype.htmlEncodeChar = function(htmlChar) {
	switch (htmlChar) {
		case '<':
			return "&lt;";
		case '>':
			return "&gt;";
		case '&':
			return "&amp;";
	}

	return htmlChar;
};

function Hit(row, index, match, text) {
	this.row = row;
	this.index = index;
	this.match = match;
	this.text = text;
}

//TODO: I'll probably need something like this:
/*
var	regex = /^/gm,
	subject = "A\nB\nC",
	match,
	endPositions = [];

while (match = regex.exec(subject)) {
	var zeroLengthMatch = !match[0].length;
	// Fix IE's incorrect lastIndex
	if (zeroLengthMatch && regex.lastIndex > match.index)
		regex.lastIndex--;

	endPositions.push(regex.lastIndex);

	// Avoid an infinite loop with zero-length matches
	if (zeroLengthMatch)
		regex.lastIndex++;
}
*/