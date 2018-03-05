// elements.js
function CElements() { 
	this.read = function( new_data )
	{
		if ( new_data.length == 0 ) 
		{
			this.C();
			return;
		}
			
		this.f1 = new_data[0];
		this.f2 = new_data[1];
		this.f3 = new_data[2];
		this.f4 = new_data[3];		
		this.m1 = new_data[4];
		this.m2 = new_data[5];
		this.m3 = new_data[6];
		this.m4 = new_data[7];				
	}

	this.C = function() { 
		this.f1 = this.f2 = this.f3 = this.f4 = 0;
		this.m1 = this.m2 = this.m3 = this.m4 = 0;
	};
	this.C();
	
	this.add = function( el, scale ) 
	{
		if ( undefined == scale ) scale = 1;
		this.f1 += Math.floor(el.f1 * scale);
		this.f2 += Math.floor(el.f2 * scale);
		this.f3 += Math.floor(el.f3 * scale);
		this.f4 += Math.floor(el.f4 * scale);		
		this.m1 += Math.floor(el.m1 * scale);
		this.m2 += Math.floor(el.m2 * scale);
		this.m3 += Math.floor(el.m3 * scale);
		this.m4 += Math.floor(el.m4 * scale);		
	}

	this.raise = function( el ) 
	{
		this.f1 = Math.max( el.f1, this.f1 );
		this.f2 = Math.max( el.f2, this.f2 );
		this.f3 = Math.max( el.f3, this.f3 );
		this.f4 = Math.max( el.f4, this.f4 );		
		this.m1 = Math.max( el.m1, this.m1 );
		this.m2 = Math.max( el.m2, this.m2 );
		this.m3 = Math.max( el.m3, this.m3 );
		this.m4 = Math.max( el.m4, this.m4 );		
	}
	
	this.isMoreOrEqualThan = function ( el ) 
	{
		return ( el.f1 == 0 || this.f1 >= el.f1 ) && ( el.f2 == 0 || this.f2 >= el.f2 ) && 
					 ( el.f3 == 0 || this.f3 >= el.f3 ) && ( el.f4 == 0 || this.f4 >= el.f4 ) && 
					 ( el.m1 == 0 || this.m1 >= el.m1 ) && ( el.m2 == 0 || this.m2 >= el.m2 ) && 
					 ( el.m3 == 0 || this.m3 >= el.m3 ) && ( el.m4 == 0 || this.m4 >= el.m4 );
	}
};