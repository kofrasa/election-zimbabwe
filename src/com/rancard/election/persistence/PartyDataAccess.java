package com.rancard.election.persistence;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.models.Party;

public class PartyDataAccess {
	
	public static void insert(String partyAbbr, String partyName){
		insert(new Party(partyAbbr, partyName));
	}
	
	public static void insert(Party party){
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(party);
		pm.close();
	}
	
	public static List<Party> getParties() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Party.class);
	    
	    @SuppressWarnings("unchecked")
		List<Party> entries = (List<Party>) query.execute();
	    pm.close();
	    return entries;
	}
	
	public static List<Party> getPartiesByID(long id){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Party.class);	    
	    query.setFilter("id == idParam");	    
	    query.declareParameters("long idParam");
	    
	    @SuppressWarnings("unchecked")
	    List<Party> entries = (List<Party>) query.execute(id);
	    pm.close();
	    return entries;
	}
}
