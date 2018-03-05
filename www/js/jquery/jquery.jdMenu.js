/*
 * jdMenu 1.4.1 (2008-03-31)
 *
 * Copyright (c) 2006,2007 Jonathan Sharp (http://jdsharp.us)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://jdsharp.us/
 *
 * Built upon jQuery 1.2.1 (http://jquery.com)
 * This also requires the jQuery dimensions >= 1.2 plugin
 */

(function($){
	function addEvents(ul) {
		var settings = $.data( $(ul).parents().andSelf().filter('ul.jdmenu')[0], 'jdMenuSettings' );
		$('> li', ul)
			.bind('mouseenter.jdmenu mouseleave.jdmenu', function(evt) {
				if ( $(this).hasClass("separator") ) return;
				$(this).toggleClass('jdm_hover');
				var ul = $('> ul', this);
				if ( ul.length == 1 ) {
					clearTimeout( this.$jdTimer );
					var enter = ( evt.type == 'mouseenter' );
					var fn = ( enter ? showMenu : hideMenu );
					this.$jdTimer = setTimeout(function() {
						fn( ul[0], settings.onAnimate, settings.isVertical, settings.isRightSided );
					}, enter ? settings.showDelay : settings.hideDelay );
				}
			})
			.bind('click.jdmenu', function(evt) {
				var ul = $('> ul', this);
				if ( ul.length == 1 && 
					( settings.disableLinks == true || $(this).hasClass('accessible') ) ) {
					showMenu( ul, settings.onAnimate, settings.isVertical, settings.isRightSided );
					return false;
				}
				
				if( $(this).hasClass("separator") )	
				{
					evt.stopPropagation();
					return false;
				}
				
				// The user clicked the li and we need to trigger a click for the a
				if ( evt.target == this ) {
					settings.onclick.call( this );
				}
				if ( settings.disableLinks || !$(this).parent().hasClass('jdmenu') ) {
					$(this).parent().jdMenuHide();
					evt.stopPropagation();
				}
			});
	}

	function showMenu(ul, animate, vertical, rightside ) {
		var ul = $(ul);
		if ( ul.is(':visible') ) {
			return;
		}
		ul.bgiframe();
		var li = ul.parent();
		ul	.trigger('jdMenuShow')
			.positionBy({ 	target: 	li[0], 
							targetPos: 	( vertical === true || !li.parent().hasClass('jdmenu') ? 1 : ( rightside === true ? 2 : 3 ) ), // 2
							elementPos: ( rightside === true ? 1 : 0 ),  
							hideAfterPosition: true
							});
		if ( !ul.hasClass('jdm_events') ) {
			ul.addClass('jdm_events');
			addEvents(ul);
		}
		li	.addClass('jdm_active')
			// Hide any adjacent menus
			.siblings('li').find('> ul:eq(0):visible')
				.each(function(){
					hideMenu( this ); 
				});
		if ( animate === undefined ) {
			ul.show();
		} else {
			animate.apply( ul[0], [true] );
		}
	}
	
	function hideMenu(ul, animate) {
		var ul = $(ul);
		$('.bgiframe', ul).remove();
		ul	.filter(':not(.jdmenu)')
			.find('> li > ul:eq(0):visible')
				.each(function() {
					hideMenu( this );
				})
			.end();
		if ( animate === undefined ) {
			ul.hide()
		} else {
			animate.apply( ul[0], [false] );
		}

		ul	.trigger('jdMenuHide')
			.parents('li:eq(0)')
				.removeClass('jdm_active jdm_hover')
			.end()
				.find('> li')
				.removeClass('jdm_active jdm_hover');
	}
	
	// Public methods
	$.fn.jdMenu = function(settings) {
		// Future settings: activateDelay
		var settings = $.extend({	// Time in ms before menu shows
									showDelay: 		200,
									// Time in ms before menu hides
									hideDelay: 		500,
									// Should items that contain submenus not 
									// respond to clicks
									disableLinks:	true
									// This callback allows for you to animate menus
									//onAnimate:	null
									}, settings);
		if ( !$.isFunction( settings.onAnimate ) ) {
			settings.onAnimate = undefined;
		}
		if ( !$.isFunction( settings.onclick ) ) {
			settings.onclick = undefined;
		}
		return this.filter('ul.jdmenu').each(function() {
			$.data(	this, 
					'jdMenuSettings', 
					$.extend({ isVertical: $(this).hasClass('jdmenu_vertical'), isRightSided: $(this).hasClass('jdmenu_alignright')  }, settings) 
					);
			addEvents(this);
		});
	};
	
	$.fn.jdMenuUnbind = function() {
		$('ul.jdm_events', this)
			.unbind('.jdmenu')
			.find('> a').unbind('.jdmenu');
	};
	$.fn.jdMenuHide = function() {
		return this.filter('ul').each(function(){ 
			hideMenu( this );
		});
	};

	// Private methods and logic
	$(window)
		// Bind a click event to hide all visible menus when the document is clicked
		.bind('click.jdmenu', function(){
			$('ul.jdmenu ul:visible').jdMenuHide();
		});
})(jQuery);
