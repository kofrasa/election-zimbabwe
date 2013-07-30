package com.rancard.election.models;


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
	private Long wardID;
	
	@Persistent
	private Long wardNumber;
	
	@Persistent
	private Long constituencyID;
	
	@Persistent
	private String constituencyName;
	
	@Persistent
	private Long provinceID;
	
	@Persistent
	private String provinceName;
	
	@Persistent
	private Boolean hasResult;
	
	

	public PollingStation(String name, Long wardID, Long wardNumber, Long constituencyID, String constituencyName, Long provinceID, String provinceName) {
		this.name = name;
		this.wardID = wardID;
		this.wardNumber = wardNumber;
		this.constituencyID = constituencyID;
		this.constituencyName = constituencyName;
		this.provinceID = provinceID;
		this.provinceName = provinceName;
	}

	public Long getID() {
		return id;
	}
	public String getName() {
		return name;
	}

	public Long getWardID() {
		return wardID;
	}

	public Long getWardNumber() {
		return wardNumber;
	}

	public Long getConstituencyID() {
		return constituencyID;
	}

	public String getConstituencyName() {
		return constituencyName;
	}

	public Long getProvinceID() {
		return provinceID;
	}

	public String getProvinceName() {
		return provinceName;
	}

	public Boolean getHasResult() {
		return hasResult;
	}

	public void setHasResult(Boolean hasResult) {
		this.hasResult = hasResult;
	}
	
}
