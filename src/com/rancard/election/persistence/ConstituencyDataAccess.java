package com.rancard.election.persistence;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.models.Candidate;
import com.rancard.election.models.Constituency;
import com.rancard.election.models.ElectionType;
import com.rancard.election.models.PollingStation;
import com.rancard.election.models.PollingStationAggregate;
import com.rancard.election.models.Province;
import com.rancard.election.models.Result;
import com.rancard.election.persistence.util.CacheUtil;

public class ConstituencyDataAccess {
	public static void insert(String name, long province, String provinceName){		
		insert(new Constituency(name, province, provinceName));
	}
	
	public static void insert(Constituency constituency){			
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(constituency);
		pm.close();
	}
		

	public static List<Constituency> getConstituencies() {
		
		@SuppressWarnings("unchecked")
		ArrayList<Constituency> constituencies = (ArrayList<Constituency>)CacheUtil.getCachedObject("constituencies");
		
		if(!(constituencies == null || constituencies.isEmpty())){
			return constituencies;
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Constituency.class);
	    query.setOrdering("province desc");
	    
	    @SuppressWarnings("unchecked")
		List<Constituency> entries = (List<Constituency>) query.execute();	    
	    pm.close();
	    
	    CacheUtil.cache("constituencies", new ArrayList<>(entries));
	    return entries;
	}
	
	public static Constituency getConstituencyByName(String name){
		List<Constituency> constituencies = getConstituencies();
		
		for(Constituency constituency: constituencies){
			if(constituency.getName().equalsIgnoreCase(name)){
				return constituency;
			}
		}		
		return null;
	}
	
	public static List<Constituency> getConstituenciesByID(long id){
		List<Constituency> constituencies = getConstituencies();
		List<Constituency> result = new ArrayList<>();
		for(Constituency con: constituencies){
			if(con.getId().longValue()== id){
				result.add(con);
			}
		}
		
	    return result;
	}
	
	public static List<Constituency> getConstituenciesByProvince(long province){
		@SuppressWarnings("unchecked")
		ArrayList<Constituency> provinceConstituencies = (ArrayList<Constituency>)CacheUtil.getCachedObject("constituencies"+province);
		
		if(!(provinceConstituencies == null || provinceConstituencies.isEmpty())){
			return provinceConstituencies;
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Constituency.class);
	    query.setFilter("province == provinceParam");	    
	    query.declareParameters("long provinceParam");
	    
	    query.setOrdering("name asc");
	    
	    
	    @SuppressWarnings("unchecked")
		List<Constituency> constituencies = (List<Constituency>) query.execute(province);
	    
	    pm.close();
	    
	    CacheUtil.cache("constituencies"+province, new ArrayList<>(constituencies));
	    return constituencies;
	}
	
	public static List<Constituency>  getConstituenciesByName(String name){
		List<Constituency> constituencies = getConstituencies();
		List<Constituency> result = new ArrayList<>();
		for(Constituency con: constituencies){
			if(con.getName().equalsIgnoreCase(name)){
				result.add(con);
			}
		}
		
	    return result;
	}
	
	
	@SuppressWarnings("unchecked")
	public static Map<String, Object> summariseConstituencyPresidentialData(long province){
		List<Constituency> constituencies = ConstituencyDataAccess.getConstituenciesByProvince(province);
		Map<String, Object>  resultSummary = new HashMap<>();

		for(Constituency constituency: constituencies){				
			List<Map<String, Long>> data =  new ArrayList<Map<String, Long>>(); 
			data.add(new HashMap<String, Long>());
			data.add(new HashMap<String, Long>());
			resultSummary.put(constituency.getName().trim(), data);
			
			List<Candidate> candidates = CandidateDataAccess.getCandidatesByConstituencyAndElectionType(constituency.getId().longValue(), ElectionType.PRESIDENTIAL);
			if(candidates == null || candidates.isEmpty()){
				continue;
			}
			
			for(Candidate candidate: candidates){
				Map<String, Long> partyResult = (Map<String, Long>)((List<Map<String, Long>>)resultSummary.get(constituency.getName().trim())).get(0);		
				if(partyResult.containsKey(candidate.getParty())){
					partyResult.put(candidate.getParty(), partyResult.get(candidate.getParty()) + candidate.getResult());
				}else{
					partyResult.put(candidate.getParty(), candidate.getResult());
				}
			}
			
			Map<String, Long> stats = (Map<String, Long>)((List<Map<String, Long>>)resultSummary.get(constituency.getName().trim())).get(1);
			
			List<PollingStationAggregate> agg = PollingStationAggregateDataAccess.getPollingStationAggregate(constituency.getId());
			if(agg == null || agg.isEmpty()){
				stats.put("REPORTED", 0L);
				stats.put("TOTAL", 0L);
				
			}else{			
			
				stats.put("REPORTED", agg.get(0).getReported());
				stats.put("TOTAL", agg.get(0).getTotal());
			}
			
		}
		
		return resultSummary;
	}
	
	
	@SuppressWarnings("unchecked")
	public static Map<String, Object> summariseConstituencyPaliamentaryData(long province){
		List<Constituency> constituencies = ConstituencyDataAccess.getConstituenciesByProvince(province);
		Map<String, Object>  resultSummary = new HashMap<>();

		for(Constituency constituency: constituencies){					
			Map<String, Long> data = new HashMap<>(); 				
			resultSummary.put(constituency.getName().trim(), data);
			
			Map<String, Long> partyResult = (Map<String, Long>)resultSummary.get(constituency.getName().trim());
			List<Candidate> candidates = CandidateDataAccess.getCandidatesByConstituencyAndElectionType(constituency.getId(), ElectionType.HOUSE);
			if(candidates == null || candidates.isEmpty()){
				continue;
			}
			for(Candidate candidate: candidates){					
				if(!partyResult.containsKey(candidate.getParty())){
					partyResult.put(candidate.getParty(), 0L);
				}								
			}
			Candidate c = getWinningCandidate(candidates);
			if(c!=null){
				partyResult.put(c.getParty(), partyResult.get(c.getParty())+1);
			}
			
		}		
		return resultSummary;
	}
	
	private static Candidate getWinningCandidate(List<Candidate> candidates){
		Candidate winningCandidate = null;
		for(Candidate candidate: candidates){
			if(winningCandidate == null && candidate.getResult() != 0){
				winningCandidate = candidate;
			}
			
			if(winningCandidate != null && winningCandidate.getResult() < candidate.getResult()){
				winningCandidate = candidate;						
			}
		}
		
		return winningCandidate;
	}
	
	
	
}
