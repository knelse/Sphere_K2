// db.js
;function CDB() {
	var CItemTable = function ()  { // yes... would like to use template here, but... this is Javascript! (Sparta)
		// cacheing and hit/misses table to be added for the online version
		var cache = [];
		var items = [];
		var prefix; 
		var effect = [ 0, 1, 2, 3, 5, 7, 9, 12, 15, 18, 23, 28, 34, 37, 42, 48 ];
		
		this.extendTable = function( items_unsorted ) 
		{
			for( var i = 0; i < items_unsorted.length; i++ )
				items[items_unsorted[i][0]] = items_unsorted[i];
		}
		this.setupPrefix = function( _prefix ) { prefix = _prefix; } 
		this.getSingle = function( i0, i1 ) 
		{
			if ( arguments.length == 0 || i0 == 0 || items[i0] == undefined ) return null;
			if ( arguments.length < 2 || i1 == 0  ) return items[i0];
			// check bounds for out-of-prefix-table shots
			var prefixline = prefix[items[i0][1]];
			if ( cache[i0] == undefined ) cache[i0] = [];
			if ( cache[i0][i1] == undefined ) cache[i0][i1] = generateItem( items[i0], prefixline[i1-1] );
			return cache[i0][i1];
		}

		function generateItem( baseItem, prefix )
		{
			var result = [].concat( baseItem ), i = 0, e = effect[baseItem[5]], chest = (result[4]==2 || result[4]==10);
			result[17] = [].concat( baseItem[17] );
			result[30] = [].concat( baseItem[30] );
			
			result[2] += ' ' + prefix[0];	
			result[6] += chest ? 0 : e*prefix[1];	
			result[7] += e*prefix[2];				

			if ( prefix[3].length )
			{
				if (!result[17].length)	
					result[17] = [0,0,0,0,0,0,0,0];
				for( i = 0; i < 8; i++ )
					result[17][i] += chest && prefix[1] && (0 == result[17][i]) ? 0 : e*prefix[3][i]; 
			}
			result[18] -= e*prefix[4];	 // fa
			result[19] -= e*prefix[5];	 // ma
			result[20] -= e*prefix[6];	 // mam		
			result[21] += prefix[7];	 // spread		
			result[28] += e*prefix[8];	 // fz
			result[29] += e*prefix[9];	 // mz			
			if ( prefix[10].length )
			{
				if (!result[30].length)	
					result[30] = [0,0,0,0,0,0,0,0];
				for( i = 0; i < 8; i++ )
					result[30][i] += e*prefix[10][i]; 
			}
			result[31] += e*prefix[11]; //hp
			result[32] += e*prefix[12];  //mp
			result[33] -= e*prefix[13]; // fa
			result[34] -= e*prefix[14];	 // ma		
			result[35] *= (100+prefix[15])/100;	// weight
			result[36] *= (100+prefix[16])/100; // dur
			result[37] = Math.round(result[37]*(100+prefix[17])/10)/10;	// delay
			result[38] += prefix[18]; //cool-d
			result[39] += prefix[19]; // 
			// price skipped
			result[42] = prefix[21];			
			result[43] = prefix[22];			
			result[44] = prefix[23];
			return result;
		}
	};
	
	var CBookmarks = function() {
		var data = {};
		// get all items? (bk_id)
		
		this.loadJSon = function( obj ) 
		{
			data = obj;
			data[0] = [ null ];
		};	
		this.getSingle = function() { return data[arguments[0]]; };		
		this.isDefined = function() { return undefined != data[arguments[0]]; };
	};
	
	var CCostGT = function() {
		var data = null; 
		this.setup = function( _data ) 
		{
			data = _data;
		}
		this.get = function( id, prefix ) 
		{
			if ( data[id] == undefined ) return 0;
			if ( typeof(data[id]) == 'number' ) return data[id];
			if ( data[id][prefix] == undefined ) return 0;
			return data[id][prefix];
		}
	}
	
	this.ItemGroups = new CBookmarks();
	this.Items = new CItemTable();
	this.CostGt = new CCostGT();
	this.getItemRaw = function() { return this.Items.getSingle.apply( this.Items, arguments ); }
	this.getGroup = function() { return this.ItemGroups.getSingle( arguments[0] ); };
	this.getGtCost = function() { return this.CostGt.get.apply( this.CostGt, arguments ); } 
};