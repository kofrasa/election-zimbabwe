package com.rancard.election.models;


import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

public class Province {
	
	@PrimaryKey
	@Persistent
	private String name;
	
}
