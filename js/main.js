window.onload = function() {
	console.log('load');
	var ta = document.querySelector('textarea');
	var codeValue = trimInitialTabs(ta.value).trimRight();
	var cm = CodeMirror(function(el) {
			ta.parentNode.replaceChild(el, ta);
		}, {
			value: codeValue,
			lineWrapping: true,
			lineNumbers: true,
			styleActiveLine: true,
			matchBrackets: true,
			showTrailingSpace: true,
		}
	);


	document.addEventListener('keydown', function(e) {
		if(e.metaKey && e.key === 'e') {
			var code = cm.getSelection().trim();
			
			// Ah, but nothing's selected, so we'll find where the cursor is
			// and execute that line only
			if(code.length === 0) {
				var cursor = cm.getCursor();
				code = cm.getLine(cursor.line);
			}

			runCode(code);
			e.preventDefault();
		}
	});

	// MAGIC!
	function trimInitialTabs(str) {
		var tabsRe = /(\t*)/;
		var tabsMatches = tabsRe.exec(str);
		var numInitialTabs = 0;
		if(tabsMatches && tabsMatches[1]) {
			numInitialTabs = tabsMatches[1].length;
		}
		var replacementRe = new RegExp('^\t{' + numInitialTabs + '}');
		var lines = str.split('\n').map(function(line) {
			return line.replace(replacementRe, '');
		});
		return lines.join('\n');
	}

	var runCode = (function makeEval() {
		var cheatyEval = eval;
		return function (str) {
			cheatyEval(str);
		};
	})();

};

