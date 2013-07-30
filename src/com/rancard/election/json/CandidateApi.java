package com.rancard.election.json;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.gson.Gson;
import com.rancard.election.models.Candidate;
import com.rancard.election.models.Constituency;
import com.rancard.election.models.ElectionType;
import com.rancard.election.persistence.CandidateDataAccess;
import com.rancard.election.persistence.ConstituencyDataAccess;
import com.rancard.election.persistence.UserDataAccess;


@SuppressWarnings("serial")
public class CandidateApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(CandidateApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String id = req.getParameter("id");
		String electionType = req.getParameter("election_type");
		String party = req.getParameter("party");
		String constituency = req.getParameter("constituency");
		

		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(id == null || id.equals(""))){
			try{
				Long.parseLong(id);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(CandidateDataAccess.getCandidatesByID(Long.parseLong(id))));
		}else if(!(electionType == null || electionType.equals("")) && !(constituency == null || constituency.equals(""))){
			if(ElectionType.valueOf(electionType.toUpperCase()) == null){
				resp.sendError(400);
				return;
			}
			try{
				Long.parseLong(constituency);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(CandidateDataAccess
					.getCandidatesByConstituencyAndElectionType(Long.parseLong(constituency), ElectionType.valueOf(electionType.toUpperCase()))));
		}else if(!(party == null || party.equals(""))){
			try{
				Long.parseLong(party);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(CandidateDataAccess.getCandidatesByParty(party)));
		}else if(!(constituency == null || constituency.equals(""))){
			try{
				Long.parseLong(constituency);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(CandidateDataAccess.getCandidatesByConstituency(Long.parseLong(constituency))));
		}else{
			resp.getWriter().println(gson.toJson(CandidateDataAccess.getCandidates()));
		}
		
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String party = req.getParameter("party");
		String name = req.getParameter("name");
		String electionType = req.getParameter("election_type");
		String constituency = req.getParameter("constituency");
		String result = req.getParameter("result");
		String action = req.getParameter("action");
		String overrideResult = req.getParameter("override_result");
		String id = req.getParameter("id");
		
		if(!(action == null || action.equals("") && !(overrideResult == null || overrideResult.equals("")))){
			log.severe("In right place");
			if(!action.equalsIgnoreCase("OVERRIDE")){
				resp.sendError(400, "Action not allowed");
				return;
			}
			try{
				Long.parseLong(overrideResult);
			}catch(Exception e){
				resp.sendError(400, "Result is not a number");
				return;
			}
			try{
				Long.parseLong(id);
			}catch(Exception e){
				resp.sendError(400, "ID is not a number");
				return;
			}
			
			UserService userService = UserServiceFactory.getUserService();
			User user = userService.getCurrentUser();
			String thisURL = req.getRequestURI();
			
			if(user != null){
				List<com.rancard.election.models.User> dbaseUser = UserDataAccess.getUsers(user.getEmail());
				if (dbaseUser == null || dbaseUser.isEmpty()) {
					log.info("User does not have access");
					resp.getWriter()
							.println(
									"<p>Hello, "
											+ req.getUserPrincipal().getName()
											+ "!  You do not have permission to use this service. You can <a href=\""
											+ userService.createLogoutURL(thisURL)
											+ "\">sign out</a>.</p>");
				} else {
					List<Candidate> candidates = CandidateDataAccess.getCandidatesByID(Long.parseLong(id));
					if (candidates == null || candidates.isEmpty()) {
						log.severe("Candidate not found");
						resp.sendError(400);
						return;
					}
					
					Candidate candidate = candidates.get(0);
					candidate.setOverridenBy(user.getEmail());
					candidate.setResult(Long.parseLong(overrideResult));
					candidate.setResultOverriden(Boolean.TRUE);
					CandidateDataAccess.insert(candidate);
					
					resp.getWriter().println(new Gson().toJson(CandidateDataAccess
							.getCandidatesByConstituencyAndElectionType(candidate.getConstituency(), candidate.getElectionType())));
					
				}
			}
			return;
		}
		
		if(party == null || party.equals("") || name == null || name.equals("") 
				|| electionType == null || electionType.equals("")
				|| result == null || result.equals("")){
			resp.sendError(400, "Problem with some values");
			return;
		}
		
		if(ElectionType.valueOf(electionType) == null){
			resp.sendError(400, "Problem with Election Type");
			return;
		}		
		
		try{
			Integer.parseInt(result);
		}catch(Exception e){
			resp.sendError(400, "Problem with Result");
			return;
		}
		
		
		if(constituency == null || constituency.equals("")){
			CandidateDataAccess.insert(name, party, 
					ElectionType.valueOf(electionType), null, null, Integer.parseInt(result));
		}else{
			try{
				Long.parseLong(constituency);
			}catch(Exception e){
				resp.sendError(400, "Problem with Result");
				return;
			}
			List<Constituency> cons = ConstituencyDataAccess.getConstituenciesByID(Long.parseLong(constituency));
			
			if(cons == null || cons.isEmpty()){
				resp.sendError(400, "Problem with Result");
				return;
			}
			CandidateDataAccess.insert(name, party, 
					ElectionType.valueOf(electionType), Long.parseLong(constituency), cons.get(0).getName(), Integer.parseInt(result));	
		}
		resp.setStatus(201);
		
		Gson gson = new Gson();
		resp.getWriter().println(gson.toJson(CandidateDataAccess.getCandidates()));
	}
}
