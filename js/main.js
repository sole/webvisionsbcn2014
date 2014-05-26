window.onload = function() {
	console.log('load');
	var ta = document.querySelector('textarea');
	var codeValue = trimInitialTabs(ta.value);
	var cm = CodeMirror(function(el) {
			ta.parentNode.replaceChild(el, ta);
		}, {
			value: codeValue
		}
	);

	document.addEventListener('keydown', function(e) {
		if(e.metaKey && e.key === 'e') {
			console.log('eval now');
			runCode(cm.getSelection());
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

	function runCode(str) {
		console.log('should run', str);
		eval(str);
	}
};

