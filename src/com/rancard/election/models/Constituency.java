package com.rancard.election.models;


import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable
public class Constituency {

	@PrimaryKey
	@Persistent
	private String name;
	
	@Persistent
	private String province;
	
	
	public Constituency(String name, String province) {
		this.name = name;
		this.province = province;
	}
	
	public String getName() {
		return name;
	}

	public String getProvince() {
		return province;
	}

}
