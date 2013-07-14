package com.rancard.election.models;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class Candidate {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String firstName;
	
	@Persistent
	private String lastName;
	
	@Persistent 
	private String middleName;
	
	@Persistent
	private Party party;
	
	@Persistent
	private ElectionType electionType;
	
	
	public Candidate(String firstName, String lastName, String middleName, Party party, ElectionType electionType){
		this.firstName = firstName;
		this.lastName = firstName;
		this.middleName = middleName;
		this.party = party;	
		this.electionType = electionType;
	}
	
	public Long getId() {
		return id;
	}

	public String getFirstName() {
		return firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public Party getParty() {
		return party;
	}
	
	public ElectionType getElectionType() {
		return electionType;
	}



	
}
