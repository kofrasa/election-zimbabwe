package com.rancard.election.json;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.rancard.election.models.PollingStationAggregate;
import com.rancard.election.models.Ward;
import com.rancard.election.persistence.PollingStationAggregateDataAccess;
import com.rancard.election.persistence.PollingStationDataAccess;
import com.rancard.election.persistence.WardDataAccess;


@SuppressWarnings("serial")
public class PollingStationApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(PollingStationApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {		
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String id = req.getParameter("id");;
		String ward = req.getParameter("ward");
		String province = req.getParameter("province");
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
			resp.getWriter().println(gson.toJson(PollingStationDataAccess.getPollingStationsByID(Long.parseLong(id))));
		}else if(!(ward == null || ward.equals("")) || !(province == null || province.equals(""))|| !(constituency == null || constituency.equals(""))){
			
			resp.getWriter().println(gson.toJson(PollingStationDataAccess.getPollingStations(province, 
					constituency, ward)));
		}else{
			
			resp.getWriter().println(gson.toJson((PollingStationDataAccess.getPollingStations(true))));
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
				
		String name = req.getParameter("name");
		String ward = req.getParameter("ward");
		
		
		if(name == null || name.equals("") || ward == null || ward.equals("")){
			resp.sendError(400);
			return;
		}
		
		try{
			Long.parseLong(ward);
		}catch(Exception e){
			resp.sendError(400);
			return;
		}
		
		List<Ward> wards = WardDataAccess.getWardsByID(Long.parseLong(ward));
		if(wards == null || wards.isEmpty()){
			resp.sendError(400);
			return;		
		}
		
		Ward w = wards.get(0);
		PollingStationDataAccess.insert(name, Long.parseLong(ward), w.getWardNumber(), w.getConstituencyID(), w.getConstituencyName(), w.getProvinceID(), w.getProvinceName());
		
		PollingStationAggregateDataAccess.increaseTotal(w.getConstituencyID());		
		
		
		resp.getWriter().println((new Gson()).toJson(PollingStationDataAccess.getPollingStations(true)));
	}
}
