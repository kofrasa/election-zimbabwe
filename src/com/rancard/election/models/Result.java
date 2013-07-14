package com.rancard.election.models;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class Result {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private User enteredBy;
	
	@Persistent
	private int result;
	
	@Persistent
	private Candidate candidate;
	
	@Persistent
	private boolean approved;
	
	@Persistent
	private User approvedBy; 
	
	
	public Result(User enteredBy, int result, Candidate candidate, boolean approved, User approvedBy){
		this.enteredBy = enteredBy;
		this.result = result;
		this.candidate = candidate;		
		this.approved = approved;
		this.approvedBy = approvedBy;		
	}

	public User getEnteredBy() {
		return enteredBy;
	}

	public int getResult() {
		return result;
	}


	public Candidate getCandidate() {
		return candidate;
	}


	public boolean isApproved() {
		return approved;
	}


	public User getApprovedBy() {
		return approvedBy;
	}
}
