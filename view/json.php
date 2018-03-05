<?php 

	class JSon
	{
		static function out( $dt, $ids ) 
		{
			// all we do - point at input dts and dump everything fetched from db
			$jsa = array();
			$jsa[] = '"show_datatype":"'.$dt.'"';
			$jsa[] = '"show_id":['.implode(",", $ids)."]";
			$jsa[] = '"logged_as":'.State::getUID();

			$data = array();
			$data[] = Character::globalJSon();
			$data[] = Fit::globalJSon();
			$data[] = Item::globalJSon();

			$jsa[] = "\"data\":{\n".implode(",",$data)."\n}";
			echo makeArray($jsa);
		}
		
		static function encode( $object ) 
		{
			return json_encode( $object );
		}
		
		static function makeArray( $arr, $br = 0 )
		{
			if ( $br == 1 ) 
				return "[\n".implode(",",$arr)."\n]";
			if ( $br > 2 ) 
				return "[\n".implode(",\n",$arr)."\n]";
			else
				return "[".implode(",",$arr)."]";
		}
		
		static function makeObj( $arr, $br = 0 )
		{
			if ( $br == 1 ) 
				return "{\n".implode(",",$arr)."\n}";
			if ( $br >= 2 ) 
				return "{\n".implode(",\n",$arr)."\n}";
			else
				return "{".implode(",",$arr)."}";

		}
		
	}

?>