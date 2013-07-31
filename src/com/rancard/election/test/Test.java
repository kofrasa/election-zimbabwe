package com.rancard.election.test;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.rancard.election.json.WardApi;
import com.rancard.election.models.Constituency;
import com.rancard.election.models.Ward;
import com.rancard.election.persistence.ConstituencyDataAccess;
import com.rancard.election.persistence.PollingStationDataAccess;
import com.rancard.election.persistence.WardDataAccess;

@SuppressWarnings("serial")
public class Test extends HttpServlet {
	
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		String constituency = req.getParameter("constituency");
		String ward = req.getParameter("ward");
		String pollingStation = req.getParameter("polling_station");

		Constituency con = ConstituencyDataAccess.getConstituencyByName(constituency);
		if(con == null){
			resp.sendError(400);
			return;
		}
		
		List<Ward> wards = WardDataAccess.getWardsByConstituency(con.getId());
		Long wardId = getWardID(wards, Long.parseLong(ward));
		if(wardId == null){
			WardDataAccess.insert(Long.parseLong(ward), con.getId(), con.getName(), con.getProvince(), con.getProvinceName());
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			wardId = getWardID(WardDataAccess.getWardsByConstituency(con.getId()), Long.parseLong(ward));
			PollingStationDataAccess.insert(pollingStation, wardId, Long.parseLong(ward), con.getId(), 
					con.getName(), con.getProvince(), con.getProvinceName());
		}
		
		PollingStationDataAccess.insert(pollingStation, wardId, Long.parseLong(ward), con.getId(), 
				con.getName(), con.getProvince(), con.getProvinceName());
	}
	private static final Logger log = Logger.getLogger(WardApi.class.getName());
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		String constituency = req.getParameter("constituency");
		String ward = req.getParameter("ward");
		String pollingStation = req.getParameter("polling_station");

		Constituency con = ConstituencyDataAccess.getConstituencyByName(constituency.trim());
		if(con == null){
			log.severe("Constituency nof Found");
			resp.sendError(400, "COnstituency Not found");
			return;
		}
		
		List<Ward> wards = WardDataAccess.getWardsByConstituency(con.getId());
		Long wardId = getWardID(wards, Long.parseLong(ward));
		if(wardId == null){
			WardDataAccess.insert(Long.parseLong(ward), con.getId(), con.getName(), con.getProvince(), con.getProvinceName());
			try {
				Thread.sleep(100);
			} catch (InterruptedException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			
			wardId = getWardID(WardDataAccess.getWardsByConstituency(con.getId()), Long.parseLong(ward));
			PollingStationDataAccess.insert(pollingStation, wardId, Long.parseLong(ward), con.getId(), 
					con.getName(), con.getProvince(), con.getProvinceName());
		}
		
		PollingStationDataAccess.insert(pollingStation, wardId, Long.parseLong(ward), con.getId(), 
				con.getName(), con.getProvince(), con.getProvinceName());
	}
	
	private Long getWardID(List<Ward> wards, Long number) {
		for(Ward ward: wards){
			if(ward.getWardNumber().longValue() == number.longValue()){
				return ward.getId();
			}
		}
		return null;
	}
}
