// doll.js
var CDoll = function()  {
	var Character = null;
	var menu = new CMenuCharacter();
	this.setCharacter = function() { UpdateMenu( arguments[0] ); Character = arguments[0]; }
	
	this.Update = function()
	{
		UpdateSlots();
		UpdateView();
		UpdateMenu();
	}

	function init()
	{
		var template = Template.use( 'svalue' );
		$("#f1").html( template );
		$("#f2").html( template );
		$("#f3").html( template );
		$("#f4").html( template );
		$("#m1").html( template );
		$("#m2").html( template );
		$("#m3").html( template );
		$("#m4").html( template );
		
		// dblclick for edit stats
		$('input.base').blur( function(e) { 
				$(this.parentNode).removeClass("state_editstats"); 
				var v = parseInt(this.value);
				if ( !isNaN( v ) ) 
				{
					if ( Character.baseEl[this.parentNode.id] == v ) 
						return;
					Character.baseEl[this.parentNode.id] = Math.max(v,0);
					Character.Update();
				}
				getView().Update();
			} ).keypress( function(e) { if ( e.which == 13 ) this.blur(); } ) ; 		
		
		// if Opera return; - dunno why Opera displays context menu on dblClick

		$('#stats div.total').dblclick( function(e) {
				var par = $( this.parentNode );																			 
				par.addClass("state_editstats"); 
				$( 'input', par ).select();
			} );

		$('#stats a.up').mousedown( function(e) { $(this).addClass('clicked-up'); } )
		.mouseup( function(e) { $(this).removeClass('clicked-up'); } )
		.mouseout( function(e) { $(this).removeClass('clicked-up').removeClass('hover-up'); } )
		.mouseover( function(e) { $(this).addClass('hover-up');	} );

		$('#stats a.down').mousedown( function(e) { $(this).addClass('clicked-down'); } )
		.mouseup( function(e) { $(this).removeClass('clicked-down'); } )
		.mouseout( function(e) { $(this).removeClass('clicked-down').removeClass('hover-down'); } )
		.mouseover( function(e) { $(this).addClass('hover-down');	} );


		$('#stats .up').click( function(e) {
			// here would be good a check...																			 
			if ( Character.baseEl[this.parentNode.id] < 999 ) 
				Character.baseEl[this.parentNode.id]++;
			else
				return;
			Character.Update();
			getView().Update();				
		} );
		$('#stats .down').click( function(e) {
			if ( Character.baseEl[this.parentNode.id] > 0 ) 
				Character.baseEl[this.parentNode.id]--;
			else
				return;
			Character.Update();
			getView().Update();				
		} );
		 
		$('#characterTitle').dblclick( function() { getView().editPers(true); $("#editCharacterTitle").select(); } );
		$('#characterDegree').dblclick( function() { getView().editPers(true); $("#editCharacterDegree").select(); } );
		$("#characterName").dblclick( function() { getView().editPers(true); $("#editCharacterName").select(); } );

		
		$('#editCharacterTitle').blur( function(e) {
				var v = parseInt(this.value);
				if ( !isNaN( v ) ) 
				{
					Character.title = 60*Math.floor((Character.title - 1)/60) + Math.min(60, Math.max(v,1) ); 
					Character.Update();
				}
				getView().Update();
			} ).keypress( function(e) { if ( e.which == 13 ) { this.blur(); editPersFinished(); } } );
		$('#editCharacterDegree').blur( function(e) {
				var v = parseInt(this.value);
				if ( !isNaN( v ) ) 
				{
					Character.degree = 60*Math.floor((Character.degree - 1)/60) + Math.min(60, Math.max(v,1) ); 
					Character.Update();
				}
				getView().Update();
			} ).keypress( function(e) { if ( e.which == 13 ) { this.blur(); editPersFinished(); } } );		
		$('#editCharacterName').blur( function(e) {
				var v = this.value;
				Character.name = v; 
				getView().Update();
				UpdateMenu(Character);///////////////////////////////////////
		} ).keypress( function(e) { if ( e.which == 13 ) { this.blur(); editPersFinished(); }  } );			
		$("#selectGreatTitle").change( function(e) {
				var v = parseInt(this.value);
				Character.title = 1 + ((Character.title-1)%60) + ((v-1)*60);
				Character.Update();
				getView().Update();				
			} );
		$("#selectGreatDegree").change( function(e) {
				var v = parseInt(this.value);
				Character.degree = 1 + ((Character.degree-1)%60) + ((v-1)*60);
				Character.Update();
				getView().Update();				
			} );	
		
		$("#editCharacterDone").click( editPersFinished );
	}

	function UpdateSlots()
	{
		for( var i = 0; i < Character.getSlotCount(); ++i )
		{
			var id = '#s'+i; 
			var slotdiv = $(id);
			var icodiv = $(id + " > div");
			var gameitem = Character.getItemInSlot(i);
			if ( gameitem.isNull() )
			{
				icodiv.css( 'background-image', '' );
				slotdiv.removeClass('slot-filled').removeClass('cannot-use');
			}
			else
			{
				var image = gameitem.getIcon();
				if ( i >= 20 && gameitem.hasMutator() && i < 30 )
					image = gameitem.getMutatorIcon(); 				
				icodiv.css( 'background-image', 'url(g/'+image+'.png)' );
				
				if ( Character.canUse( gameitem ) )
					slotdiv.removeClass('cannot-use');
				else
					slotdiv.addClass ( 'cannot-use' );
				
				slotdiv.addClass('slot-filled');
			}
			// reflect character's state 		
		}
	}
	
	function UpdateMenu() 
	{
		var cc = getView().getAllCharacters();
		var ca = getView().getCharacter();
		
		for ( var i = 0; i < 3; ++i )
		{
			var el = $('#mc11' + i );
			if( el.text() != cc[i].name )
				el.text ( cc[i].name );
				
			if ( cc[i] == ca ) 
				el.addClass( 'selectedChar' );
			else
				el.removeClass( 'selectedChar' );			
		}
		
	}

	function UpdateView()
	{
		var real_title = 1 + ( Character.title - 1 ) % 60, real_degree = 1 + ( Character.degree - 1 ) % 60;

		$("#characterTitle").text (real_title +' '+ Template.great(Character.title));
		$("#characterDegree").text (real_degree +' '+ Template.great(Character.degree));
		$("#editCharacterTitle").val(real_title);
		$("#editCharacterDegree").val(real_degree);
		$("#characterName").text( Character.name );
		$("#editCharacterName").val(Character.name );
		
		$("#selectGreatTitle").val( Math.ceil(Character.title/60) );
		$("#selectGreatDegree").val( Math.ceil(Character.degree/60) );

		$("#hp").text(Character.hp);
		$("#mp").text(Character.mp);
		$("#gt-total").text(Character.gt);
	
		$("#ma").text(Character.ma);
		$("#fa").text(Character.fa);
		$("#md").text(Character.md);
		$("#fd").text(Character.fd);
		
		var els = Character.getFreeElements();
		$('#f0').text( els[0] );
		if ( els[0] < 0 ) 
			$('#f0').addClass( 'invalid' ); 
		else 
			$('#f0').removeClass( 'invalid' ); 
			
		$('#m0').text( els[1] );		
		if ( els[1] < 0 ) 
			$('#m0').addClass( 'invalid' ); 
		else 
			$('#m0').removeClass( 'invalid' ); 

		$("#f1 > .base").val(Character.baseEl.f1);
		$("#f2 > .base").val(Character.baseEl.f2);
		$("#f3 > .base").val(Character.baseEl.f3);
		$("#f4 > .base").val(Character.baseEl.f4);			
		$("#f1 > .total").text(Character.totalEl.f1);
		$("#f2 > .total").text(Character.totalEl.f2);
		$("#f3 > .total").text(Character.totalEl.f3);
		$("#f4 > .total").text(Character.totalEl.f4);	
		$("#f1 > .req").text('['+Character.reqEl.f1+']');
		$("#f2 > .req").text('['+Character.reqEl.f2+']');
		$("#f3 > .req").text('['+Character.reqEl.f3+']');
		$("#f4 > .req").text('['+Character.reqEl.f4+']');	

		$("#m1 > .base").val(Character.baseEl.m1);
		$("#m2 > .base").val(Character.baseEl.m2);
		$("#m3 > .base").val(Character.baseEl.m3);
		$("#m4 > .base").val(Character.baseEl.m4);	
		$("#m1 > .total").text(Character.totalEl.m1);
		$("#m2 > .total").text(Character.totalEl.m2);
		$("#m3 > .total").text(Character.totalEl.m3);
		$("#m4 > .total").text(Character.totalEl.m4);	
		$("#m1 > .req").text('['+Character.reqEl.m1+']');
		$("#m2 > .req").text('['+Character.reqEl.m2+']');
		$("#m3 > .req").text('['+Character.reqEl.m3+']');
		$("#m4 > .req").text('['+Character.reqEl.m4+']');	
	}
	
	function editPersFinished() {
		$("#rootdiv").addClass("state_dressup").removeClass("state_editstats"); 
		$( '#stats div.s-value' ).removeClass("state_editstats"); 
		Character.Update();
		getView().Update();
	}
	
	init();
};