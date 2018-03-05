<?php
	function getGet($param , $default = 0)
	{
		return array_key_exists($param, $_GET ) ? $_GET[$param] : $default;
	}
	
	function enquote($item)
	{
		$result = "\"".str_replace('"', '\\"', $item)."\"";
		return str_replace(array(chr(13).chr(10),chr(13),chr(10)), '\n', $result );
	}
?>