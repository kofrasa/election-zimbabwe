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
	private int result;
	
	@Persistent
	private long candidate;
	
	@Persistent
	private boolean approved;
	
	@Persistent
	private String approvedBy; 
	
	@Persistent
	private String pollingStation;
	
	@Persistent
	private Integer ward;
	
	@Persistent
	private String constituency;
	
	@Persistent
	private String province;
	
	
	public Result(String enteredBy, int result, long candidate, boolean approved, String approvedBy, String pollingStation,
			Integer ward, String constituency, String province){
		this.enteredBy = enteredBy;
		this.result = result;
		this.candidate = candidate;		
		this.approved = approved;
		this.approvedBy = approvedBy;
		this.pollingStation = pollingStation;
		this.ward = ward;
		this.constituency = constituency;
		this.province = province;
	}

	public String getEnteredBy() {
		return enteredBy;
	}

	public int getResult() {
		return result;
	}


	public long getCandidate() {
		return candidate;
	}


	public boolean isApproved() {
		return approved;
	}


	public String getApprovedBy() {
		return approvedBy;
	}

	public String getPollingStation() {
		return pollingStation;
	}

	public Integer getWard() {
		return ward;
	}

	public String getConstituency() {
		return constituency;
	}

	public String getProvince() {
		return province;
	}
}
