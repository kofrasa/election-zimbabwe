package com.rancard.election.models;


import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class PollingStation {
	
	@PrimaryKey
	@Persistent
	private String name;
	
	@Persistent
	private int ward;
	
	
	public PollingStation(String name, int ward) {
		this.name = name;
		this.ward = ward;
	}

	public String getName() {
		return name;
	}

	public int getWard() {
		return ward;
	}	
	
}
