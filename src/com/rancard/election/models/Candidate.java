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
	private String name;
	
	@Persistent
	private String party;
	
	@Persistent
	private ElectionType electionType;
	
	@Persistent
	private Long constituency;
	
	@Persistent
	private String constituencyName;
		
	@Persistent
	private long result;
	
	private Boolean resultOverriden;
	
	private String overridenBy;
	
	
	public Candidate(String name, String party, ElectionType electionType, 
			Long constituency, String constituencyName, long result){
		this.name = name;
		this.party = party;	
		this.electionType = electionType;
		this.constituency = constituency;
		this.constituencyName = constituencyName;
		this.result = result;
	}
	
	public long getResult() {
		return result;
	}

	public Long getConstituency() {
		return constituency;
	}

	public Long getId() {
		return id;
	}

	public String getName() {
		return name;
	}


	public String getParty() {
		return party;
	}
	
	public ElectionType getElectionType() {
		return electionType;
	}

	public String getConstituencyName() {
		return constituencyName;
	}

	public void setResult(long result) {
		this.result = result;
	}

	public Boolean getResultOverriden() {
		return resultOverriden;
	}

	public String getOverridenBy() {
		return overridenBy;
	}

	public void setResultOverriden(Boolean resultOverriden) {
		this.resultOverriden = resultOverriden;
	}

	public void setOverridenBy(String overridenBy) {
		this.overridenBy = overridenBy;
	}

	
}
