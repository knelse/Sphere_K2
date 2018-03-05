<?php 
	// cons: define is globally seen =( consts are incapsultaed in class =)
	// pros: define can be defined one through another =) const's cannot =( 

	define( 'CHAR_ID', 0 );
	define( 'CHAR_OWNER_ID', 1 );
	define( 'CHAR_NAME', 2 );
	define( 'CHAR_VERSION', 3 );		// version of server/client when record was saved
	define( 'CHAR_TIMESTAMP', 4 );  // last record modification :)

	define( 'CHAR_STAT', 5 );
	define( 'CHAR_TITLE', 0 + CHAR_STAT );
	define( 'CHAR_DEGREE', 1 + CHAR_STAT );
	define( 'CHAR_KARMA', 2 + CHAR_STAT );
	define( 'CHAR_SPEC', 3 + CHAR_STAT );
	define( 'CHAR_SPEC_LEVEL', 4 + CHAR_STAT );

	define( 'CHAR_BASE_STAT', CHAR_STAT + 5 );							// base f1-f4. m1-m4
	define( 'CHAR_EFFECTIVE_STAT', CHAR_BASE_STAT + 8 );		// effective (with items) f1-f4, m1-m4
	define( 'CHAR_STAT_COMBAT', CHAR_EFFECTIVE_STAT + 8);
	define( 'CHAR_HP', 0 + CHAR_EFFECTIVE_STAT);
	define( 'CHAR_MP', 1 + CHAR_EFFECTIVE_STAT);
	define( 'CHAR_FA', 2 + CHAR_EFFECTIVE_STAT);
	define( 'CHAR_MA', 3 + CHAR_EFFECTIVE_STAT);
	define( 'CHAR_FD', 4 + CHAR_EFFECTIVE_STAT);
	define( 'CHAR_MD', 5 + CHAR_EFFECTIVE_STAT);	
	
	define( 'CHAR_SLOT', CHAR_STAT_COMBAT + 6);
	define( 'CHAR_SLOT_COUNT', 37 );

	define( 'CHARACTERS_TABLE', '`character`' );
	
		
	class Character {
		
		var $row;
		static $columns = array( 'id', 'id_owner', 'name', 'version', 'timestamp', 'title', 'degree', 'karma', 'spec', 'spec_lvl', 'f1b', 'f2b', 'f3b', 'f4b', 'm1b', 'm2b', 'm3b', 'm4b', 'f1', 'f2', 'f3', 'f4', 'm1', 'm2', 'm3', 'm4', 'hp', 'mp', 'fa', 'ma', 'fd', 'md', 's0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 's11', 's12', 's13', 's14', 's15', 's16', 's17', 's18', 's19', 's20', 's21', 's22', 's23', 's24', 's25', 's26', 's27', 's28', 's29', 's30', 's31', 's32', 's33', 's34', 's35', 's36' );
		// cache loaded entities here
		static $all = array();
		
		// accessor for cached loading
		static function Get($id) {
			if ( isset( self::$all[$id] ) )
				return self::$all[$id];
			else
			{
				$char = new Character();
				$char->load($id);
				if ( $char-> hasId() ) 
					return $char;
				else 
					return 0;
			}
		}

		function Character()
		{
			$this->row = array();
			$this->row[CHAR_ID] = NO_INDEX_YET;
		}

		function create( $name, $stats, $items )
		{
			$this->row[CHAR_OWNER_ID] = getUser()->getId();
			$this->setName( $name );
			// have to fill array in numbers order to allow a simple impl0de at INSERTion point
			$this->row[CHAR_VERSION] = DOLL_VERSION;
			$this->row[CHAR_TIMESTAMP] = time();			
			
			$this->modify( $stats );
			$this->dressup( $items );
			$this->save();
		}
		
		function modify( $stats )
		{
			for( $i = 0; $i < CHAR_SLOT-CHAR_STAT; $i++ )
				if( count($stats) > $i ) 
					$this->row[$i+CHAR_STAT] = intval($stats[$i]);
				else
					$this->row[$i+CHAR_STAT] = 0; // should be reasonable defaults here
		}
		function dressup( $items )
		{
			for( $i = 0; $i < CHAR_SLOT_COUNT; $i++ )
			{
				if( count($items) > $i ) 
					$this->row[CHAR_SLOT + $i] = intval($items[$i]);
				else
					$this->row[CHAR_SLOT + $i] = 0;
			}			
		}

		function setName( $name )
		{
			// check for injection here! 
			$this->row[CHAR_NAME] = addslashes($name);
		}
		
		function makeCopy()
		{
			$this->row[CHAR_ID] = NO_INDEX_YET;
			$this->row[CHAR_OWNER_ID] = getUser()->getUID();	
			$this->save();			
		}

		static function getDataType() { return 'character'; }
		
		function getId()    { return $this->row[CHAR_ID]; }
		function hasId()  	{ return $this->row[CHAR_ID] != NO_INDEX_YET; }
		function getOwner() { return $this->row[CHAR_OWNER_ID]; }
		function getName()  { return $this->row[CHAR_NAME]; }
		function getVersion()  { return $this->row[CHAR_VERSION]; }		

		function save()
		{
			if ( $this->hasId() )
				$this->update();
			else
				$this->register();
		}

		// persistence functions
		private function register()
		{
			$value = '(0,'.getUser()->getId().",'".addslashes($this->getName())."',".implode(",", array_slice( $this->row, 3 ) ).')';
			$query = 'INSERT INTO '.CHARACTERS_TABLE.' VALUES '.$value;
			$this->row[CHAR_ID] = DB::insert($query);
			self::$all[$this->row[CHAR_ID]] = $this;
		}
		private function update()
		{
			$toset = array();
			
			$this->row[CHAR_VERSION] = DOLL_VERSION;
			$this->row[CHAR_TIMESTAMP] = time();
			
			for( $i = 2; $i < count(self::$columns); $i++ )
				$toset[] = self::$columns[$i].'='.(is_numeric($this->row[$i]) ? $this->row[$i] : "'".addslashes($this->row[$i])."'" );
			$toset = ' SET '.implode(", ",$toset);
			$where = ' WHERE id_owner='.getUser()->getId().' AND id='.$this->getId();
			$query = 'UPDATE '.CHARACTERS_TABLE.$toset.$where; 
			DB::update($query);
		}
		private function deserialize( $row )
		{
				$this->row = $row;
				$this->row[CHAR_NAME] = stripslashes($this->row[CHAR_NAME]);
				self::$all[$this->row[CHAR_ID]] = $this;		
		}
		
		private function load( $id )
		{
			$query = "SELECT * FROM ".CHARACTERS_TABLE." WHERE id = $id";
			$row = DB::select( $query );
			if ( count( $row ) > 0 ) 
			{
				$this->deserialize($row[0]);
			}
			else { /* Handle errors  */ }
		}
		public static function massLoad( $condition )
		{
			$query = "SELECT * FROM ".CHARACTERS_TABLE." WHERE $condition";
			$row = DB::select( $query );
			$res = array();
			for( $i = 0; $i < count($row); $i++ )
			{
				$c = new Character();
				$c->deserialize( $row[$i] );
				$res[] = $c;
			}
			return $res;
		}
		public static function getCharactersForUser( $uid ) 
		{
			return self::massLoad( " id_owner = ".$uid );
		}
				
		static function deleteById( $id )
		{
			$query = "DELETE FROM ".CHARACTERS_TABLE." WHERE id = $id AND id_owner=".getUser()->getUID();
			return self::delete( $query );
			unset( self::$all[$id] );
		}
		// json for client
		function json()
		{
			$jsa = array();
			array_push( $jsa, /* $this->getId(), */ $this->getOwner(), enquote($this->getName()) );
			$jsa = array_merge( $jsa, array_slice($this->row,CHAR_STAT) );
			return $this->getId().":[".implode(',',$jsa)."]";
		}
		static function massJson( $data )
		{
			$jsa = array();
			for( $i = 0; $i < count( $data ); $i++ )
				$jsa[] = $data[$i]->json();
			return "{\n".implode(",\n", $jsa)."\n}"; 			
		}
		
		static function globalJSon( $use_datatype = false )
		{
			$jsa = array();
			$keys = array_keys( self::$all );
			for ( $i = 0; $i < count($keys); $i++ )
				$jsa[] = self::$all[$keys[$i]]->json();
			return ( $use_datatype ? self::getDataType().":{\n" : "{\n" ).implode(",\n", $jsa)."\n}"; 
		}
		
	}

?>