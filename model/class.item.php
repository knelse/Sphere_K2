<?php 

	define ('ITEM_ID', 0);
	define ('ITEM_ID_ITEM', 1);
	define ('ITEM_ID_PREFIX', 2);
	define ('ITEM_NAME', 3);
	define ('ITEM_ICON', 4);
	define ('ITEM_SLOT', 5);
	define ('ITEM_RANK', 6);
	define ('ITEM_PREFIX_TYPE', 7);
	define ('ITEM_USE_HP', 8);
	define ('ITEM_USE_MP', 9);
	define ('ITEM_REQ_TITLE_MIN', 10);
	define ('ITEM_REQ_TITLE_MAX', 11);
	define ('ITEM_REQ_DEGREE_MIN', 12);
	define ('ITEM_REQ_DEGREE_MAX', 13);
	define ('ITEM_REQ_KARMA_MIN', 14);
	define ('ITEM_REQ_KARMA_MAX', 15);
	define ('ITEM_REQ_GUILD', 16);
	define ('ITEM_REQ_GUILD_LVL', 17);
	define ('ITEM_CASTLE', 18);
	define ('ITEM_REQ_F1', 19);
	define ('ITEM_REQ_F2', 20);
	define ('ITEM_REQ_F3', 21);
	define ('ITEM_REQ_F4', 22);
	define ('ITEM_REQ_M1', 23);
	define ('ITEM_REQ_M2', 24);
	define ('ITEM_REQ_M3', 25);
	define ('ITEM_REQ_M4', 26);
	define ('ITEM_EFF_FA_MIN', 27);
	define ('ITEM_EFF_FA_MAX', 28);
	define ('ITEM_EFF_MA_MIN', 29);
	define ('ITEM_EFF_MA_MAX', 30);
	define ('ITEM_EFF_MAM_MIN', 31);
	define ('ITEM_EFF_MAM_MAX', 32);
	define ('ITEM_EFF_HEAL', 33);
	define ('ITEM_EFF_PRANA', 34);
	define ('ITEM_EFF_HEAL2', 35);
	define ('ITEM_EFF_PRANA2', 36);
	define ('ITEM_ADD_GUILD', 37);
	define ('ITEM_ADD_GUILD_LVL', 38);
	define ('ITEM_ADD_FZ', 39);
	define ('ITEM_ADD_MZ', 40);
	define ('ITEM_ADD_F1', 41);
	define ('ITEM_ADD_F2', 42);
	define ('ITEM_ADD_F3', 43);
	define ('ITEM_ADD_F4', 44);
	define ('ITEM_ADD_M1', 45);
	define ('ITEM_ADD_M2', 46);
	define ('ITEM_ADD_M3', 47);
	define ('ITEM_ADD_M4', 48);
	define ('ITEM_ADD_HP', 49);
	define ('ITEM_ADD_MP', 50);
	define ('ITEM_ADD_FA', 51);
	define ('ITEM_ADD_MA', 52);
	define ('ITEM_WEIGHT', 53);
	define ('ITEM_DUR', 54);
	define ('ITEM_DELAY', 55);
	define ('ITEM_RECHARGE', 56);
	define ('ITEM_DIST', 57);
	define ('ITEM_DIST_AE', 58);
	define ('ITEM_PRICE', 59);
	define ('ITEM_MUTATOR', 60);
	define ('ITEM_MUTATOR_LEN', 61);
	define ('ITEM_MUTATOR_NAME', 62);
	define ('ITEM_DESCR', 63);

	define( 'ITEM_TABLE', '`item`' );
	

	class Item // read only 
	{	
		var $row; 	
		static $all = array();
		
		private function Item()
		{
			$this->row = array();
			$this->row[ITEM_ID] = NO_INDEX_YET;
		}

		static function getDataType() { return 'item'; }
		
		function getId()    { return $this->row[ITEM_ID]; }		
		
		// accessor for cached loading
		static function Get($id) {
			if ( isset( self::$all[$id] ) )
				return self::$all[$id];
			else
			{
				$item = new Item();
				$item->load($id);
				return $item;
			}
		}
		private function load( $id )
		{
			$query = "SELECT * FROM ".ITEM_TABLE." WHERE id = $id";
			$row = DB::select( $query );
			if ( count( $row ) > 0 ) 
			{
				$this->deserialize( $row[0] );
			}
			else { /* Handle errors  */ }
		}		
		static function massGet($ids) {
			$toLoad = array();
			foreach ( $ids as $i ) 
				if ( !isset( self::$all[$i] ) ) $toLoad[] = $i;
			self::massLoad( array_unique( $toLoad ) );
		}
		private static function massLoad( $ids )
		{
			$query = "SELECT * FROM ".ITEM_TABLE." WHERE id IN (".implode(',',$ids).")";
			self::massDeserialize( DB::select( $query ) );
		}
		private static function getGroup( $gid ) 
		{
			$query = "SELECT i.* FROM ".ITEM_TABLE." i, ".ITEM_GROUP_TABLE." g WHERE i.id_item >= g.id_from and i.id_item <= g.id_till and g.id = ".$gid;
			massDeserialize( DB::select( $query ) );			
		}
		private static function massDeserialize( $mysql_rows )
		{
			foreach ( $mysql_rows as $r ) 			
				self::deserialize( $r );
		}
		
		private static function deserialize($row)
		{
				$item = new Item();
				$item->row = $row;
				// unescape strings
				$item->row[ITEM_NAME] = stripslashes( $item->row[ITEM_NAME] );
				// save in global cache
				self::$all[$item->row[ITEM_ID]] = $item;			
		}

		// json for client
		function json()
		{
			$jsa = array();
			foreach( $this->row as $thing )
				$jsa[] = is_numeric( $thing ) ? $thing : enquote($thing);
			return $this->getId().":[".implode(',',$jsa)."]";
		}
		static function globalJSon()
		{
			$jsa = array();
			$keys = array_keys( self::$all );
			for ( $i = 0; $i < count($keys); $i++ )
				$jsa[] = self::$all[$keys[$i]]->json();
			return enquote(self::getDataType()).":{\n".implode(",\n", $jsa)."\n}"; 
		}		
	}

?>