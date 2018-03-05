// display.js
var Display = {
	bonus: function( icon, value, scale ) 
	{
		if ( value == 0 ) return "";
		var dir = value > 0 ? "u" : "d"; 
		return scale == 1 ? Template.use('tooltipBonus', dir, icon, Math.abs(value) ) : Template.use('tooltipBonusPen', dir, icon, Math.floor( scale * Math.abs(value)), Math.abs(value) );
	},
	dot: function( icon, value ) 
	{
		if ( value == 0 ) return "";
		icon += ( value > 0 ? "g" : "t" ) ; 
		return Template.use('tooltipDoT', icon, Math.abs(value) );
	},
	req: function( icon, value, compare_value ) 
	{
		if ( value == 0 ) return "";
		if ( arguments.length <= 2 )
			return Template.use('tooltipReq', icon, value );
		else 
			return Template.use( ( value <= compare_value ? 'tooltipReqOk' : 'tooltipReqFail'), icon, value, compare_value );
	},
	damage: function( icon, value, spread ) 
	{
		if ( value == 0 ) return "";
		var d = value * ( 1 + spread ) /10;
		var v1 = Math.floor(value - d);
		var v2 = Math.ceil(value + d);
		return Template.use('tooltipDamage', '<img src="i/'+icon+'.gif">'+v1 + ' - '+ v2); 
	},
	peruse: function( icon, value ) 
	{
		if ( value == 0 ) return "";
		return Template.use('tooltipDamage', '<img src="i/'+icon+'.gif">'+Math.abs(value) ); 
	},
	lvlreq: function( icon, value, compare_value )
	{
		if ( value[0] != 0 ) return Template.use( ( value[0] <= compare_value ? 'tooltipReqOk' : 'tooltipReqFail'), icon, value[0], compare_value );
		if ( value[1] != 0 ) return Template.use( ( value[1] >= compare_value ? 'tooltipReqOk' : 'tooltipReqFail'), icon, '&lt;'+(1+value[1]), compare_value  );		
		return "";
	},
	mutator: function( icon, value ) 
	{
		if ( value >= 1 )
			return Template.use( 'tooltipMutatorHrs', icon, value );
		else
			return Template.use( 'tooltipMutatorMins', icon, Math.round( value * 100 ) );
	},
	dist: function( value, value_ae )
	{
		if ( value == 0 )  return "";
		if ( value_ae == 0 ) return Template.use( "tooltipDistance", value );
		return Template.use( "tooltipDistanceAE", value, value_ae );
	},
	descr: function( text ) { return text == "" ? text : Template.use ('tooltipDescr', text ); },
	delay: function( value ) { return value == 0 ? "" : Template.use('tooltipDelay', value ); },
	scale: function( value ) { return value == 0 ? "" : Template.use('tooltipMutatorPenalty', Math.floor( value * 100 ) ); },
	gt: function( value ) { return value == 0 ? "" : Template.use('tooltipGt', value ); }	
	
};