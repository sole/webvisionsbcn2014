(function() {

    var deck;

    function init(options) {

        var useMouse = options.useMouse !== undefined ? options.useMouse : true;

        deck = document.querySelector('x-deck');
        readURL();

        deck.addEventListener('shufflestart', function(ev) {
            var index = deck.getCardIndex(deck.getSelectedCard());
            saveURL(index);
        }, false);

        // Add contextual menu. HTML5 is the <3
        var menu = document.createElement('menu');
        var item = document.createElement('menuitem');
        menu.setAttribute('id', 'fsmenu');
        menu.setAttribute('type', 'context');
        item.setAttribute('label', 'Fullscreen');
        item.addEventListener('click', toggleFullScreen);
        menu.appendChild(item);
        document.body.appendChild(menu);
        document.body.setAttribute('contextmenu', 'fsmenu');


        // Mini hack for css backgrounds
        var covered = document.querySelectorAll('x-card[class=cover]');
        for(var i = 0; i < covered.length; i++) {
            var card = covered[i];
            card.style.backgroundImage = 'url(' + card.getAttribute('data-background') + ')';
        }


        window.addEventListener('keyup', function(ev) {

            var keyCode = ev.keyCode;

            // Left arrow
            if(keyCode === 37 || keyCode === 33) {
                deck.shufflePrev();
            // Right arrow
            } else if(keyCode === 39 || keyCode === 34) {
                deck.shuffleNext();
            // F key
            } else if(keyCode === 70) {
                toggleFullScreen();
            }
            
        }, false);


        if(useMouse) {
            window.addEventListener('click', function(ev) {

                // Ignore if it's not left click
                if(ev.button !== 0) {
                    return;
                }

                var x = ev.clientX;
                var width = window.innerWidth;

                if(x > width / 2) {
                    deck.shuffleNext();
                } else {
                    deck.shufflePrev();
                }

            }, false);
        }

    }


    function saveURL(index) {
        window.location.hash = index;
    }


    function readURL() {
        if(window.location.hash) {
            var hash = window.location.hash;
            hash = hash.replace('#', '');
            var index = parseInt(hash, 10);
            deck.shuffleTo(index);
        }
    }


    function toggleFullScreen() {

        var requestFS = document.body.requestFullScreen || 
            document.body.mozRequestFullScreen ||
            document.body.webkitRequestFullScreen;

        var cancelFS = document.body.cancelFullScreen ||
            document.mozCancelFullScreen ||
            document.webkitCancelFullScreen;

        var fs = window.fullScreen ||
            document.fullscreenElement ||
            document.mozFullScreenElement || 
            document.webkitFullscreenElement;

        if(fs) {
            cancelFS.call(document);
        } else {
            requestFS.call(document.body, Element.ALLOW_KEYBOARD_INPUT);
        }

    }

    var Brickpresso = {
        init: init
    };


	// Make it compatible for require.js/AMD loader(s)
	if(typeof define === 'function' && define.amd) {
		define(function() { return Brickpresso; });
	} else if(typeof module !== 'undefined' && module.exports) {
		// And for npm/node.js
		module.exports = Brickpresso;
	} else {
		this.Brickpresso = Brickpresso;
	}

}).call(this);
