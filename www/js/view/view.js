;var CView = function()  // view for a model
{
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

	var Character = null;
	this.Update = function () { Doll.Update(); ListView.Update(); } 
	this.setCharacter = function( character ) { 
		Character = character; 
		Doll.setCharacter( character ); 
		DnD.setCharacter( character ); 	
		this.Update(); 
	} 
	this.showGroupForSlot = function( slot_id ) 
	{
		Menu.showGroupForSlot( slot_id );
	}
		
	this.getDoll = function() { return Doll; } 
	this.getCharacter = function() { return Character; } 
	this.ShowItemGroup = function( group ) { ListView.ShowItemGroup( group ); } 
	
	var DnD = new CDnD();
	var Tooltip = new CTooltip();
	var ListView = new CItemList( Tooltip, DnD );
	var Doll = new CDoll();
	var Menu = new CMenuItems();
	
	disableSelection(document.getElementById('doll-slots') ) 
	disableSelection(document.getElementById('itemMenu') ) 
}

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


