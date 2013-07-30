package com.rancard.election.json;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.rancard.election.models.Province;
import com.rancard.election.persistence.ProvinceDataAccess;


@SuppressWarnings("serial")
public class ProvinceApi extends HttpServlet{
	private static final Logger log = Logger.getLogger(ProvinceApi.class.getName());
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String id = req.getParameter("id");
		String result = req.getParameter("result");
		
		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(id == null || id.equals(""))){
			try{
				Long.parseLong(id);
			}catch(Exception e){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(ProvinceDataAccess.getProvinceByID(Long.parseLong(id))));
		}else if(!(result == null || result.equals(""))){
			if(result.equalsIgnoreCase("presidential")){
				resp.getWriter().println(gson.toJson(ProvinceDataAccess.summariseProvincePresidentialData()));
			}else if(result.equalsIgnoreCase("house")){
				resp.getWriter().println(gson.toJson(ProvinceDataAccess.summariseProvincePaliamentaryData()));
			}
		}else{
			resp.getWriter().println(gson.toJson(ProvinceDataAccess.getProvinces()));
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String name = req.getParameter("name");
		String id = req.getParameter("id");
		String action = req.getParameter("action");
		
		if(!(action == null || action.equals(""))){
			if(action.equals("EDIT")){
				List<Province> provinces = ProvinceDataAccess.getProvinceByID(Long.parseLong(id));
				if(provinces == null || provinces.isEmpty()){
					resp.sendError(400);
					return;
				}
				
				provinces.get(0).setName(name);
				ProvinceDataAccess.insert(provinces.get(0));
			}
		}

		
		if(name == null || name.equalsIgnoreCase("")){
			resp.sendError(400);
			return;
		}
		
		ProvinceDataAccess.insert(name);
		
		resp.getWriter().println((new Gson()).toJson(ProvinceDataAccess.getProvinces()));
	}
}
