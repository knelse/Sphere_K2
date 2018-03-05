// JavaScript Document
;function CUser( auth )
{
	var uid = auth[0];
	var uname = auth[1];
	
	function constructor()
	{
		if ( uid ) 
			$("#userinfo").html(Template.use("welcome", uid, uname ));
	}
	this.isLoggedIn = function()
	{
		return uid != 0;
	}
	
	this.getMaxCharacters = function() 
	{
		return auth[2];
	}
	
	this.toString = function() 
	{
		return uid+':'+uname+"="+auth[2];
	}
	
	constructor();
}