// itemlist
;var CItemList = function( Tooltip, DnD ) 
{
	// itemlist has prefix selection area and the list itself
	

	var jqList = $('#theList'), jqPrefix = $('#prefixSelector');
	var idPrefix = 0;
	var lastPrefix = ['', 0];
	var prefixEmpty = 0;
	var shownGroup = 0;
	var iCol = 0, iRow = 0, iLineIndex = 0;
	var refitem = new CItem();
	var previtem = new CItem();
	var gameitem = new CItem();
	var items = [];
	var placemode = 0; // 0 = rank-based; 1 = manual left-right, up-down; 2 = up-down, left-to-right

	this.ShowItemGroup = function( group )
	{
		shownGroup = group;
		idPrefix = 0;
		doShow();
	}

	function updatePrefixPanel()
	{
		if ( shownGroup[1] != 0 )
		{ // enable prefixes
			jqPrefix.show();
			prefixEmpty = 1;
		}
		else
		{
			jqPrefix.hide();
			idPrefix = 0;
		}		
	}

	function doShow()
	{
		updatePrefixPanel();

//	timeC( "Build list began" );

		iCol = 0;
		iLineIndex = 0;
		iRow = 0;
		placemode = 0
		items = [];
		refitem.nullify();
		previtem.nullify();
		jqList.empty();
		
//	timeM( "jqList.empty()" );			
		var isSet = false;
		for ( var i = 2; i < shownGroup.length; ++i )
		{
			var range = shownGroup[i];
			//console.log( range );
			if ( typeof(range) == 'number' ) 
				addItem( range );
			else if ( typeof(range) == 'string' ) 
				processStringToken(range);
			else
				switch( range.length ) 
				{
					case 2:
						for ( var k = range[0]; k <= range[1]; ++k ) 
							addItem( k );
						break;
					case 0:
						iCol += 0.5;
						break;
					case 1: 
						if ( typeof(range[0]) == 'number' )
							iCol += range[0];
						else 
							processStringToken( range[0] );
						break;
					default: // this is a set
						for( var k = 0; k < range.length; k++ )
							addItem( range[k] );
						//addPutOnButton( range );
						
				}
		}
		jqList[0].innerHTML = items.join("") ;
		Tooltip.initFor.call( jqList, ".icon" );
		DnD.initFor.call( $( '.icon', jqList ) );
	}
	
	function processStringToken( token )
	{
		var delta = parseFloat(token.substring(1));
		switch ( token.charAt(0) ) 
		{
			case 'Z':
				newline( delta ? delta : 1 ); 
				break;
			case 'M':
				placemode = parseInt(token.substring(1));
				break;
			case 'I': case 'C':
				newcolumn( delta ? delta : 1 ); 
				break;
			case 'S':
				setSlots = token.substring(1).split(',');
		} 		
	}

	function newcolumn( delta ) 
	{
		switch (placemode)
		{
			case 0:
				iLineIndex += delta;
			case 1:
				iCol += delta; 
				break;
			case 2:
				iRow += delta; 
		}
	}

	function newline( delta ) 
	{
		switch (placemode)
		{
			case 0: 
				refitem.nullify();
				previtem.nullify();					
				iLineIndex = 0;			
			case 1:
				iRow += delta; 
				iCol = 0; 
				break;
			case 2:
				iCol += delta; 
				iRow= 0; 
		}
	}
	
	function canuse()
	{
		var el = $(this), id;
		id = getView().getTileId( el );
		if ( getView().getCharacter().canUse( gameitem.use( id[0], id[1] ) ) )
			el.parent().removeClass('cannot-use');
		else
			el.parent().addClass ( 'cannot-use' );		
	}
	
	function onSwitchPrefix()
	{
		idPrefix = parseInt(this.id.substring(1));
		lastPrefix[1] = idPrefix;
		doShow();
	}
	
	function fillPrefix( gameitem )
	{

		if ( lastPrefix[0] == gameitem.getPrefixLetter() )
			idPrefix = lastPrefix[1];
			
		var prefixes = prefix[gameitem.getPrefixLetter()], i=0,j=0,m, tx='';;
		lastPrefix[0] = gameitem.getPrefixLetter();
		// sort	
		var order = [];
		for( i = 0; i < prefixes.length; ++i )
			order[i] = i;

		for( i = 0; i < order.length; i++ )
		{
			m = i;
			for( j = i+1; j < order.length; j++ )
				if( prefixes[order[j]][0] < prefixes[order[m]][0] ) 
					m = j; 
			j = order[i];		
			order[i] = order[m];
			order[m] = j;
		}
		// display
		jqPrefix.html( Template.use( ( 0 == idPrefix ? 'prefixSwitchDisable' : 'prefixSwitch' ), 0, "Без префикса" ) );
		m = '';
		j = m;
		for( var i = 0; i < order.length; ++i )
		{
			tx = prefixes[order[i]][0];
			if ( j == tx ) 
				tx += ' (спец-вещи)';
			if ( m == tx )
				tx += ' (новые)';
			jqPrefix.append( Template.use( ( order[i]+1 == idPrefix ? 'prefixSwitchDisable' : 'prefixSwitch' ), order[i]+1, tx ) );
			j = m;
			m = prefixes[order[i]][0];
		}
		
		$( "a.prefix-sw", jqPrefix ).click( onSwitchPrefix );
		prefixEmpty = 0;	
	}


	function addSet( itemz )
	{
		items.push( everyitem.join("") );	
	}
	
	function addItem( id ) 
	{
//		console.log( 'additem', id );
		var x = iCol; y = iRow;
		gameitem.use( id, idPrefix );
		if ( gameitem.isNull() ) return;
		if ( prefixEmpty ) 
		{
			fillPrefix( gameitem )
			gameitem.use( id, idPrefix );			
		}

		switch( placemode )
		{
			case 0:
				var rank = gameitem.getRank();
				y += rank > 0 ? rank - 1 : 0;
				
				if ( !gameitem.isSameFamilyAs( refitem ) ) 
				{
					if ( refitem != null && !refitem.isNull() ) 
						iCol++;
					iLineIndex = iCol;
					x = iCol;					
					refitem.use( id, 0 );
//					console.log( 'refitem set to: ', id, x, y );
				} 
				if ( previtem != null && !previtem.isNull() )
				{
					if ( previtem.getRank() == gameitem.getRank() )
						iCol++;
					else
						iCol = iLineIndex;
					x = iCol;
				}
				previtem.use( id, 0 );

				break;
			case 1:
				iCol++;
				if ( iCol > 16 ) { iCol = 0; iRow++ };
				break;
			case 2:
				iRow++;
				if ( iRow > 14 ) { iRow = 0; iCol++ };
				// break;
		}
		
		var left = x * 36;
		var top = y * 36 + 2;
		var canuse = getView().getCharacter().canUse( gameitem ) ? "" : "cannot-use";
		var gameid = id + ',' + idPrefix;

//		items.push( Template.use( "itempad", gameid, gameitem.getIcon(), left , top, canuse ) );
		items.push( FastTemplate[0]( 1, canuse, left , top, gameid, gameitem.getIcon() ) );


	}
	
	this.Update = function() // is called when character gets changed and items' usability need to be reevaluated
	{
		$('.icon', jqList).each( canuse );
	}
};
