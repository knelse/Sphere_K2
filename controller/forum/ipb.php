<?php
define( 'IPB_THIS_SCRIPT', 'public' );
define( 'IPB_LOAD_SQL'   , 'queries' );

define( 'ROOT_PATH', "../forum/" );
define ( 'USE_SHUTDOWN', '0');
define( 'KERNEL_PATH'  , ROOT_PATH.'ips_kernel/' );
define( 'LEGACY_MODE', 0 );
define ( 'USE_MODULES', 1 );
define( 'CUSTOM_ERROR', 1 );
define( 'TRIAL_VERSION', 0 );
define( 'IPBVERSION', "Spheretest: Reborn" );
define( 'IPB_LONG_VERSION', "2.3.4" );
define( 'IPS_MEMORY_DEBUG_MODE', 0 );
@set_magic_quotes_runtime(0);
error_reporting  (E_ERROR | E_WARNING | E_PARSE);
define ( 'IN_IPB', 1 );
define ( 'IN_ACP', 1 );
define ( 'IN_DEV', 0 );

define ( 'SAFE_MODE_ON', 0 );
define ( 'IPB_INIT_DONE', 1 );

$INFO = array();
require_once ROOT_PATH   . "sources/ipsclass.php";
require_once ROOT_PATH   . "sources/classes/class_session.php";
require_once ROOT_PATH   . "conf_global.php";
$ipsclass       = new ipsclass();
$ipsclass->vars = $INFO;
$ipsclass->init_db_connection();
$ipsclass->sess             =  new session();
$ipsclass->sess->ipsclass   =& $ipsclass;
$ipsclass->member     = $ipsclass->sess->authorise();
$ipsclass->session_id = $ipsclass->sess->session_id; // Used in URLs
$ipsclass->my_session = $ipsclass->sess->session_id; // Used in code
$ipsclass->md5_check = $ipsclass->return_md5_check();
if ( $ipsclass->session_type == 'cookie' )
{
	$ipsclass->session_id = "";
	$ipsclass->base_url   = $ipsclass->vars['board_url'].'/index.'.$ipsclass->vars['php_ext'].'?';
}
else
{
	$ipsclass->base_url = $ipsclass->vars['board_url'].'/index.'.$ipsclass->vars['php_ext'].'?s='.$ipsclass->session_id.'&amp;';
}
error_reporting  (E_ALL);
// ----------------------------------- Database interface -------------------

function isRegistered()
{
	global $ipsclass;
	return $ipsclass->member['id'] != 0;
}
function getMemberID()       
{
	global $ipsclass;
	return $ipsclass->member['id'];
}

function isMemberAdmin()       
{
	global $ipsclass;
	return $ipsclass->member['mgroup'] == $ipsclass->vars['admin_group'];
}

function isMemberValidating()       
{
	global $ipsclass;
	return $ipsclass->member['mgroup'] == 1;
}


?>
