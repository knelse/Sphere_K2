// JavaScript Document
// core.js
var Game = null; 
var CGame = function() { 
	this.DB = new CDB();
	this.RPG = new CFormula();
	this.character = [];
	
	this.initDB = function( items, prefix, costGT ) 
	{
		this.DB.Items.load( items );
		this.DB.Items.setPrefixes( prefix );
		this.DB.setupGTCosts( costGT );
	}
	
};
