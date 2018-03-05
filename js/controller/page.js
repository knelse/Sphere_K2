var CPage = function( setup )
{
	var user = new CUser( setup.auth );	
	this.getUser = function() { return user; } 
	
	var rfc = new CRfc( setup.apiurl );
	getRfc = function() { return rfc; }
	
	var nChar = 0;
	for( var i in setup.chars )
	{
		if ( nChar >= user.getMaxCharacters() ) 
			break;
		Game.character[nChar] = new CCharacter();			
		Game.character[nChar].deserialize( i, setup.chars[i] );
		Game.character[nChar].Update();
		nChar++;
	}
	for( var i = nChar; i < user.getMaxCharacters(); i++ )
	{
		Game.character[nChar++] = new CCharacter( "Doll #" + i );
	}

}

// JavaScript Document

$( function() { 
	// Model first
	Game = new CGame();
	Game.initDB( db_items, db_prefix, db_value_gt );
	delete db_items;
	delete db_prefix;
	delete db_value_gt;

	// controller then
	Page = new CPage( setup );

	// view is the last one
	View = new CView();
	View.setCharacter( Game.character[0] );	

});
