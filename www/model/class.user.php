<?php
	class User
	{
		private $member;
		private	static $instance;
		
		static function init( $member )
		{
			$c = __CLASS__;
			self::$instance = new $c( $member );
		}
		
		private function User( $member_ )
		{
			$this->member = $member_;
		}
		
    static function getInstance()
    {
	    if (!isset(self::$instance)) 
        die( "User class instance should have been initialized before you access it");
      return self::$instance;
    } 
		
		function isSuperUser()
		{
			return $this->member['mgroup'] == 1;
		}
		
		function isMember()
		{
		  return $this->member['id'] != 0; 
		}
		
		function getId() 
		{
			return $this->member['id'];
		}
		
		function getJsonAuth()
		{
			$result = array( $this->member['id'], enquote($this->member['name']), $this->getMaxCharacters() );
			return Json::makeArray($result);
		}
		
		function getMaxCharacters() 
		{
			// promo for all who regged before oct 18
			return $this->getId() <= 25 ? 5 : 3;
		}
		
	}
	
	
	function getUser() 
	{
		return User::getInstance();
	}


?>