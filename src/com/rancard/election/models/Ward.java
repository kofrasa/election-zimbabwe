package com.rancard.election.models;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class Ward {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private int number;
	
	@Persistent
	private Constituency constituency;
	
	@Persistent
	private List<Result> overrideResults;
	
	public Ward(int number, Constituency constituency, List<Result> overrideResults) {
		this.number = number;
		this.constituency = constituency;
		this.overrideResults = overrideResults;
	}

	public int getNumber() {
		return number;
	}

	public Constituency getConstituency() {
		return constituency;
	}

	public List<Result> getOverrideResults() {
		return overrideResults;
	}
}
