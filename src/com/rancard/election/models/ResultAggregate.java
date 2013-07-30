package com.rancard.election.models;

import java.util.List;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable
public class ResultAggregate {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long id;
	
	@Persistent
	private Long constituency;
	
	@Persistent
	private ElectionType electionType;
	
	@Persistent
	private Long candidates;
	
	@Persistent
	private List<Long> parties;
	
}
