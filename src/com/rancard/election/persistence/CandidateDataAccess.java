package com.rancard.election.persistence;

import java.util.ArrayList;
import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.models.Candidate;
import com.rancard.election.models.ElectionType;

public class CandidateDataAccess {
	
	public static void insert(String name, String party, ElectionType electionType, Long constituency, String constituencyName, long result){
		insert(new Candidate(name, party, electionType, constituency, constituencyName, result));
	}
	
	public static void insert(Candidate candidate){		
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(candidate);
		pm.close();
	}
	
	public static List<Candidate> getCandidates() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Candidate.class);
	    
	    @SuppressWarnings("unchecked")
		List<Candidate> entries = (List<Candidate>) query.execute();
	    pm.close();
	    return entries;
	}
	
	public static List<Candidate> getCandidatesByID(long id){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Candidate.class);	    
	    query.setFilter("id == idParam");	    
	    query.declareParameters("long idParam");
	    
	    @SuppressWarnings("unchecked")
	    List<Candidate> entries = (List<Candidate>) query.execute(id);
	    pm.close();
	    return entries;
	}
	
	
	
	public static List<Candidate> getCandidatesByParty(String party){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Candidate.class);	    
	    query.setFilter("party == partyParam");	    
	    query.declareParameters("String partyParam");
	    
	    @SuppressWarnings("unchecked")
	    List<Candidate> entries = (List<Candidate>) query.execute(party);
	    pm.close();
	    return entries;
	}
	
	public static List<Candidate> getCandidatesByConstituency(long constituency){	
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Candidate.class);	    
	    query.setFilter("constituency == constituencyParam");	    
	    query.declareParameters("long constituencyParam");
	    
	    
	    @SuppressWarnings("unchecked")
	    List<Candidate> entries = (List<Candidate>) query.execute(constituency);
	    pm.close();
	    return entries;
	}
	
	public static List<Candidate> getCandidatesByConstituencyAndElectionType(long constituency, ElectionType electionType){	
		List<Candidate> entries = new ArrayList<>(getCandidatesByConstituency(constituency));
		List<Candidate> electionTypes = new ArrayList<>();
		for(int i = 0; i < entries.size(); i++){
			if(entries.get(i).getElectionType() == electionType){
				electionTypes.add(entries.get(i));
			}
		}
		return electionTypes;
	}
	
	public static List<Candidate> getCandidatesByElectionType(ElectionType electionType){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Candidate.class);	    
	    query.setFilter("electionType == electionTypeParam");	    
	    query.declareParameters("String electionTypeParam");
	    
	    @SuppressWarnings("unchecked")
	    List<Candidate> entries = (List<Candidate>) query.execute(electionType.toString());
	    pm.close();
	    return entries;
	}
	
	public static synchronized void updateCandidateResult(long candidate, long result) {
		Candidate c = CandidateDataAccess.getCandidatesByID(candidate).get(0);
		if(c.getResultOverriden() == null || c.getResultOverriden() == false){		
			c.setResult(c.getResult()+result);
			insert(c);
		}
	}
}
