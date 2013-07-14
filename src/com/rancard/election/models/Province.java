package com.rancard.election.models;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

public class Province {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String name;
	
	@Persistent
	private List<Result> overrideResults;
}
