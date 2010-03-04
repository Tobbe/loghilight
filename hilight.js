function hilight(logText, wordsInclude, wordsHilight) {
	var logLines = logText.split(/\r\n|\r|\n/);
	var hashLines = logLines.slice();

	if (wordsInclude && wordsInclude != '') {
		var wordsToInclude = wordsInclude.split(/\r\n|\r|\n/);

		logLines.forEach(function(logline) {
			wordsToInclude.forEach(function(word) {
				logLines = logLines.filter(function(line) { return (new RegExp(word)).test(line); });
			});
		});
	}

	if (wordsHilight && wordsHilight != '') {
		var wordsToHilight = wordsHilight.split(/\r\n|\r|\n/);

		var i = 0;
		while (i < logLines.length) {
			wordsToHilight.forEach(function(w, index) {
				var regex = new RegExp(w, "g");
				var matchArray = null;
				var hashline = "";
				var line = "";
				var ending = "";

				while ((matchArray = regex.exec(logLines[i])) != null) {
					var foundAt = matchArray.index;
					var matchLen = matchArray[0].length;
					line = logLines[i].substring(0, foundAt);
					hashline = hashLines[i].substring(0, foundAt);
					var spanInsertion = '<span class="hl' + index % 6 + '">' + matchArray[0] + '</span>';
					var hashInsertion = '###############' + index % 6 + '##' + matchArray[0] + '#######';
					line += spanInsertion
					hashline += hashInsertion
					line += logLines[i].substring(foundAt + matchLen);
					hashline += hashLines[i].substring(foundAt + matchLen);
					logLines[i] = line;
					hashLines[i] = hashline;
					regex.lastIndex += spanInsertion.length - matchLen;
				}
			});

			++i;
		}
	}

	var i = 0;
	while (i < logLines.length) {
		var matchArray = null;
		var regex = /<|>|&/g;
		var entityLine = "";
		var hashline = "";

		while ((matchArray = regex.exec(hashLines[i])) != null) {
			var foundAt = matchArray.index;
			var matchLen = matchArray[0].length;
			entityLine = logLines[i].substring(0, foundAt);
			hashline = hashLines[i].substring(0, foundAt);
			var entity = htmlEncode(matchArray[0]);
			entityLine += entity
			hashline += entity
			entityLine += logLines[i].substring(foundAt + matchLen);
			hashline += hashLines[i].substring(foundAt + matchLen);
			logLines[i] = entityLine;
			hashLines[i] = hashline;
			regex.lastIndex += entity.length - matchLen;
		}

		++i;
	}

	logText = logLines.join('\n');
	return logText;
}

function htmlEncode(htmlChar) {
	switch (htmlChar) {
		case '<':
			return "&lt;";
		case '>':
			return "&gt;";
		case '&':
			return "&amp;";
	}

	return htmlChar;
}
