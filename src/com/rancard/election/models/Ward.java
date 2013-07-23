package com.rancard.election.models;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class Ward {
	@PrimaryKey
	@Persistent
	private int number;
	
	@Persistent
	private String constituency;
	
	
	public Ward(int number, String constituency) {
		this.number = number;
		this.constituency = constituency;
	}

	public int getNumber() {
		return number;
	}

	public String getConstituency() {
		return constituency;
	}

}
