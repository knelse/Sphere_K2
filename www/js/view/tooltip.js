// JavaScript Document
var CTooltip = function() 
{
	this.init = function() {
		$('div.slot').tooltip( {bodyHandler: tooltip_slot, targetSelector: ".slot" } );
	};
	
	this.initFor = function( t_Class ) { 
		this.tooltip( { bodyHandler: tooltip_itemlist, track: true, targetSelector: t_Class } );
	}
	
	var ttItem = new CItem();
	var rank = new Array( '', "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV" );
	
	
	function generateReqs( gameitem, character ) 
	{
		var reqs = '', el, spec;
		reqs += Display.lvlreq( 'tl', gameitem.getReqTitle(), character.title % 60 );
		reqs += Display.lvlreq( 'dl', gameitem.getReqDegree(), character.degree % 60 );		

		el = gameitem.getRequiredElements();
		reqs += Display.req( 't1',  el.f1, character.totalEl.f1 );
		reqs += Display.req( 't2',  el.f2, character.totalEl.f2 );
		reqs += Display.req( 't3',  el.f3, character.totalEl.f3 );
		reqs += Display.req( 't4',  el.f4, character.totalEl.f4 );
		
		reqs += Display.req( 'd1',  el.m1, character.totalEl.m1 );
		reqs += Display.req( 'd2',  el.m2, character.totalEl.m2 );
		reqs += Display.req( 'd3',  el.m3, character.totalEl.m3 );
		reqs += Display.req( 'd4',  el.m4, character.totalEl.m4 );
		
		spec = gameitem.getReqSpec();
		if( 0 != spec ) 
		{
			spec = 'sp_' + ( spec >= 10 ? spec : '0' + spec );
			reqs += Display.req( spec, gameitem.getReqSpecLevel() );
		}
		return reqs;
	}
	
	
	function generateTooltip( gameitem, character ) 
	{
		var reqs = '', bonus = '',  dmg = '', extra = "", el;
		dmg += Display.peruse( 'tht', gameitem.get_peruse_hp() );
		dmg += Display.peruse( 'dht', gameitem.get_peruse_mp() );
		
		dmg += Display.damage( 'td', gameitem.get_attack_fa(), gameitem.get_spread() );
		dmg += Display.damage( 'dd', gameitem.get_attack_ma(), gameitem.get_spread() );
		dmg += Display.damage( 'dd2', gameitem.get_attack_mam(), gameitem.get_spread() );

		bonus += Display.req( 'thg',  gameitem.get_hp_give() );
		bonus += Display.req( 'dhg',  gameitem.get_mp_give() );
	
		if ( gameitem.hasMutator() ) 
			bonus += Display.mutator( gameitem.getMutatorIcon(), gameitem.getMutatorLen() );
		
		var scale = character == undefined ? 1 : character.getScale( gameitem );
		if ( scale != 1 ) 
			bonus += Display.scale( scale );
		
	  el = gameitem.getBonusElements();
		bonus += Display.bonus( 'th', gameitem.get_hp(), scale );
		bonus += Display.bonus( 'dh', gameitem.get_mp(), scale );		
		bonus += Display.bonus( 'td', gameitem.get_fa(), scale );
		bonus += Display.bonus( 'dd', gameitem.get_ma(), scale );		
		bonus += Display.bonus( 'ta', gameitem.get_fd(), scale );
		bonus += Display.bonus( 'da', gameitem.get_md(), scale );		

		bonus += Display.bonus( 't1', el.f1, scale );
		bonus += Display.bonus( 't2', el.f2, scale );
		bonus += Display.bonus( 't3', el.f3, scale );
		bonus += Display.bonus( 't4', el.f4, scale );
		
		bonus += Display.bonus( 'd1', el.m1, scale );
		bonus += Display.bonus( 'd2', el.m2, scale );
		bonus += Display.bonus( 'd3', el.m3, scale );
		bonus += Display.bonus( 'd4', el.m4, scale );
		
		bonus += Display.dot( 'th', Math.floor( scale * gameitem.get_hp_2m() ) );
		bonus += Display.dot( 'dh', Math.floor( scale * gameitem.get_mp_2m() ) );

		extra += Display.descr( gameitem.getMutatorDescr() );
		
		extra += Display.dist( gameitem.getDistance(),  gameitem.getDistanceAE() ); 
		extra += Display.delay( gameitem.getDelay() ); 		
		
		extra += Display.gt( gameitem.getCostGt() );
		
		var contents = Template.use( 'tooltipContents', dmg, generateReqs(gameitem, getView().getCharacter() ), bonus, extra );
		var rank = romanRank( gameitem.getRank() );
		var id = gameitem.getId()
		id = id[0] + ( gameitem.hasPrefix() ?  ' ' + id[1] : '' );
		
		return Template.use( 'tooltip', gameitem.getName(),  rank, id , contents );
	}	
	
	function romanRank( value )
	{
		return rank[ value <= 15 ? value : 0 ];
	}

	function setItemTooltip( gameitem, ui, character )
	{
		ui.html( gameitem.isNull() ? "( пустой слот )" : generateTooltip( gameitem, character ) );
	}

	function tooltip_slot( ui )
	{
		var character = getView().getCharacter();
		var gameitem = character.getItemInSlot(parseInt(this.id.substring(1)));
		if( ttItem == gameitem ) return;
		setItemTooltip( gameitem, ui, character );
	}
	function tooltip_itemlist( ui )
	{
		var id = getView().getTileId( $(this) );
		var ttid = ttItem.getId();
		if ( id[0] == ttid[0] && ttid[1] == id[1] ) return;
		
		ttItem.use( id[0], id[1] );
		setItemTooltip( ttItem, ui );
	}
	
	this.init();
	
}