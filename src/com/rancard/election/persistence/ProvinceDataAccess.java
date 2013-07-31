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

public class ProvinceDataAccess {
	
	public static void insert(String province){		
		insert(new Province(province));
	}
	
	public static void insert(Province province){			
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(province);
		pm.close();
	}
		
	public static List<Province> getProvinces() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Province.class);
	    
	    @SuppressWarnings("unchecked")
		List<Province> entries = (List<Province>) query.execute();
	    pm.close();
	    return entries;
	}
	
	public static List<Province> getProvinceByID(long id){
		PersistenceManager pm = PMF.get().getPersistenceManager();

		Query query = pm.newQuery(Province.class);
	    query.setFilter("id == idParam");	    
	    query.declareParameters("long idParam");
	    
	    @SuppressWarnings("unchecked")
		List<Province> entries = (List<Province>) query.execute(id);
		pm.close();
		
		return entries;
		
	}
	public static Province getProvince(String name){
		List<Province> provinces = getProvinces();
		
		for(Province province: provinces){
			if(province.getName().equalsIgnoreCase(name)){
				return province;
			}
		}
		return null;
	}
	
	
	@SuppressWarnings("unchecked")
	public static Map<String, Object> summariseProvincePresidentialData(){
		List<Province> provinces = ProvinceDataAccess.getProvinces();
		Map<String, Object>  resultSummary = new HashMap<>();

		for(Province province: provinces){				
			List<Map<String, Long>> data =  new ArrayList<Map<String, Long>>(); 
			data.add(new HashMap<String, Long>());
			data.add(new HashMap<String, Long>());
			resultSummary.put(province.getName(), data);
			
			List<Constituency> constituencies = ConstituencyDataAccess.getConstituenciesByProvince(province.getID());
			long total = 0;
			long reported = 0;
			
			for(Constituency constituency: constituencies){
				List<Candidate> candidates = CandidateDataAccess.getCandidatesByConstituencyAndElectionType(constituency.getId(), ElectionType.PRESIDENTIAL);
				
				Map<String, Long> partyResult = (Map<String, Long>)((List<Map<String, Long>>)resultSummary.get(province.getName())).get(0);
				for(Candidate candidate: candidates){
					if(partyResult.containsKey(candidate.getParty())){
						partyResult.put(candidate.getParty(), partyResult.get(candidate.getParty()) + candidate.getResult());
					}else{
						partyResult.put(candidate.getParty(), candidate.getResult());
					}
				}
				
				List<PollingStationAggregate> agg = PollingStationAggregateDataAccess.getPollingStationAggregate(constituency.getId());
				if(agg == null || agg.isEmpty()){
					continue;
				}
				
				total += agg.get(0).getTotal();
				reported += agg.get(0).getReported();
				
			}
			
			Map<String, Long> stats = (Map<String, Long>)((List<Map<String, Long>>)resultSummary.get(province.getName())).get(1);
			stats.put("REPORTED", reported);
			stats.put("TOTAL", total);			
			
		}
		
		return resultSummary;
	}
	
	@SuppressWarnings("unchecked")
	public static Map<String, Object> summariseProvincePaliamentaryData(){
		List<Province> provinces = ProvinceDataAccess.getProvinces();
		Map<String, Object>  resultSummary = new HashMap<>();

		for(Province province: provinces){				
			Map<String, Long> data = new HashMap<>(); 				
			resultSummary.put(province.getName(), data);
			
			List<Constituency> constituencies = ConstituencyDataAccess.getConstituenciesByProvince(province.getID());
			for(Constituency constituency: constituencies){
				List<Candidate> candidates = CandidateDataAccess.getCandidatesByConstituencyAndElectionType(constituency.getId(), ElectionType.HOUSE);
				
				Map<String, Long> partyResult = (Map<String, Long>)resultSummary.get(province.getName());
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
