// item.js 
;function CItem() {
	var id = [0, 0];
	var data = null;
//	this.debug_data = data
	var elemBonus = new CElements(); // bonus elementals 
	var elemReqs = new CElements(); // required elementals
	var gt_cost = 0;
	
	this.use_impl = function( _id, _prefix, new_data, _gt_cost )
	{
		id[0] = _id;
		id[1] = _prefix;
		data = new_data;
		elemReqs.read( data[17] );
		elemBonus.read( data[30] );
		gt_cost = arguments.length < 4 ? 0 : _gt_cost;
		return this;
	}
	this.use = function( _id, _prefix )
	{
		var new_data = Game.DB.getItemRaw( _id, _prefix );
		if ( new_data == null ) return this.nullify();
		var cost = Game.DB.getGtCost( _id, _prefix ); 
		return this.use_impl ( _id, _prefix, new_data, cost );
	}
	this.getCostGt = function() { return gt_cost; }

	this.isNull = function() { return data == null; } 
	this.nullify = function() { data = null; gt_cost = id[0] = id[1] = 0; elemReqs.C(); elemBonus.C(); return this }


	this.getId = function() { return id; };
	this.getPrefixLetter = function() { return data[1]; };
	this.hasPrefix = function() { return data[1] != ''; } 	
	this.getName = function() { return data[2]; };
	this.getIcon = function() { return data[3]; };
	this.getSlot = function() { return data[4]; };
	this.getRankPure = function() { return data[5]; };
	this.getRank = function() { return this.getReqSpecLevel() || this.getRankPure() || this.get_spec_lvl(); };
	this.get_peruse_hp = function() { return data[6]; };
	this.get_peruse_mp = function() { return data[7]; };
	this.getReqTitle = function() { return [ data[8], data[9] ]; }
	this.getReqDegree = function() { return [ data[10], data[11] ]; }
	this.getReqKarma = function() { return [ data[12], data[13] ]; }
	this.getReqSpec = function() { return data[14]; };
	this.getReqSpecLevel = function() { return data[15]; };
	this.getCastle = function() { return data[16] != 0; };

	this.hasDamage = function() { return data[18] != 0 || data[19] != 0 || data[20] != 0; }
	this.get_attack_fa = function() { return data[18]; };
	this.get_attack_ma = function() { return data[19]; };	
	this.get_attack_mam = function() { return data[20]; };	
	this.get_spread = function() { return data[21]; }
	this.get_hp_give = function() { return data[22]; };
	this.get_mp_give = function() { return data[23]; };	
	this.get_hp_2m = function() { return data[24]; };
	this.get_mp_2m = function() { return data[25]; };	
	this.get_spec = function() { return data[26]; };
	this.get_spec_lvl = function() { return data[27]; };
	this.get_fd = function() { return data[28]; };
	this.get_md = function() { return data[29]; };	

	this.get_hp = function() { return data[31]; };
	this.get_mp = function() { return data[32]; };	
	this.get_fa = function() { return data[33]; };
	this.get_ma = function() { return data[34]; };	

	this.isWeapon = function() { return this.getSlot() == 11; } 
	this.getDelay = function() { return data[37]; };
	this.getCooldown = function() { return data[38]; };
	this.getDistance = function() { return data[39]; };
	this.getDistanceAE = function() { return data[40]; };
	this.getMutatorIcon = function () { return data[42]; }
	this.getMutatorLen = function () { return data[43]; }
	this.hasMutator = function() { return data[42] != ''; }
	this.getMutatorDescr = function() { return data[44]; } 

	this.getBonusElements = function() { return elemBonus; } 
	this.getRequiredElements = function() {  return elemReqs; }

	
	this.toString = function() { 
		return data.toString();
	}
	
	this.isSameFamilyAs = function( otheritem )
	{
		if ( null == otheritem || otheritem.isNull() ) return false;
		// для спец-вещей сравнение по специальности и слоту
		if ( this.getReqSpec() != 0 && this.getReqSpec() == otheritem.getReqSpec() && this.getSlot() == otheritem.getSlot() ) return true;
		// для самих специальностей сравнение
		if ( 0 != this.get_spec() && this.get_spec() == otheritem.get_spec() ) return true;
		// по префиксу и слоту
		if ( '' != this.getPrefixLetter() && this.getPrefixLetter() == otheritem.getPrefixLetter() && this.getSlot() == otheritem.getSlot() ) return true;
		// для остальных вещей по иконке
		return this.getIcon() == otheritem.getIcon();
	}

	this.fitsToSlot = function( slotid )  {
		var item_slot = this.getSlot();
		switch( slotid )
		{
			case 0: 
				if ( item_slot == 11 ) return true; // always ok for weapon
				if ( item_slot == 12 || item_slot == 13 ) return this.hasDamage(); // powder & mantra
				return false;
			case 1: return item_slot == 6;			// helm
			case 2: return item_slot == 1;			// amulet
			case 3: return item_slot == 2;			// chest	
			case 4: return item_slot == 3;			// belt		
			case 5: return item_slot == 7;			// pants	
			case 6: return item_slot == 9;			// boots		
			case 7:
			case 8:	
			case 9:
			case 10: return item_slot == 8;			// rings
			case 11:
			case 12: return item_slot == 4;			// braces	
			case 13: return item_slot == 5;			// gloves
			case 14: return item_slot == 10;			// shield		
			case 15: return item_slot == 17;			// spec	
			case 16: case 17: case 18: case 19: 
				return item_slot == 15 && slotid % 4 == ( ( id[0] >= 5104 && id[0] <= 5107 ) ? id[0] % 4 : (id[0]-1) % 4 ) ; // crystals
		}
		if ( slotid >= 30 ) return true;
		// cases 20+ remain:
		return this.hasMutator();
	}
};
