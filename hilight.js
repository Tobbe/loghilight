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
				var foundAt = logLines[i].search(w);
				if (foundAt != -1) {
					var line = logLines[i].substring(0, foundAt);
					line += '<span class="hl' + index % 6 + '">' + w + '</span>';
					line += logLines[i].substring(foundAt + w.length);
					logLines[i] = line;
				}
			});
			
			++i;
		}
	}
	
	return logLines.join('\n');
}