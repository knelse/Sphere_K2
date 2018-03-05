<?php
/*
+--------------------------------------------------------------------------
|   MkPortal
|   ========================================
|   by Meo aka Luponero <Amedeo de longis>
|      Don K. Colburn <visiblesoul.net>
|
|   Copyright (c) 2003-2008 mkportal.it
|   http://www.mkportal.it
|   Email: luponero@mclink.it
|
+---------------------------------------------------------------------------
|
|   > MKPortal
|   > Written By Amedeo de longis
|   > Date started: 9.2.2004
|
+--------------------------------------------------------------------------
*/
if (!defined("DOLL_VERSION")) {
    die ("Sorry! You cannot access this file directly.");
}

define('SMF', 1);
error_reporting(E_ALL);

$boarddir = FORUM_PATH."/";
$base_url = $boarddir."index.php";
$forum_url = FORUM_PATH;

include($boarddir . 'Settings.php');
define('DBPREFIX', $db_prefix);

require_once($sourcedir . '/QueryString.php');
require_once($sourcedir . '/Subs.php');
require_once($sourcedir . '/Errors.php');
require_once($sourcedir . '/Load.php');
require_once($sourcedir . '/Security.php');

@mysql_pconnect($db_server, $db_user, $db_passwd);
// Connect to the MySQL database.
if (empty($db_persist))
	$db_connection = @mysql_connect($db_server, $db_user, $db_passwd);
else
	$db_connection = @mysql_pconnect($db_server, $db_user, $db_passwd);

// Show an error if the connection couldn't be made.
if (!$db_connection || !@mysql_select_db($db_name, $db_connection))
	db_fatal_error();

// Load the settings from the settings table, and perform operations like optimizing.
reloadSettings();
// Clean the request variables, add slashes, etc.
cleanRequest();
$context = array();

// Start the session. (assuming it hasn't already been.)
loadSession();

// There's a strange bug in PHP 4.1.2 which makes $_SESSION not work unless you do this...
if (@version_compare(PHP_VERSION, '4.2.0') == -1)
	$HTTP_SESSION_VARS['php_412_bugfix'] = true;

loadUserSettings();

// assign member information
$member = array();

$member['id'] = intval($ID_MEMBER);
$member['name'] = $user_info['name'];
$member['email'] = $user_info['email'];

$member['last_visit'] = $user_info['last_login'];
$member['session_id'] = $sc;
$member['user_new_privmsg'] = $user_info['messages']."/".$user_info['unread_messages'];
$member['timezone'] = $user_info['time_offset'];

$member['avatar'] = $user_info['avatar'];


if ( $member['id'] > 0 )
{
	$member['mgroup'] = intval($user_settings['ID_GROUP']);
	if(!$ID_MEMBER) {
		$member['mgroup'] = 99;
	}
	if($member['mgroup'] == 0) {
		$member['mgroup'] = intval($user_settings['ID_POST_GROUP']);
	}
	if($member['mgroup'] == 0) {
		$member['mgroup'] = 4;
	}
}
else
	$member['mgroup'] = 4;


$member['theme'] = $user_info['theme'];
	if (empty($user_info['theme'])) {
		$member['theme'] = $modSettings['theme_guests'];
	}


//mysql_close($db_connection);

?>
