package com.rancard.election.persistence;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.google.appengine.api.memcache.ErrorHandlers;
import com.google.appengine.api.memcache.MemcacheService;
import com.google.appengine.api.memcache.MemcacheServiceFactory;
import com.rancard.election.models.ElectionType;
import com.rancard.election.models.PollingStation;
import com.rancard.election.persistence.util.CacheUtil;
import com.sun.org.apache.regexp.internal.recompile;

public class PollingStationDataAccess {
	
	public static void insert(String name, Long wardID, Long wardNumber, Long constituencyID, String constituencyName, Long provinceID, String provinceName){		
		insert(new PollingStation(name, wardID, wardNumber, constituencyID, constituencyName, provinceID, provinceName));
	}
	
	public static void insert(PollingStation pollingStation){			
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(pollingStation);
		pm.close();
	}
	
	public static void deletePollingStations() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(PollingStation.class);
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> entries = (List<PollingStation>) query.execute();
	    pm.deletePersistentAll(entries);
	    pm.close();
	  
	}
	
	public static List<PollingStation> getPollingStations() {
		@SuppressWarnings("unchecked")
		ArrayList<PollingStation> pollingStations = (ArrayList<PollingStation> )CacheUtil.getCachedObject("pollingstations");
		
		if(!(pollingStations == null || pollingStations.isEmpty())){
			return pollingStations;
		}
		
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(PollingStation.class);
	    
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> entries = (List<PollingStation>) query.execute();	    
	    pm.close();
	    CacheUtil.cache("pollingstations", new ArrayList<>(entries));
	    return entries;
	}
	
	public static List<PollingStation> getPollingStations(Long province) {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(PollingStation.class);
	    query.setFilter("provinceID == provinceIDParam");	    
	    query.declareParameters("Long provinceIDParam");
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> entries = (List<PollingStation>) query.execute(province);
	    pm.close();
	    return entries;
	}
	
	public static List<PollingStation> getPollingStationsWithResults() {
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    Query query = pm.newQuery(PollingStation.class);
	    query.setFilter("hasResult == hasResultParam");	    
	    query.declareParameters("Boolean hasResultParam");
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> entries = (List<PollingStation>) query.execute(Boolean.TRUE);
	    pm.close();
	    return entries;
	}
	
	public static List<PollingStation> getPollingStationsByID(Long id){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(PollingStation.class);
	    query.setFilter("id == idParam");	    
	    query.declareParameters("long idParam");
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> pollingStations = (List<PollingStation>) query.execute(id);
	    
	    pm.close();
	    return pollingStations;
	}
	
	public static List<PollingStation> getPollingStationsByWard(Long ward){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		
	    Query query = pm.newQuery(PollingStation.class);
	    
	    query.setFilter("wardNumber == wardNumberParam");	    
	    query.declareParameters("Long wardNumberParam");
	    
	    @SuppressWarnings("unchecked")
		List<PollingStation> pollingStations = (List<PollingStation>) query.execute(ward);
	    
	    pm.close();
	    return pollingStations;
	}
	
	public static List<PollingStation> filterByProvince(List<PollingStation> pollingStations, Long province) {
		List<PollingStation> results = new ArrayList<>();
		
		for(PollingStation station: pollingStations){
			if(station.getProvinceID().longValue() == province.longValue()){
				results.add(station);
			}
		}
		return results;		
	}
	
	public static List<PollingStation> filterByConstituency(List<PollingStation> pollingStations, Long constituency) {
		List<PollingStation> results = new ArrayList<>();
		
		for(PollingStation station: pollingStations){
			if(station.getConstituencyID().longValue() == constituency.longValue()){
				results.add(station);
			}
		}
		return results;		
	}
	
	public static List<PollingStation> filterByWard(List<PollingStation> pollingStations, Long ward) {
		List<PollingStation> results = new ArrayList<>();
		
		for(PollingStation station: pollingStations){
			if(station.getWardNumber().longValue() == ward.longValue()){
				results.add(station);
			}
		}
		return results;		
	}
	
	public static List<PollingStation> getPollingStations(String province, String constituency, String ward){
		List<PollingStation> pollingStations = getPollingStations();
		List<PollingStation> results = null;
		
		if(province != null){
			results = filterByProvince(pollingStations, Long.parseLong(province));
		}
		
		if(constituency != null){
			if(results == null){
				results = filterByConstituency(pollingStations, Long.parseLong(constituency));
			}else{
				results = filterByConstituency(results, Long.parseLong(constituency));
			}
		}
		
		if(ward != null){
			if(results == null){
				results = filterByWard(pollingStations, Long.parseLong(ward));
			}else{
				results = filterByWard(results, Long.parseLong(ward));
			}
		}
		
		return results;		
		
	}
}
