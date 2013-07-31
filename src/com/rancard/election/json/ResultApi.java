package com.rancard.election.json;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.rancard.election.models.Candidate;
import com.rancard.election.models.ElectionType;
import com.rancard.election.models.PollingStation;
import com.rancard.election.models.PollingStationAggregate;
import com.rancard.election.models.Result;
import com.rancard.election.models.Role;
import com.rancard.election.persistence.CandidateDataAccess;
import com.rancard.election.persistence.PollingStationAggregateDataAccess;
import com.rancard.election.persistence.PollingStationDataAccess;
import com.rancard.election.persistence.ResultDataAccess;
import com.rancard.election.persistence.UserDataAccess;

@SuppressWarnings("serial")
public class ResultApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(CandidateApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String pollingStation = req.getParameter("polling_station");
		String electionType = req.getParameter("election_type");

		
		Gson gson = new Gson();
		
		if(!(pollingStation == null || pollingStation.equals("")) && !(electionType == null || electionType.equals(""))){
			try{
				Long.parseLong(pollingStation);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			if(ElectionType.valueOf(electionType.toUpperCase()) == null){
				resp.sendError(400);
				return;
			}
			
			resp.getWriter().println(gson.toJson(ResultDataAccess.getResultsByPollingStationAndElectionType(Long.parseLong(pollingStation), ElectionType.valueOf(electionType.toUpperCase()))));
		}else if(!(pollingStation == null || pollingStation.equals(""))){
			try{
				Long.parseLong(pollingStation);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(ResultDataAccess.getResultsByPollingStation(Long.parseLong(pollingStation))));
		}else{
			resp.getWriter().println(gson.toJson(ResultDataAccess.getResults()));
		}
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String enteredBy = req.getParameter("entered_by");
		String result =  req.getParameter("result");
		String candidate = req.getParameter("candidate");
		String approved = req.getParameter("approved");		
		String approvedBy = req.getParameter("approved_by");
		String pollingStation = req.getParameter("polling_station");
		String ward = req.getParameter("ward");
		String constituency = req.getParameter("constituency");
		String province = req.getParameter("province");
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		
		if(action == null || action.equals("")){
			resp.sendError(400);
			return;
		}
		
		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();
		if(user == null){
			resp.sendError(400);
			return;
		}
		log.severe("USER IS LOGGED IN");
		List<com.rancard.election.models.User> dbaseUser = UserDataAccess.getUsers(user.getEmail());
		if(dbaseUser == null || dbaseUser.isEmpty()){
			resp.sendError(400);
			return;
		}
		
		log.severe("FOUND USER");
		Gson gson = new Gson();
		if(!(pollingStation == null || pollingStation.equals(""))){
			
			List<PollingStation> pollingStations = PollingStationDataAccess.getPollingStationsByID(Long.parseLong(pollingStation));
			if(pollingStations == null || pollingStations.isEmpty()){
				resp.sendError(400);
				return;
			}
			
			if(action.equalsIgnoreCase("ADD")){
				if(enteredBy == null || enteredBy.equals("") || result == null || result.equals("") || candidate == null || candidate.equals("")){
					resp.sendError(400);
					return;
				}
				
				try{
					Long.parseLong(result);
				}catch(Exception e){
					resp.sendError(400);
					return;
				}
				
				try{
					Long.parseLong(candidate);
				}catch(Exception e){
					resp.sendError(400);
					return;
				}		
			
				try{
					Long.parseLong(pollingStation);
				}catch(Exception e){
					resp.sendError(400);
					return;
				}				
				
				List<Candidate> candidates = CandidateDataAccess.getCandidatesByID(Long.parseLong(candidate));
				if(candidates == null || candidates.isEmpty()){
					resp.sendError(400);
					return;
				}
				
				PollingStation pol = pollingStations.get(0);
				if(!(pol.getHasResult() == null || !pol.getHasResult())){
					List<PollingStationAggregate> aggs = PollingStationAggregateDataAccess.getPollingStationAggregate(pol.getConstituencyID());
					PollingStationAggregateDataAccess.insert(pol.getConstituencyID(), aggs.get(0).getTotal(), aggs.get(0).getReported()+1);
					
					pol.setHasResult(true);
					PollingStationDataAccess.insert(pol);
				}
				
				List<Result> results = ResultDataAccess
						.getResultsByPollingStationAndElectionType(Long.parseLong(pollingStation), candidates.get(0).getElectionType());
				
				Result r = new Result(enteredBy, Long.parseLong(result), Long.parseLong(candidate), 
						candidates.get(0).getName(), null, 
						null, candidates.get(0).getElectionType(), candidates.get(0).getParty(), Long.parseLong(pollingStation), null, null, null);
				
				ResultDataAccess.insert(r);
				
				
				List<Result> moreResults = new ArrayList<>(results);
				moreResults.add(r);
				
				resp.getWriter().println(gson.toJson(moreResults));
				
				
			}else if(action.equalsIgnoreCase("APPROVE")){
				if(id == null || id.equals("") || approvedBy == null || approvedBy.equals("")){
					resp.sendError(400);
					return;
				}
				
				try{
					Long.parseLong(id);
				}catch(Exception e){
					resp.sendError(400);
					return;
				}
				
				List<Result> results = ResultDataAccess.getResults(Long.parseLong(id));
				if(results == null || results.isEmpty()){
					resp.sendError(400);
					return;
				}
				
				Result r = results.get(0);
				if(!(r.getApproved() == null || r.getApproved() == false)){
					resp.sendError(400);
					return;
				}
				
				List<Result> resultsJson = ResultDataAccess
						.getResultsByPollingStationAndElectionType(Long.parseLong(pollingStation), r.getElectionType());		
								
				
				Result approvedResult = ResultDataAccess
						.getApprovedResultByPollingStationAndCandidate(r.getPollingStation(), r.getCandidate());
				if(!(approvedResult == null)){
					log.severe("Found old Approved Result");
					approvedResult.isApproved(Boolean.FALSE);
					ResultDataAccess.insert(approvedResult);
					
					CandidateDataAccess.updateCandidateResult(approvedResult.getCandidate().longValue(), (approvedResult.getResult() * -1));
					
					for(Result rj: resultsJson){
						if(rj.getId().longValue() == approvedResult.getId().longValue()){
							log.severe("Change old Approved Result for return");
							rj.isApproved(Boolean.FALSE);	
						}
					}
				}
				
				CandidateDataAccess.updateCandidateResult(r.getCandidate().longValue(), r.getResult());
				
				
				r.setApprovedBy(approvedBy);
				r.isApproved(Boolean.TRUE);				
				ResultDataAccess.insert(r);
				
				PollingStation pol = pollingStations.get(0);
				if(pol.getHasResult() == null || !pol.getHasResult()){
					List<PollingStationAggregate> aggs = PollingStationAggregateDataAccess.getPollingStationAggregate(pol.getConstituencyID());
					aggs.get(0).setReported(aggs.get(0).getReported()+1);
					PollingStationAggregateDataAccess.insert(aggs.get(0));
					pol.setHasResult(true);
					PollingStationDataAccess.insert(pol);
				}

				for(Result rj: resultsJson){
					if(rj.getId().longValue() == r.getId().longValue()){
						rj.setApprovedBy(approvedBy);
						rj.isApproved(Boolean.TRUE);	
					}
				}
				
				resp.getWriter().println(gson.toJson(resultsJson));
				
			}else if(action.equalsIgnoreCase("DELETE")){
				if(id == null || id.equals("")){
					resp.sendError(400);
					return;
				}
				
				try{
					Long.parseLong(id);
				}catch(Exception e){
					resp.sendError(400);
					return;
				}				
				
				if(!(dbaseUser.get(0).getRole() == Role.ADMIN || dbaseUser.get(0).getRole() == Role.SUPERVISOR)){
					resp.sendError(400);
					return;
				}
				
				List<Result> results = ResultDataAccess.getResults(Long.parseLong(id));
				if(results == null || results.isEmpty()){
					resp.sendError(400);
					return;
				}
				
				Result r = results.get(0);		
				
				List<Result> resultsJson = ResultDataAccess
						.getResultsByPollingStationAndElectionType(Long.parseLong(pollingStation), r.getElectionType());
				
				ResultDataAccess.deleteResults(Long.parseLong(id));
				
				log.severe("Check that its approved");
				if(!(r.getApproved() == null || r.getApproved() == false)){
					log.severe("Is Approved will subtract from candidate");
					CandidateDataAccess.updateCandidateResult(r.getCandidate().longValue(), (r.getResult() * -1));
				}
				
				List<Result> moreResults = new ArrayList<>(resultsJson);
				moreResults.remove(getResult(moreResults, Long.parseLong(id)));
				
				resp.getWriter().println(gson.toJson(moreResults));
			}
				
		}
		
		
		
	}
	
	private Result getResult(List<Result> result, Long id){
		for(Result r: result){
			if(r.getId().longValue() == id.longValue()){
				return r;
			}
		}
		return null;
	}
}
