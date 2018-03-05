;var CView = function()  // view for a model
{
	var allCharacters = [new CCharacter("Кукла 1"), new CCharacter("Кукла 2"), new CCharacter("Кукла 3")];
	
	// maybe characters were created by script?
	var nChar = 0;
	for( var i in setup.chars )
	{
		if ( nChar >= 3 ) 
			break;
		allCharacters[nChar].deserialize( i, chars[i] );
		allCharacters[nChar].Update();
		nChar++;
	}
	
	var Character = null;
	function getTileItemId( div )
	{
		var z = div.attr('gameid').split(',');		
		z[0] = parseInt( z[0] );
		z[1] = parseInt( z[1] );
		return z;
	}
	this.getTileId = getTileItemId;	
		
	this.editPers = function(force) {
		if ( arguments.length > 1 && force )
			$("#rootdiv").removeClass("state_dressup").addClass("state_editstats"); 		
		else
			$("#rootdiv").toggleClass("state_dressup").toggleClass("state_editstats"); 
	}
	
	this.Update = function () { Doll.Update(); ListView.Update(); } 
	this.setCharacter = function(i) { 
		Character = allCharacters[i]; 
		Doll.setCharacter( Character ); 
		DnD.setCharacter( Character ); 	
		this.Update(); 
	} 
	this.showGroupForSlot = function( slot_id ) 
	{
		Menu.showGroupForSlot( slot_id );
	}
		
	this.getDoll = function() { return Doll; } 
	this.getCharacter = function() { return Character; } 
	this.getAllCharacters = function() { return allCharacters; } 
	this.ShowItemGroup = function( group ) { ListView.ShowItemGroup( group ); } 
	this.getUserInfo = function() { return UserInfo; }
	
	var DnD = new CDnD();
	var Tooltip = new CTooltip();
	var ListView = new CItemList( Tooltip, DnD );
	var Doll = new CDoll();
	var Menu = new CMenuItems();
	var UserInfo = new CUserInfo(setup.auth);
}

$( function() { 
	Game = new CGame();
	Game.DB.Items.setupPrefix( prefix );	
	Game.DB.Items.extendTable( items );
	Game.DB.ItemGroups.loadJSon( groups );
	Game.DB.CostGt.setup( gt_price );
	items = null;

	var View = new CView();
	// this will be global, others will not
	getView = function() { return View; } 
	View.setCharacter( 0 );

	var Rfc = new CRfc(setup.api_url);
	getRfc = function() { return Rfc; }

	disableSelection(document.getElementById('doll-slots') ) 
	disableSelection(document.getElementById('itemMenu') ) 
} );

/*var timeStart;
var timeC = function( state ) { timeStart = new Date(); $('#debug_watch').append( "<br/> 0 : " + state ); }
var timeM = function( state ) { var d = new Date(); $('#debug_watch').append( "<br/>" +(d.getTime() - timeStart.getTime()) + " : " + state ); };
var debugT = function( state ) { $('#debug_watch').text( state ); };
var debugH = function( state ) { $('#debug_watch').html( state ); };
*/

function disableSelection(target){
if (typeof target.onselectstart!="undefined") //IE route
	target.onselectstart=function(){return false}
else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
	target.style.MozUserSelect="none"
else //All other route (ie: Opera)
	target.onmousedown=function(){return false}
target.style.cursor = "default"
}


