package com.rancard.election.json;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.rancard.election.models.Constituency;
import com.rancard.election.models.ElectionType;
import com.rancard.election.persistence.ConstituencyDataAccess;
import com.rancard.election.persistence.WardDataAccess;

@SuppressWarnings("serial")
public class WardApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(WardApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String number = req.getParameter("number");
		String constituency = req.getParameter("constituency");
		String constituencyName = req.getParameter("constituency_name");
		String result = req.getParameter("result");
		
		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(number == null || number.equals(""))){
			try{
				Long.parseLong(number);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(WardDataAccess.getWardsByID(Long.parseLong(number))));
		}else if(!(constituency == null || constituency.equals(""))){
			try{
				Long.parseLong(constituency);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(WardDataAccess.getWardsByConstituency(Long.parseLong(constituency))));
		}else if(!(constituencyName == null || constituencyName.equals(""))){
			Constituency con = ConstituencyDataAccess.getConstituencyByName(constituencyName);
			if(con == null){
				resp.getWriter().println("[]");
			}else{
				resp.getWriter().println(gson.toJson(WardDataAccess.summariseWards(con.getId(), 
						ElectionType.valueOf(result.toUpperCase()))));
			}
			
		}else{
			resp.getWriter().println(gson.toJson(WardDataAccess.getWards()));
		}
	}
	
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String number = req.getParameter("number");
		String constituency = req.getParameter("constituency");
		
		
		if(number == null || number.equals("") || constituency == null || constituency.equals("")){
			resp.sendError(400);
			return;
		}
		
		try{
			Long.parseLong(number);
		}catch(Exception e){
			resp.sendError(400);
			return;
		}
		
		try{
			Long.parseLong(constituency);
		}catch(Exception e){
			resp.sendError(400);
			return;
		}
		
		List<Constituency> constituencies = ConstituencyDataAccess.getConstituenciesByID(Long.parseLong(constituency));
		if(constituencies == null || constituencies.isEmpty()){
			resp.sendError(400);
			return;
		
		}
		Constituency con = constituencies.get(0); 
		WardDataAccess.insert(Long.parseLong(number), Long.parseLong(constituency), con.getName(), con.getProvince(), con.getProvinceName());
		
		resp.getWriter().println((new Gson()).toJson(WardDataAccess.getWards()));
	}
}
