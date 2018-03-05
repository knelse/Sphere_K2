<?php

	define( 'DOLL_VERSION', 20000 );
	// forum authorization
	require_once('config.php');
	require_once('controller/forum/smf.php');
	require_once('model/class.user.php');
	// 1. Auth - see who is coming
	User::init($member);
	
	// Database required always
	require_once('controller/db.php');
	
	// helpers, unsorted
	require_once('util/misc.php');
	require_once('view/json.php');
	
	// set up the connection
	DB::connect();
	
	//echo DB::getError();
	
	// 2. Perform operations 
	header('Content-type: text/plain; charset=utf-8');

	// Opcode definitions
	require_once('controller/opcodes.php');
	$opcode = getGet("a", 0);
	
	// array to hold script results
	$res = array();	
	$res[] = "opcode:".$opcode;	
	// ts is time-stamp to let front-end understand which answer has just been recieved
	$res[] = "ts:".getGet("ts", 0);		

//	require_once('model/class.item.php');
	require_once('model/class.character.php');
	execute( $opcode, $res );

	// 4. Apply template to show it
	// if we had no rich front-end there would be a template.
	
	// 5. Send to browser
	echo Json::makeObj( $res, 0 );
	
	
?>