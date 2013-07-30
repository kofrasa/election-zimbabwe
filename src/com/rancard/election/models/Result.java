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
	private String enteredBy;
	
	@Persistent
	private long result;
	
	@Persistent
	private Long candidate;
	
	@Persistent
	private String party;

	@Persistent
	private ElectionType electionType;
	
	@Persistent
	private Boolean approved;
	
	@Persistent
	private String approvedBy; 
	
	@Persistent
	private Long pollingStation;
	
	@Persistent
	private Long ward;
	
	@Persistent
	private Long constituency;
	
	@Persistent 
	private String candidateName;
	
	@Persistent
	private Long province;
	
	
	public Result(String enteredBy, long result, Long candidate, String candidateName, Boolean approved, String approvedBy, 
			ElectionType electionType, String party, Long pollingStation, Long ward, Long constituency,  Long province){
		this.enteredBy = enteredBy;
		this.result = result;
		this.candidate = candidate;		
		this.approved = approved;
		this.approvedBy = approvedBy;
		this.electionType = electionType;
		this.party = party;
		this.pollingStation = pollingStation;
		this.ward = ward;
		this.constituency = constituency;
		this.province = province;
		this.candidateName = candidateName;
	}

	public String getEnteredBy() {
		return enteredBy;
	}

	public long getResult() {
		return result;
	}


	public Long getCandidate() {
		return candidate;
	}


	public Boolean isApproved() {
		return approved;
	}
	
	public void isApproved(Boolean approved) {
		this.approved = approved;
	}


	public String getApprovedBy() {
		return approvedBy;
	}

	public void setApprovedBy(String approvedBy) {
		this.approvedBy = approvedBy;
	}
	
	public Long getPollingStation() {
		return pollingStation;
	}

	public Long getWard() {
		return ward;
	}

	public Long getConstituency() {
		return constituency;
	}

	public Long getProvince() {
		return province;
	}
	
	public String getParty() {
		return party;
	}

	public ElectionType getElectionType() {
		return electionType;
	}

	public String getCandidateName() {
		return candidateName;
	}
	
	public Boolean getApproved() {
		return approved;
	}

	public Long getId() {
		return id;
	}

}
