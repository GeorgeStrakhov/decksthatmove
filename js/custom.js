$(document).ready(function() {

	/* 
	* initialize
	*/

	//reveal
	Reveal.initialize({
		controls: true,
		progress: true,
		history: true,
		center: true,
		rollingLinks: false,

		// Optional libraries used to extend on reveal.js
		dependencies: [
			{ src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
			{ src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			{ src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
			{ src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
			{ src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
			{ src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }

			// { src: 'plugin/search/search.js', async: true, condition: function() { return !!document.body.classList; } }
			// { src: 'plugin/remotes/remotes.js', async: true, condition: function() { return !!document.body.classList; } }
		]
	});

	//drama chart
	$.dramaOn = false;
	$.dramaData = [[29, 91], [30, 95]]
	$.dramaPlot = $.plot($("#dramaChart"),
		[ { data: $.dramaData} ], {
			series: {
				lines: { show: true,
					lineWidth: 1,
					fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
				},
				points: { show: true, 
					lineWidth: 1 
				},
				shadowSize: 0
			},
			grid: { hoverable: false, 
				clickable: false, 
				tickColor: "#fff",
				borderWidth: 0
			},
			xaxis : {show: false},
			yaxis : {min: 0, max: 150},
			colors: ["#fff"]
		});
	$.dramaPlot2 = $.plot($("#dramaChart2"),
		[ { data: $.dramaData} ], {
			series: {
				lines: { show: true,
					lineWidth: 1,
					fill: true, fillColor: { colors: [ { opacity: 0.5 }, { opacity: 0.2 } ] }
				},
				points: { show: true, 
					lineWidth: 1 
				},
				shadowSize: 0
			},
			grid: { hoverable: false, 
				clickable: false, 
				tickColor: "#fff",
				borderWidth: 0
			},
			xaxis : {show: false},
			yaxis : {min: 90},
			colors: ["#fff"]
		});

	/*
	* slide state changes
	*/
	$.processBackground = function(slide, bgDivObj) {
		if(slide.hasClass('fullBG')) { //if this is a slide with a full background
			bgImg = slide.attr('bg-image');
			bgDivObj.css({
				opacity : 0
			});
			bgDivObj.css({
				'background': 'url('+bgImg+') no-repeat center center fixed',
				'background-size': 'cover'
			});
			bgDivObj.transition({
				opacity: 1
			},1000);
		} else { //this is not a slide with a full background
			bgDivObj.transition({
				opacity: 0
			},1000, function() {
				bgDivObj.css({
					'background' : 'rgba(0,0,0,0)'
				});
			});
		}
	};

	Reveal.addEventListener('slidechanged', function(e) {
		slide = $(e.currentSlide);
		/* applying full background picture */
		bgDivObj = $(this).find('.state-background').first();
		$.processBackground(slide, bgDivObj);
	}, false);

	//the initial load - if the slide from the url is with full BG
	loadedSlide = $(Reveal.getCurrentSlide());
	loadedBgDivObj = $('.state-background').first();
	$.processBackground(loadedSlide, loadedBgDivObj);

	/*
	* Custom slide animations and interactions
	*/

	Reveal.addEventListener( 'fragmentshown', function(e) { //we are using empty hidden divs as fragments to trigger custom events and animations on slides that should happen in the flow. Kind of hacky but easy and works.
		e.preventDefault();
		frObj =  $(e.fragment);

		/* all slides with full BG - move to next */
		if(frObj.hasClass('toNext')) {
			slide = $(Reveal.getCurrentSlide());
			bgDivObj = $(this).find('.state-background').first();
			bgDivObj.animate({
				opacity: 0
			},500, function() {
				bgDivObj.css({
					'background' : 'rgba(0,0,0,0)'
				});
				Reveal.next();
			});
		}

		/* Slide #3: focus on 'move' */
		if(frObj.hasClass('moveFocus')) {
			moveWordObj =  frObj.prev().find('.moveWord').first();
			$.each(frObj.prev().children(), function() {
				if(!$(this).hasClass('moveWord')) {
					$(this).transition({
						opacity: 0
					},900, function() {
						$.each(frObj.prev().children(), function() {
							if(!$(this).hasClass('moveWord')) { //all other spans
								$(this).hide('slow');
							}
						});
						moveWordObj.transition({
							'font-size' : '440%'
						},1000);
					});
				}
			});
		}

	});

	/*
	* custom events for hidden fragments 
	*/
	Reveal.addEventListener('fragmenthidden', function(e) { 
		e.preventDefault();
		frObj =  $(e.fragment);

		/* slides with full bg that use fragment to hide bg gracefully */
		if(frObj.hasClass('toNext')) {
			Reveal.prev();
		}
	});


});