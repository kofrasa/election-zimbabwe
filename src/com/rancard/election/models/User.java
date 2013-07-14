package com.rancard.election.models;

import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;


@PersistenceCapable
public class User {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
    private Long id;
	
	@Persistent
	private String email;
	
	@Persistent
	private Role role;
	
	@Persistent
	private Date dateCreated;
	
	@Persistent
	private Date lastLoggedIn;
	
	
	public User(String email, Role role, Date dateCreated, Date lastLoggedIn){
		this.email = email;
		this.role = role;
		this.dateCreated = dateCreated;
		this.lastLoggedIn = lastLoggedIn;
	}


	public String getEmail() {
		return email;
	}

	public Role getRole() {
		return role;
	}
	
	public Date getDateCreated() {
		return dateCreated;	
	}
	
	public Date getLastLoggedIn() {
		return lastLoggedIn;
	}
	

}
