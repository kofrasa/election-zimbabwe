package com.rancard.election.json;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.rancard.election.persistence.PartyDataAccess;

@SuppressWarnings("serial")
public class PartyApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(PartyApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String id = req.getParameter("id");
		
		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(id == null || id.equals(""))){
			try{
				Long.parseLong(id);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(PartyDataAccess.getPartiesByID(Long.parseLong(id))));
		}else{
			resp.getWriter().println(gson.toJson(PartyDataAccess.getParties()));
		}
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String partyAbbr = req.getParameter("abbr");
		String partyName = req.getParameter("name");
		
		if(partyAbbr == null || partyAbbr.equals("")){
			resp.sendError(400);
			return;
		}
		
		PartyDataAccess.insert(partyAbbr, partyName);
		resp.setStatus(201);
		
		Gson gson = new Gson();
		resp.getWriter().println(gson.toJson(PartyDataAccess.getParties()));
	}
}
