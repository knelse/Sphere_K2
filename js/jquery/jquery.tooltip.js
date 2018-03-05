/*
 * jQuery Tooltip plugin 1.2
 *
 * http://bassistance.de/jquery-plugins/jquery-plugin-tooltip/
 * http://docs.jquery.com/Plugins/Tooltip
 *
 * Copyright (c) 2006 - 2008 Jörn Zaefferer
 *
 * $Id: jquery.tooltip.js 4569 2008-01-31 19:36:35Z joern.zaefferer $
 * 
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
 
;(function($) {
	
		// the tooltip element
	var helper = {},
		// the current tooltipped element
		current,
		// the cell used for tooltip last time
		prevCell, 
		// the title of the current element, used for restoring		
		title,
		// timeout id for delayed tooltips
		tID,
		// IE 5.5 or 6
		IE = $.browser.msie && /MSIE\s(5\.5|6\.)/.test(navigator.userAgent),
		// flag for mouse tracking
		track = false;
	
	$.tooltip = {
		blocked: false,
		defaults: {
			delay: 150,
			extraClass: "",
			top: 15,
			left: 15,
			id: "tooltip",
			targetSelector: ""
		},
		block: function() {
			$.tooltip.blocked = !$.tooltip.blocked;
		}
	};
	
	$.fn.extend({
		tooltip: function(settings) {
			settings = $.extend({}, $.tooltip.defaults, settings);
			createHelper(settings);
			return this.each(function() {
					$.data(this, "tooltip-settings", settings);
					// copy tooltip into its own expando and remove the title
					this.tooltipText = this.title;
					$(this).removeAttr("title");
					// also remove alt attribute to prevent default tooltip in IE
					this.alt = "";
				})
				.mousemove( mo_move )
//				.hover(save, hide)
				.mouseout( hide )
				.click(hide);
		},
		fixPNG: IE ? function() {
			return this.each(function () {
				var image = $(this).css('backgroundImage');
				if (image.match(/^url\(["']?(.*\.png)["']?\)$/i)) {
					image = RegExp.$1;
					$(this).css({
						'backgroundImage': 'none',
						'filter': "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true, sizingMethod=crop, src='" + image + "')"
					}).each(function () {
						var position = $(this).css('position');
						if (position != 'absolute' && position != 'relative')
							$(this).css('position', 'relative');
					});
				}
			});
		} : function() { return this; },
		unfixPNG: IE ? function() {
			return this.each(function () {
				$(this).css({'filter': '', backgroundImage: ''});
			});
		} : function() { return this; },
		hideWhenEmpty: function() {
			return this.each(function() {
				$(this)[ $(this).html() ? "show" : "hide" ]();
			});
		},
		url: function() {
			return this.attr('href') || this.attr('src');
		}
	});
	
	function createHelper(settings) {
		// there can be only one tooltip helper
		if( helper.parent )
			return;
		// create the helper, h3 for title, div for url
		helper.parent = $('<div id="' + settings.id + '"><div class="body"></div></div>')
			// add to document
			.appendTo(document.body)
			// hide it at first
			.hide();
			
		// apply bgiframe if available
		if ( $.fn.bgiframe )
			helper.parent.bgiframe();
		
		// save references to title and url elements
		helper.body = $('div.body', helper.parent);
	}
	
	function settings(element) {
		return $.data(element, "tooltip-settings");
	}
	
	// main event handler to start showing tooltips
	function handle(event, settings) {
		// show helper, either with timeout or on instant
		if( settings.delay )
			tID = setTimeout(show, settings.delay);
		else
			show();
		
		// if selected, update the helper position when the mouse moves
		track = !!settings.track;
		$(document.body).bind('mousemove', update);
			
		// update at least once
		update(event);
	}
	
	function mo_move( ev )
	{
		// 1. find the desired item
		var itemDesired = null; 
		if ( $(ev.target).is(settings(this).targetSelector) )
			itemDesired = ev.target;
		else
		{	
			itemDesired = $(ev.target).parents(settings(this).targetSelector)[0];
			if ( undefined == itemDesired ) itemDesired = null;
		}

		if( null == itemDesired )
		{
			if ( prevCell != null ) 
				hide.call( this );
			prevCell = null;
			current = null;
		}
		
		if ( prevCell == itemDesired ) return;
		current = this;
//		console.log ( "save: ", itemDesired );
		prevCell = itemDesired;
		save.call( itemDesired, ev, settings(this) );
	}
		
	// save elements title before the tooltip is displayed
	function save( ev, settings ) {
		// if this is the current source, or it has no title (occurs with click event), stop
		if ( $.tooltip.blocked || !settings.bodyHandler )
			return;

		if ( settings.bodyHandler ) {
			// changed to raw call to bodyHandler (so that it can modify the tooltip itself)
			settings.bodyHandler.call(this, helper.body);
			helper.body.show();
		} else {
			helper.body.hide();
		}
		
		// add an optional class for this tip
		helper.parent.addClass(settings.extraClass);

		// fix PNG background for IE
		if (settings.fixPNG )
			helper.parent.fixPNG();
			
		handle.apply(this, arguments );
	}
	
	// delete timeout and show helper
	function show() {
		tID = null;
		helper.parent.show();
		update();
	}
	
	/**
	 * callback for mousemove
	 * updates the helper position
	 * removes itself when no current element
	 */
	function update(event)	{
		if($.tooltip.blocked)
			return;
		
		// stop updating when tracking is disabled and the tooltip is visible
		if ( !track && helper.parent.is(":visible")) {
			$(document.body).unbind('mousemove', update)
		}
		
		// if no current element is available, remove this listener
		if( current == null ) {
			$(document.body).unbind('mousemove', update);
			return;	
		}
		
		// remove position helper classes
		helper.parent.removeClass("viewport-right").removeClass("viewport-bottom");
		
		var left = helper.parent[0].offsetLeft;
		var top = helper.parent[0].offsetTop;
		if(event) {
			// position the helper 15 pixel to bottom right, starting from mouse position
			left = event.pageX + settings(current).left;
			top = event.pageY + settings(current).top;
			helper.parent.css({
				left: left + 'px',
				top: top + 'px'
			});
		}
		
		var v = viewport(),
			h = helper.parent[0];
		// check horizontal position
		if(v.x + v.cx < h.offsetLeft + h.offsetWidth) {
			left -= h.offsetWidth + 20 + settings(current).left;
			helper.parent.css({left: left + 'px'}).addClass("viewport-right");
		}
		// check vertical position
		if(v.y + v.cy < h.offsetTop + h.offsetHeight) {
			top -= h.offsetHeight + 20 + settings(current).top;
			helper.parent.css({top: top + 'px'}).addClass("viewport-bottom");
		}
	}
	
	function viewport() {
		return {
			x: $(window).scrollLeft(),
			y: $(window).scrollTop(),
			cx: $(window).width(),
			cy: $(window).height()
		};
	}
	
	// hide helper and restore added classes and the title
	function hide(event) {
		if($.tooltip.blocked)
			return;
		// clear timeout if possible
		if(tID)
			clearTimeout(tID);
		// no more current element
		current = null;
		
		helper.parent.hide().removeClass( settings(this).extraClass );
		
		if( settings(this).fixPNG )
			helper.parent.unfixPNG();
	}
	
	$.fn.Tooltip = $.fn.tooltip;
	
})(jQuery);
