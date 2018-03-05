<?php

if (!defined("DOLL_VERSION")) {
    die ("Sorry! You cannot access this file directly.");
}

define ( 'NO_INDEX_YET', 0 );

class DB
{
	static $debug = false;
//	static $debug = true;	
	private static $connected = 0;
	private static $err = 0;
	private static $err_msg = "";
	private static $db_conn;
	static function connect()
	{
		self::$db_conn = @mysql_connect( DBHOST, DBUSER, DBPASS );
		if ( 0 != ($err = mysql_errno()) ) 
			return;
		mysql_select_db( DBNAME, self::$db_conn );
		if ( 0 == ($err = mysql_errno()) ) 
			self::$connected = 1;
		self::onConnect();
	}
	static function connectAfterForum()
	{
		// At this point we do have a coonnection to forum DB, but need to switch to game-raleated DB
		mysql_select_db( DBNAME );
		if ( 0 == ($err = mysql_errno()) ) 
			DB::$connected = 1;
		self::onConnect();	
	}	
	static function onConnect() {
		mysql_query("SET NAMES 'utf8';");	
	}
	static function getError()
	{
		return self::$err." : ".self::$err_msg;
	}
	private static function logQuery( $query )
	{
		if( DB::$debug ) 
			echo $query./*"<br/>".*/"\n";
	}
	private static function isError()
	{
		if ( 0 != ( DB::$err = mysql_errno() ) )
			self::$err_msg = mysql_error();			
		else 
			return false;
		return true;
	}
	
	// Common database functions 
	static function select( $query ) 
	{
		self::logQuery( $query ); 
		$qr = mysql_query( $query );		
		if ( self::isError() )
			return;
		$result = array();
		for ($i = 0; $i < mysql_num_rows( $qr ); $i++ )
			$result[] = mysql_fetch_row( $qr );
		if( DB::$debug ) echo " ... ".count($result)." rows colleted.\n";
		return $result;	
	}
	static function insert( $query )
	{
		self::logQuery( $query ); 
		mysql_query( $query );
		if ( self::isError() ) { 
			// handle errors here!	
			echo self::$err_msg."\n";
		}

		$old_debug = DB::$debug;
		DB::$debug = false;
		$id = DB::select("SELECT LAST_INSERT_ID()");
		DB::$debug = $old_debug;
		return $id[0][0];	
	}
	static function delete( $query )
	{
		self::logQuery( $query ); 
		mysql_query( $query );
		if ( self::isError() ) { 
			// handle errors here!	
		}	
	}
	static function update( $query )
	{
		self::logQuery( $query ); 
		mysql_query( $query );
		if ( self::isError() ) { 
			// handle errors here!	
		}			
	}
}
?>