function hilight(logText, wordsInclude, wordsHilight) {
	logText = $('<p/>').text(logText).html();
	var logLines = logText.split(/\r\n|\r|\n/g);

	if (wordsInclude && wordsInclude != '') {
		var wordsToInclude = wordsInclude.split(/\r\n|\r|\n/g);

		var i = 0;
		while (i < logLines.length) {
			wordsToInclude.forEach(function(w) {
				if (logLines[i].search(w) == -1) {
					logLines[i] = '';
				}
			});

			++i;
		}
		
		logLines = logLines.filter(function(x) { return x != ''; });
	}

	if (wordsHilight && wordsHilight != '') {
		var wordsToHilight = wordsHilight.split(/\r\n|\r|\n/g);

		var i = 0;
		while (i < logLines.length) {
			wordsToHilight.forEach(function(w, index) {
				var regex = new RegExp(w, "g");
				var matchArray = null;
				var line = "";
				var ending = "";

				while ((matchArray = regex.exec(logLines[i])) != null) {
					var foundAt = matchArray.index;
					var matchLen = matchArray[0].length;
					line = logLines[i].substring(0, foundAt);
					var spanInsertion = '<span class="hl' + index % 6 + '">' + matchArray[0] + '</span>';
					line += spanInsertion
					line += logLines[i].substring(foundAt + matchLen);
					logLines[i] = line;
					regex.lastIndex += spanInsertion.length - matchLen;
				}
			});

			++i;
		}
	}

	return logLines.join('\n');
}