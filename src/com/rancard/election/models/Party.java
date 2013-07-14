package com.rancard.election.models;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class Party {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String partyAbbr;
	
	@Persistent
	private String partyName;
	
	public Party(String partyAbbr, String partyName){
		this.partyAbbr = partyAbbr;
		this.partyName = partyName;
	}
	
	public String getPartyAbbr() {
		return partyAbbr;
	}
	
	public String getPartyName() {
		return partyName;
	}
}
