package com.rancard.election.models;


import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable
public class Constituency {

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;	
	
	@Persistent
	private String name;
	
	@Persistent
	private Long province;
	
	@Persistent
	private String provinceName;
	
	public Constituency(String name, long province, String provinceName) {
		this.name = name;
		this.province = province;
		this.provinceName = provinceName;
	}
	
	
	public String getName() {
		return name;
	}

	public long getProvince() {
		return province;
	}

	
	public String getProvinceName(){
		return provinceName;
	}


	public Long getId() {
		return id;
	}

}
