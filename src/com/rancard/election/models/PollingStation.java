package com.rancard.election.models;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class PollingStation {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String name;
	
	@Persistent
	private Ward ward;
	
	@Persistent
	private List<Result> results;
	
	public PollingStation(String name, Ward ward, List<Result> results) {
		this.name=name;
		this.ward=ward;
		this.results = results;
	}

	public String getName() {
		return name;
	}

	public Ward getWard() {
		return ward;
	}

	public List<Result> getResults() {
		return results;
	}
	
	
	
	
}
