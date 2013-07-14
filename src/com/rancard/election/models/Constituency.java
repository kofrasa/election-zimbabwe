package com.rancard.election.models;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

public class Constituency {
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String name;
	
	@Persistent
	private Province province;
	
	@Persistent
	private List<Result> overrideResults;
	
	public Constituency(String name, Province province, List<Result> overrideResults) {
		this.name = name;
		this.province = province;
		this.overrideResults = overrideResults;
	}
	
	public String getName() {
		return name;
	}

	public Province getProvince() {
		return province;
	}

	public List<Result> getOverrideResults() {
		return overrideResults;
	}
}
