function filterLines(logText, wordsInclude) {
	var logLines = logText.split(/\r\n|\r|\n/);

	if (wordsInclude && wordsInclude != '') {
		var wordsToInclude = wordsInclude.split(/\r\n|\r|\n/);

		logLines.forEach(function(logline) {
			wordsToInclude.forEach(function(word) {
				logLines = logLines.filter(function(line) { return (new RegExp(word)).test(line); });
			});
		});
	}
	
	return logLines.join('\n');
}