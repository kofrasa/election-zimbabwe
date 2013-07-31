package com.rancard.election.models;

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
	private Long wardNumber;
	
	@Persistent
	private Long constituencyID;
	
	@Persistent
	private String constituencyName;
	
	@Persistent
	private Long provinceID;
	
	@Persistent
	private String provinceName;
	
	
	
	public Ward(Long number, Long constituencyID, String constituencyName, Long provinceID, String provinceName) {
		this.wardNumber = number;
		this.constituencyID = constituencyID;
		this.constituencyName =constituencyName;
		this.provinceID = provinceID;
		this.provinceName = provinceName;
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

	public Long getId() {
		return id;
	}

}
