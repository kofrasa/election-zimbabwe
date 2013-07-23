package com.rancard.election.persistence;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	
	public static List<User> getUsers(Role role){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(User.class);
	    query.setFilter("role == roleParam");	    
	    query.declareParameters("String roleParam");
	    
	    @SuppressWarnings("unchecked")
		List<User> users = (List<User>) query.execute(role.toString());
	    
	    pm.close();
	    return users;
	    
	}
	
	public static List<User> getUsers(String email, Role role){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(User.class);
	    query.setFilter("role == roleParam");	
	    query.setFilter("email == emailParam");
	    query.declareParameters("String roleParam");
	    query.declareParameters("String emailParam");
	    
	    Map<String, String> paramMap = new HashMap<String, String>();
	    paramMap.put("roleParam", role.toString());
	    paramMap.put("emailParam", email);
	    
	    @SuppressWarnings("unchecked")
		List<User> users = (List<User>) query.executeWithMap(paramMap);
	    
	    pm.close();
	    return users;
	    
	}
	
	public static List<User> getUsers(String email) {
		PersistenceManager pm = PMF.get().getPersistenceManager();	
		
		Query query = pm.newQuery(User.class);
	    query.setFilter("email == emailParam");
	    query.declareParameters("String emailParam");
	    
	    @SuppressWarnings("unchecked")
		List<User> users = (List<User>) query.execute(email);
	     
	    pm.close();
	    return users;
	}
	
	
	public static void deleteUser(String email){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(User.class);
	    query.setFilter("email == emailParam");
	    query.declareParameters("String emailParam");
	    
	    @SuppressWarnings("unchecked")
		List<User> users = (List<User>) query.execute(email);
	    
	    pm.deletePersistentAll(users);
	    pm.close();
	    
	}
}
