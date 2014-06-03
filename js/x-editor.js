(function() {
	// template with the textarea
	// src attribute, xmlhttprequest
	var proto = {
		createdCallback: function() {
			console.log('oh hey');
			this.innerHTML = 'wiii';
			var codeSrc = this.attributes.src.value;
			// this.onCodeLoaded('aaaa');
			if(codeSrc === undefined) {
				this.onCodeLoaded('// No src specified');
			} else {
				this.loadCode(codeSrc);
			}
		},
		loadCode: function(url) {
			var request = new XMLHttpRequest();
			var that = this;
			console.log('x-editor: loading script', url);
			request.open('get', url, true);
			request.responseType = 'text';
			request.onload = function() {
				that.onCodeLoaded(request.response);
			};
			request.onerror = function() {
				that.onCodeLoaded('// ERROR loading ' + url);
			};
			request.send();
		},
		onCodeLoaded: function(code) {
			this.innerHTML = '<textarea>' + code + '</textarea>';
		}
	};

	document.registerElement('x-editor', {
		prototype: proto
	});

})();
