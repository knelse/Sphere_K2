// character.js
function CCharacter ( name ) { 
	function CSlot() {
		this.id = [0,0];
		this.isEmpty = function() { return this.id[0] == 0; } 
		this.clear = function() { this.id[0] = this.id[1] = 0; }
		this.toString = function() { return '[slot:'+this.id[0]+'/'+this.id[1]+']'; } 
	};
	var SLOT_COUNT = 37;
	
	var gameitem = new CItem();

	// should track if it is saved on server
	var saved = 0;
	var dbId = 0;
	var idOwner = 0;
	
	var slot = [];
	for ( var i = 0; i < SLOT_COUNT; ++i ) slot[i] = new CSlot();
	this.getItemInSlot = function(i){ return gameitem.use( slot[i].id[0], slot[i].id[1] ); }
	this.getItemIdInSlot = function(i){ return slot[i].id; }
	this.putOnItem = function(idItem, iSlot) { slot[iSlot].id = idItem; }
	this.removeFromSlot = function( iSlot ) { slot[iSlot].clear(); }
	this.getSlotCount = function() { return slot.length; }
	
	this.title = 1;
	this.degree = 1;
	this.karma = 3;
	this.name = arguments.length > 0 ? arguments[0] : "Новая Кукла";
	this.baseEl = new CElements();
	this.reqEl = new CElements();
	this.totalEl = new CElements();	
	this.ma = this.fa = 0;
	this.hp = this.mp = 100;
	this.md = this.fd = 0;
	this.gt = 0;
	
	this.canEdit = true;
	this.resetSkills = function() { this.baseEl.C(); }
	this.resetGuild = function() {  slot[15].clear(); }	
	this.undress = function() { for ( var i = 0; i < 30; ++i ) slot[i].clear(); }
	this.resetStats = function() { 
		this.ma = this.fa = 0;
		this.md = this.fd = 0;	
		this.hp = Game.RPG.getHp( this.title, this.degree );
		this.mp = Game.RPG.getMp( this.title, this.degree );		
		this.gt = 0;
	};
	
	this.canUse = function(gameitem) {
		if ( !this.totalEl.isMoreOrEqualThan( gameitem.getRequiredElements() )) return false;
		// test level
		var real_title = 1 + ( this.title - 1 ) % 60, real_degree = 1 + ( this.degree - 1 ) % 60;
		var req_title = gameitem.getReqTitle(), req_degree = gameitem.getReqDegree();
		if ( ( req_title[0] != 0 && real_title < req_title[0] ) || ( req_title[1] != 0 && real_title > req_title[1] ) ) return false;
		if ( ( req_degree[0] != 0 && real_degree < req_degree[0] ) || ( req_degree[1] != 0 && real_degree > req_degree[1] ) ) return false;		
		var spec = gameitem.getReqSpec();
		if ( spec == 0 ) return true;
		return ( this.getSpec() == spec && this.getSpecLevel() >= gameitem.getReqSpecLevel() ) ;
	}
	
	this.getSpec = function() {
		var spec_item = slot[15].id[0];
		if ( spec_item == 0 ) return 0;
		return Math.round( spec_item / 100 - 54 ) ;
	}
	
	this.getSpecLevel = function() { 
		var spec_item = slot[15].id[0];	
		if ( spec_item == 0 ) return 0;
		return 1 + spec_item % 100;
	}
	
	this.getFreeElements = function () { 
		var res = Game.RPG.getMaxElements( this.title, this.degree );
		res[0] -= this.baseEl.f1 + this.baseEl.f2 + this.baseEl.f3 + this.baseEl.f4;
		res[1] -= this.baseEl.m1 + this.baseEl.m2 + this.baseEl.m3 + this.baseEl.m4;
		return res;
	}
	
	this.getScale = function( gameitem ) {
		if ( !gameitem.hasMutator() ) return 1;
		var itemRank = gameitem.getRank(), charRank = 1 + Math.floor( Math.max( ( this.title - 1 ) % 60, ( this.degree - 1 ) % 60 ) / 5 );
		if ( charRank >= 10 || itemRank - charRank <= 2 ) return 1;		
		return (charRank + 1 ) / ( itemRank - 1);
	}
	
	this.Update = function () {
		// 1. initialize accumulators
		var addEl = new CElements(); 
		this.reqEl.C();
		this.resetStats();
	
		// 2. iterate over all items adding to stats
		for( var i = 0; i < 30; ++i )
		{
			if ( slot[i].isEmpty() ) continue;

			gameitem.use( slot[i].id[0], slot[i].id[1] );
			this.gt += gameitem.getCostGt();

			var isMutFromWeapon = gameitem.isWeapon() && i >= 20, scale = 1 // is weapon in slot for mutators

			if ( !isMutFromWeapon ) 
				this.reqEl.raise( gameitem.getRequiredElements() );

			scale = this.getScale( gameitem );

			this.ma += Math.floor(scale * gameitem.get_ma() ) + ( isMutFromWeapon ? 0 : gameitem.get_attack_ma() );
			this.fa += Math.floor(scale * gameitem.get_fa() ) + ( isMutFromWeapon ? 0 : gameitem.get_attack_fa() );
			
			if ( i == 0 && gameitem.hasMutator() ) continue;

		  addEl.add( gameitem.getBonusElements(), scale );

			this.md += Math.floor(scale * gameitem.get_md());			
			this.fd += Math.floor(scale * gameitem.get_fd());
			this.hp += Math.floor(scale * gameitem.get_hp());			
			this.mp += Math.floor(scale * gameitem.get_mp());
		}		
		
		// 3. Calculate total elements
		this.totalEl.f1 = this.baseEl.f1 + addEl.f1;
		this.totalEl.f2 = this.baseEl.f2 + addEl.f2;
		this.totalEl.f3 = this.baseEl.f3 + addEl.f3;
		this.totalEl.f4 = this.baseEl.f4 + addEl.f4;
		// hare-hare, Krishna 
		this.totalEl.m1 = this.baseEl.m1 + addEl.m1;
		this.totalEl.m2 = this.baseEl.m2 + addEl.m2;
		this.totalEl.m3 = this.baseEl.m3 + addEl.m3;
		this.totalEl.m4 = this.baseEl.m4 + addEl.m4;		
		// Indian code ends here... I hope
	}; 
	

	this.findSlotForItem = function( it ) {
		var lastGood = -1;

		if( it.getSlot() != 11 && it.hasMutator() )
		{ 
			for( var i = 20; i < 30; ++i ) 
			{
				if ( 0 != slot[i].id[0] )
				{
					gameitem.use( slot[i].id[0], slot[i].id[1] );
					if( it.getIcon() == gameitem.getIcon() ) 
						return i;
				}
				lastGood = i;
				if ( slot[i].isEmpty() ) return i; 
			}
		}
		else		
		{			
			for( var i = 0; i < 30; ++i ) 
			{
				if( !it.fitsToSlot( i ) ) continue;
				lastGood = i;
				if ( slot[i].isEmpty() ) return i; 
			}
		}
		return lastGood;
	}
	
	this.hasDbId = function() {	return dbId > 0;}
	this.setDbId = function(id) { dbId = id; }
	
	this.serialize = function() 
	{
		var items = [];
		for( var i = 0; i < SLOT_COUNT; i++ )
			items.push( slot[i].id[0] + slot[i].id[1]*100000 );
		
		
		var stats = [];
		stats.push( this.title );
		stats.push( this.degree );
		stats.push( this.karma );
		stats.push( this.getSpec() );
		stats.push( this.getSpecLevel() );		

		stats.push( this.baseEl.f1 );		
		stats.push( this.baseEl.f2 );		
		stats.push( this.baseEl.f3 );		
		stats.push( this.baseEl.f4 );		
		stats.push( this.baseEl.m1 );				
		stats.push( this.baseEl.m2 );		
		stats.push( this.baseEl.m3 );		
		stats.push( this.baseEl.m4 );				

		stats.push( this.totalEl.f1 );		
		stats.push( this.totalEl.f2 );		
		stats.push( this.totalEl.f3 );		
		stats.push( this.totalEl.f4 );		
		stats.push( this.totalEl.m1 );				
		stats.push( this.totalEl.m2 );		
		stats.push( this.totalEl.m3 );		
		stats.push( this.totalEl.m4 );		

		stats.push( this.hp );
		stats.push( this.mp );
		stats.push( this.fa );
		stats.push( this.ma );
		stats.push( this.fd );
		stats.push( this.md );
		
		var result = { s: items.join("."), e: stats.join("."), n: encodeURIComponent(this.name) };
		if( 0 != dbId ) result['i'] = dbId;
		return result;
	}
	
	
	this.deserialize = function( id, data )
	{
		dbId = id;
		var i = 0;
		this.idOwner = data[i++];
		this.name = data[i++];
		this.title = data[i++];
		this.degree = data[i++];		
		this.karma = data[i++];
		i+=2; // spec & level are derived;

		this.baseEl.f1	=	data[i++];
		this.baseEl.f2	=	data[i++];
		this.baseEl.f3	=	data[i++];
		this.baseEl.f4	=	data[i++];
		this.baseEl.m1	=	data[i++];
		this.baseEl.m2	=	data[i++];
		this.baseEl.m3	=	data[i++];
		this.baseEl.m4	=	data[i++];
				
		i+=8; // total Els are derived;
		i+=6;	// hp ... md are derived;

		for( var j = 0; j < SLOT_COUNT; j++ )
		{
			slot[j].id[0] = data[i+j] % 100000;
			slot[j].id[1] = Math.floor(data[i+j] / 100000);			
		}
		
	}
};
