package com.rancard.election.persistence;

import java.util.List;

import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.rancard.election.models.PollingStationAggregate;
import com.rancard.election.models.Result;

public class PollingStationAggregateDataAccess {
	
	public static void insert(Long constituency, Long total, Long reported){
		insert(new PollingStationAggregate(constituency, total, reported));
	}
	
	public static void insert(PollingStationAggregate agg){
		PersistenceManager pm = PMF.get().getPersistenceManager();
	    pm.makePersistent(agg);
		pm.close();
	}
	
	public static List<PollingStationAggregate> getPollingStationAggregate(){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(PollingStationAggregate.class);	    
	    
	    @SuppressWarnings("unchecked")
		List<PollingStationAggregate> aggs = (List<PollingStationAggregate>) query.execute();  
	    
		pm.close();
		
		return aggs;
	}
	
	public static List<PollingStationAggregate> getPollingStationAggregate(Long constituency){
		PersistenceManager pm = PMF.get().getPersistenceManager();
		Query query = pm.newQuery(PollingStationAggregate.class);
	    query.setFilter("constituency == constituencyParam");	    
	    query.declareParameters("Long constituencyParam");
	    
	    @SuppressWarnings("unchecked")
		List<PollingStationAggregate> aggs = (List<PollingStationAggregate>) query.execute(constituency);    
	    
		pm.close();
		return aggs;
	}

	public synchronized static void increaseTotal(Long constituencyID) {
		List<PollingStationAggregate> aggs = getPollingStationAggregate(constituencyID);
		
		if(aggs == null || aggs.isEmpty()){
			PollingStationAggregateDataAccess.insert(constituencyID, 1L, 0L);
		}else{
			PollingStationAggregateDataAccess.insert(constituencyID, aggs.get(0).getTotal()+1, aggs.get(0).getReported());
		}
		
	}
	
	

}
