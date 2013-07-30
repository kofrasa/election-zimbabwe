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
import com.rancard.election.models.Province;
import com.rancard.election.persistence.ConstituencyDataAccess;
import com.rancard.election.persistence.ProvinceDataAccess;

@SuppressWarnings("serial")
public class ConstituencyApi  extends HttpServlet{
	private static final Logger log = Logger.getLogger(UserApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String id = req.getParameter("id");
		String province = req.getParameter("province");
		String result = req.getParameter("result");
		String name = req.getParameter("name");
		
		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(id == null || id.equals(""))){
			try{
				Long.parseLong(id);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(ConstituencyDataAccess.getConstituenciesByID(Long.parseLong(id))));
		
		}else if(!(name == null || name.equals(""))){
			
			Constituency con = ConstituencyDataAccess.getConstituencyByName(name);
			if(con == null){
				resp.getWriter().println("[]");
			}else{
				resp.getWriter().println(gson.toJson(ConstituencyDataAccess.getConstituenciesByID(con.getId())));
			}
		
		}else if(!(result == null || result.equals("")) && !(province == null || province.equals(""))){
			Province p = ProvinceDataAccess.getProvince(province);
			if(p == null){
				resp.sendError(400);
				return;
			}
			
			if(result.equalsIgnoreCase("presidential")){
				resp.getWriter().println(gson.toJson(ConstituencyDataAccess.summariseConstituencyPresidentialData(p.getID())));
			}else if(result.equalsIgnoreCase("house")){
				resp.getWriter().println(gson.toJson(ConstituencyDataAccess.summariseConstituencyPaliamentaryData(p.getID())));
			}
		}else if(!(province == null || province.equals(""))){
			try{
				Long.parseLong(province);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}			
			
			resp.getWriter().println(gson.toJson(ConstituencyDataAccess.getConstituenciesByProvince(Long.parseLong(province))));
		}else{
			resp.getWriter().println(gson.toJson((ConstituencyDataAccess.getConstituencies())));
		}
	}
	
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String name = req.getParameter("name");
		String province = req.getParameter("province");
		
		
		if(name == null || name.equals("") || province == null || province.equals("")){
			resp.sendError(400);
			return;
		}
		
		try{
			Long.parseLong(province);
		}catch(Exception e){
			resp.sendError(400);
			return;
		}
		
		List<Province> provinces = ProvinceDataAccess.getProvinceByID(Long.parseLong(province));		
		
		if(provinces == null || provinces.isEmpty()){
			resp.sendError(400);
			return;
		
		}
		
				
		ConstituencyDataAccess.insert(name, Long.parseLong(province), provinces.get(0).getName());
		
		resp.getWriter().println((new Gson()).toJson(ConstituencyDataAccess.getConstituencies()));
		
	}
}
