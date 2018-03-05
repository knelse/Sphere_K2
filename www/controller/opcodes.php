<?php 

define("CMD_SHOW_INDEX", 0); // (): no update, showWelcome()
define("CMD_ITEM_GROUP", 1); // (grid): no update, getItemsByGroup(grid)
define("CMD_ITEM_DETAILS", 2); // (id): no update, getItemById(id)

define("CMD_TRY_COOKIE_AUTH", 5 ); // ()

define("CMD_CHARACTER_SHOW", 10); // getCharacter(id)
define("CMD_CHARACTER_CREATE", 11); // (char_data): fid = createCharacter(char_data), getFit(fid)
define("CMD_CHARACTER_COPY", 18); // (pid): pid_n=copyChar(pid); (pid);removechar(pid), showCharacterDeletedScreen
define("CMD_CHARACTER_DELETE", 19); // (pid): removefits(pid);removechar(pid), showCharacterDeletedScreen

define("CMD_ACCOUNT_LIST_CHARACTERS", 21); //(uid): 

function execute( $opcode, &$res )
{
	switch( $opcode ) 
	{
		case CMD_TRY_COOKIE_AUTH:
			$res[] = "auth:".getUser()->getJsonAuth();
			break;
	
		case CMD_CHARACTER_SHOW:
			$char = Character::Get(intval(getGet("i", 0)));
			$res[] = Character::globalJSon( true );
			break;
	
		case CMD_CHARACTER_CREATE:
			if ( !getUser()->isMember() )
			{
				$res['error'] = "Guests cannot save characters";
				break;
			}
		
			// Get id - if exists, ok - modify then
			$id = intval(getGet("i", 0));
			if ( $id != 0 && $char = Character::Get( $id ) )
			{
				// character exists, proceed to modification
				define( 'BAD_NAME', "Upyachka!4o4o!Jivotnae!" );			
				$new_name = getGet("n", BAD_NAME );
				if ( $new_name != BAD_NAME )
					$char->setName($new_name);
				$char->modify( explode(".", getGet("e","")) );
				$char->dressup( explode(".", getGet("s","")) ); 
				$char->save();		
			}
			else // new character
			{
				// Check if account is allowed to create a character.
				$char = new Character();
				$char->create( getGet("n",""), explode(".", getGet("e","")), explode(".", getGet("s","")) );
			}
			// now should display the result
			$res[] = Character::globalJSon( true );
			break; 
				

		case CMD_ACCOUNT_LIST_CHARACTERS: 
			Character::getCharactersForUser(getUser()->getId());
			$res[] = Character::globalJSon( true );			
			break; 
		
		case CMD_CHARACTER_DELETE:
		
		case CMD_CHARACTER_COPY:
	}
}

?>