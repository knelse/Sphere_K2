//var CMenu = function() {
	function buildLine( menu, index, da_class )
	{
		var line = menu[index], result = [], id, name;
		for ( var i = 0; i < line.length; ++i )
		{
			id = index*100+i;
			name = line[i][0];
			if ( line[i][1] != undefined && line[i][1] < 99 )
				result.push( Template.use("menuItemParent", name, menu.code + id, buildLine( menu, /* for submenu */ line[i][1] ), index == 0 ? 0 : 1 ) );
			else
			{
				if ( line[i][1] != undefined ) 
					id = line[i][1];
				id = menu.code + id;
				switch( name.charAt(0) )
				{
					case '*': 
						if (  name.charAt(1) == '*' )
							result.push( Template.use("menuSeparatorIcon", name.substring(2) ) ); 
						else
							result.push( Template.use("menuSeparator", name.substring(1) ) ); 
						break;
					case '[': 
						var icon = name.substring(1,name.search(']'));
						result.push( Template.use("menuItemIcon", name.substring(1+name.search(']')), id, icon ) ); 
						break;
					case ']': 
						result.push( Template.use("menuItemCheck", name.substring(1), id ) ); 
						break;
					default: 
						result.push( Template.use("menuItem", name, id) ); 
						break;
				}
			}
		}
		return Template.use( index == 0 ? "menuRoot" : "menuGroup", result.join(""), da_class );
	}
//}

var CMenuItems = function() { 
	function onCommand() 
	{
		if( this.id == "" ) return;
		//markTime( 'onCommand' );
		showGroup( parseInt(this.id.substring(2)) );
	}
	function showGroup( id_group )
	{
		// if groupCode != something special
		var group =  Game.DB.ItemGroups.isDefined( id_group ) ? Game.DB.getGroup( id_group ) : Game.DB.getGroup( 600 + id_group % 4 );
		getView().ShowItemGroup( group );
	}
	
	this.showGroupForSlot = function( id_slot )
	{
		var group = groupForSlots[id_slot];
		if ( group ) 
			showGroup( group );
	}

	function init()
	{
		$('#itemMenu').html( buildLine( menuItems, 0, "" ) );
		menuItems = null;
		$('#itemMenu > ul').jdMenu( { onclick: onCommand } );
	}
	init();	
}
//CMenuItems.prototype = new CMenu();


var CMenuCharacter= function() { 
	function onCommand() 
	{
		if( this.id == "") return;
		var opCode = parseInt(this.id.substring(2));
		var v = getView();
		var c = v.getCharacter();
		switch( opCode ) 
		{
			case 106: // save pers
				getRfc().saveCharacter();
				break;
			case 105:
				v.editPers();
				break;
			case 101: // remove all
				c.undress();
				c.Update();
				v.Update(); 
				break;
			case 102: // reskill
				c.resetSkills(); 
				c.Update();
				v.Update(); 
				break;
			case 103: // reset guild
				c.resetGuild(); 
				c.Update();
				v.Update(); 
				break;
			case 110: case 111: case 112:
				index = opCode % 10;
				v.setCharacter(index);
		}
	}
	
	function init()
	{
		$('#charMenu').html( buildLine( menuCharacter, 0, "jdmenu_alignright" ) );
		menuCharacter = null;
		$('#charMenu > ul').jdMenu( { onclick: onCommand } );
	}

	init();
};
//CMenuCharacter.prototype = new CMenu();
