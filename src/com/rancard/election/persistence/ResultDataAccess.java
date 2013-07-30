package com.rancard.election.persistence;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.json.CandidateApi;
import com.rancard.election.models.ElectionType;
import com.rancard.election.models.Result;


public class ResultDataAccess {
	private static final Logger log = Logger.getLogger(ResultDataAccess.class.getName());
	
	public static void insert(String enteredBy, Long result, Long candidate, String candidateName, Boolean approved, String approvedBy, 
			ElectionType electionType, String party, Long pollingStation, Long ward, Long constituency,  Long province){		
		insert(new Result(enteredBy, result, candidate, candidateName, approved, approvedBy, electionType, party, pollingStation, ward,
				constituency, province));
	}
	
	public static void insert(Result result){			
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(result);
		pm.close();
	}
	
	public static void deleteResults(Long id) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    query.setFilter("id == idParam");	    
	    query.declareParameters("Long idParam");
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.execute(id);
	    pm.deletePersistentAll(entries);
	    pm.close();
	   
	}
	
	public static List<Result> getResults() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.execute();
	    pm.close();
	    return entries;
	}	
	
	public static List<Result> getResults(Long id) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    query.setFilter("id == idParam");	    
	    query.declareParameters("Long idParam");	    
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.execute(id);
	    pm.close();
	    return entries;
	}
	
	public static Result getApprovedResultByPollingStationAndCandidate(Long pollingStation, Long candidate) {
		List<Result> results = getResultsByPollingStation(pollingStation);

		for(Result result: results){
			if(result.isApproved() == null || !result.isApproved())
			{
				continue;
			}
			
			if(result.getCandidate().longValue() == candidate.longValue()){
				return result;
			}
		}
		
		return null;
	    
	}
	
	public static List<Result> getApprovedResults() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    query.setFilter("approved == approvedParam");	    
	    query.declareParameters("Boolean approvedParam");
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.execute();
	    pm.close();
	    return entries;
	}
	
	public static List<Result> getApprovedPresidentialResults() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    query.setFilter("approved == approvedParam");
	    query.setFilter("electionType == electionTypeParam");
	    query.declareParameters("Boolean approvedParam");
	    query.declareParameters("String electionTypeParam");
	    
	    Map<String, Object> paramMap = new HashMap<>();
	    paramMap.put("approvedParam", Boolean.TRUE);
	    paramMap.put("electionTypeParam", ElectionType.PRESIDENTIAL);
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.executeWithMap(paramMap);
	    pm.close();
	    return entries;
	}
	
	public static List<Result> getResultsByPollingStation(Long pollingStation) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Result.class);
	    query.setFilter("pollingStation == pollingStationParam");	    
	    query.declareParameters("long pollingStationParam");
	    
	    @SuppressWarnings("unchecked")
		List<Result> entries = (List<Result>) query.execute(pollingStation);
	    pm.close();
	    return entries;
	}
	
	public static List<Result> getResultsByPollingStationAndElectionType(Long pollingStation, ElectionType electionType) {
		List<Result> results = getResultsByPollingStation(pollingStation);
		List<Result> electionTypeResults = new ArrayList<>();
				
		for(Result result: results){
			if(result.getElectionType() == electionType){
				electionTypeResults.add(result);
			}
		}
		
		return electionTypeResults;
	}
}
