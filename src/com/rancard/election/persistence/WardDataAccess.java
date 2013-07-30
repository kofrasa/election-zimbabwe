package com.rancard.election.persistence;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;


import com.google.appengine.tools.wargen.WarGeneratorFactory;
import com.rancard.election.models.Constituency;
import com.rancard.election.models.ElectionType;
import com.rancard.election.models.PollingStation;
import com.rancard.election.models.Result;
import com.rancard.election.models.Ward;

public class WardDataAccess {
	public static void insert(Long number, Long constituency, String constituencyName, Long provinceID, String provinceName){		
		insert(new Ward(number, constituency, constituencyName, provinceID, provinceName));
	}
	
	public static void insert(Ward ward){			
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(ward);
		pm.close();
	}
		
	public static List<Ward> getWards() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(Ward.class);
	    
	    
	    @SuppressWarnings("unchecked")
		List<Ward> entries = (List<Ward>) query.execute();
	    pm.close();
	    return entries;
	}
	
	public static List<Ward> getWardsByID(Long id){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Ward.class);
	    query.setFilter("id == idParam");	    
	    query.declareParameters("long idParam");
	    
	    @SuppressWarnings("unchecked")
		List<Ward> wards = (List<Ward>) query.execute(id);
	    
	    pm.close();
	    return wards;
	}
	
	public static Map<Long, Map<String, Map<String, Long>>> summariseWards(long constituency, ElectionType electionType) {
		Map<Long, Map<String, Map<String, Long>>> summarise = new HashMap<>();
		
		List<Ward> wards = WardDataAccess.getWardsByConstituency(constituency);
		for(Ward ward: wards){
			Map<String, Map<String, Long>> pollingResult = new HashMap<>();
			summarise.put(ward.getWardNumber(), pollingResult);
			
			List<PollingStation> pollingStations = PollingStationDataAccess.getPollingStations(null, 
					Long.toString(constituency), Long.toString(ward.getWardNumber()));
			
			for(PollingStation pollingStation: pollingStations){
				Map<String, Long> results = new HashMap<>();
				pollingResult.put(pollingStation.getName(), results);
				
				List<Result> r = ResultDataAccess.getResultsByPollingStationAndElectionType(
						pollingStation.getID().longValue(), electionType);
				for(Result rr: r){
					if(rr == null || !rr.isApproved()){
						continue;
					}
					
					results.put(rr.getCandidateName()+" ("+rr.getParty()+")", rr.getResult());
				}
				
			}
		}
		
		return summarise;
	}
	
	public static List<Ward> getWardsByConstituency(long constituency){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(Ward.class);
	    query.setFilter("constituencyID == constituencyParam");	    
	    query.declareParameters("long constituencyParam");
	    
	    @SuppressWarnings("unchecked")
		List<Ward> wards = (List<Ward>) query.execute(constituency);
	    
	    pm.close();
	    return wards;
	}
}
