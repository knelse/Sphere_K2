// JavaScript Document
;function CUserInfo( auth )
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
	
	constructor();
}