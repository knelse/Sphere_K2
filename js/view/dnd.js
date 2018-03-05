// DND
;function CDnD() 
{
	var Character = null;
	var gameitem = new CItem();
	this.setCharacter = function() { Character = arguments[0]; }
	function init() 
	{
		$(".slot").droppable({
			accept: isSlotAccepting,
			activeClass: "slot-accepts",
			drop: function(ev, ui) { onDrop.call(this, ev, ui); }
			}).append(Template.slot).dblclick( onSlotDblClick );
	};
	
	this.initFor = function()
	{
		this.draggable( { revert: true } ).
		dblclick( function ( e ) { autoFit( getView().getTileId( $(this) ) ); } );
	}
	
	function autoFit( el_id )
	{
		gameitem.use( el_id[0], el_id[1] );
		var slot = Character.findSlotForItem(gameitem);
		if ( slot == -1 ) return;
		Character.putOnItem( el_id, slot );
		Character.Update();
		getView().Update();
	}

	function isSlotAccepting( el )
	{
		var id = getView().getTileId( el )
		gameitem.use( id[0], id[1], Game.DB.getItemRaw( id[0], id[1] ) );
		var slotid = parseInt((this[0].id).substring(1));
		return gameitem.fitsToSlot( slotid );
	};

	function onSlotDblClick( ev ) 
	{
		var slot_id = parseInt(this.id.substring(1));
		if ( slot_id < 30 ) 
		{
			if( Character.getItemIdInSlot( slot_id )[0] )
			{
				Character.removeFromSlot( slot_id ); 	
				Character.Update();	
				getView().Update();
			}
			else 
			{
				getView().showGroupForSlot( slot_id );
			}
		}
		else
		{
			var el_id = Character.getItemIdInSlot(slot_id);
			if ( el_id[0] )
				autoFit( [].concat(el_id) ); 	
		}
	}
	function onDrop(ev, ui)
	{
			var brought = $(ui.draggable);
			brought.css("left", "0px").css("top","0px");
			var el = $(this);
			var slot_id = parseInt(this.id.substring(1));
			var item_id = getView().getTileId(brought);
			Character.putOnItem(item_id, slot_id);
			Character.Update();	
			getView().Update()
	}
	
	init();	
}