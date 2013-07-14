package com.rancard.election.persistence;

import java.util.Date;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.models.Role;
import com.rancard.election.models.User;

public class UserDataAccess {
	
	public static void insert(String email, Role role, Date dateCreated, Date lastLoggedIn){
		User user = new User(email, role, dateCreated, lastLoggedIn);
		insert(user);
	}
	
	public static void insert(User user) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(user);
		pm.close();
	}
	
	public static List<User> getUsers() {
	    PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(User.class);
	    
	    @SuppressWarnings("unchecked")
		List<User> entries = (List<User>) query.execute();
	    pm.close();
	    return entries;
	 }
	
	public static User findUser(String email) {
		List<User> users = getUsers();
		User user = null;
		
		for(User u: users){
			if(u.getEmail().equals(email)){
				user = u;
				break;
			}
		}
		return user;
	}
}
