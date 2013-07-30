package com.rancard.election.models;

import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class PollingStationAggregate {
	
	@PrimaryKey
	@Persistent
	private Long constituency;
	
	@Persistent
	private Long total;
	
	@Persistent
	private Long reported;
	
	public PollingStationAggregate(Long constituency, Long total, Long reported) {
		this.constituency = constituency;
		this.total = total;
		this.reported = reported;
		
	}
	public Long getTotal() {
		return total;
	}


	public Long getReported() {
		return reported;
	}


	public void setTotal(Long total) {
		this.total = total;
	}


	public void setReported(Long reported) {
		this.reported = reported;
	}
	
}
