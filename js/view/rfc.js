// JavaScript Document
function CRfc(api_url) { 
	var idUser = 0;
	var queryData = {};
	
	this.authCookie = function() {
		$.getJSON( api_url, {a:5}, onAuthReceived )
	}
	
	this.saveCharacter = function() 
	{
		var character = getView().getCharacter();
		if ( getView().getUserInfo().isLoggedIn() )
		{
	//		alert( "Не-не-не, не надо пока сохранять, а то базу скукожит");
			get( 11, character.serialize(), onCharacterSaved, character )	
		}
		else
			alert( "Пока Вы не зарегистрировались на форуме, сохранение персонажей невозможно.\n\n/Это сообщение будет заменено на более подходящее через время/" );
	}
	this.loadCharacter = function(id) 
	{
		get( 10, { i:id }, onCharacterLoaded, getView().getCharacter() );
	}
	this.listCharacters = function()
	{
		get( 21, null, onCharacterListLoaded );
	}
	
	
	function get( opCode, queryObj, handler, extra )
	{
		if ( queryObj == null || typeof queryObj != "object" ) 
			queryObj = {};
		var d = new Date();
		var queryId = d.getTime() % 600000; // will not wait for server for more than 10 minutes
		queryObj['a'] = opCode;
		queryObj['ts'] = queryId;
		queryData[queryId] = { 'data': ( arguments.length <= 3 ? {} : extra ) };
		queryData[queryId]['handler'] = handler;
		$.getJSON( api_url, queryObj, onAjaxComplete )			
	}
	
	function onAjaxComplete( data )
	{
		var queryId = data['ts'];
		if ( undefined == queryData[queryId] )
		{
			// WTF!! Throw an exception here
			return;
		}
		var queryExtra = queryData[queryId];
		var handler = queryExtra.handler;
		delete queryData[queryId];
		delete data['ts'];
		handler(data, queryExtra.data);
	}

	function onCharacterListLoaded( data ) 
	{
		console.log( data );
		
		// 1. Deserialize all characters we get.
		// 2. Set listView to character view mode
	}


	function onAuthReceived( data ) 
	{
		if ( data['auth'][0] > 0 ) 
			$("#userinfo").html( Template.use( "welcome", data['auth'][0], data['auth'][1] ) );
		else
			$("#userinfo").html( Template.use( "welcome_stranger" ) );		
	}
	
	function onCharacterSaved( data, character )
	{
		for( var id in data.character ) 
		{
			character.setDbId(id);
			break;
		}
	}
	
	function onCharacterLoaded( data, character )
	{
		var gotSome = false;
		// do not expect more than one character, but need to learn its id
		for( id in data.character )
		{
			character.deserialize( id, data.character[id] );
			character.Update();
			gotSome = true;
		}
		if ( gotSome ) 
		{
			getView().Update();
		}
		else
		{ 
			// error 
		}
		
	}
	
	
}