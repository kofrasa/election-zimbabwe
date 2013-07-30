package com.rancard.election.json;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.rancard.election.models.Role;
import com.rancard.election.persistence.UserDataAccess;
import com.rancard.election.models.User;


@SuppressWarnings("serial")
public class UserApi extends HttpServlet {
	private static final Logger log = Logger.getLogger(UserApi.class.getName());
	
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		log.info("Query String:" + req.getQueryString());	
		resp.setContentType("application/json");
		
		String email = req.getParameter("email");
		String role = req.getParameter("role");
		resp.setStatus(200);
		
		Gson gson = new Gson();
		if(!(email == null || email.equals(""))){
			resp.getWriter().println(gson.toJson(UserDataAccess.getUsers(email)));
		}else if(!(role == null || role.equals(""))){
			if(role.equalsIgnoreCase("ALL")){
				resp.getWriter().println(gson.toJson(UserDataAccess.getUsers()));
				return;
			}
			if(Role.valueOf(role.toUpperCase()) == null){
				resp.sendError(400);
				return;
			}
			resp.getWriter().println(gson.toJson(UserDataAccess.getUsers(Role.valueOf(role.toUpperCase()))));
		}else{
			resp.getWriter().println(gson.toJson(UserDataAccess.getUsers()));
		}
		
	}
	
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {

		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String email = req.getParameter("email");
		String role = req.getParameter("role");
		String name = req.getParameter("name");
		
		if(email == null || email.equals("")){
			resp.sendError(400);
			return;
		}
		
		String action = req.getParameter("action");
		if(action == null || action.equals("") || action.equalsIgnoreCase("ADD")){
			List<User> existingUsers = UserDataAccess.getUsers(email);
			if(!(existingUsers == null || existingUsers.isEmpty())){
				resp.sendError(403);
				return;
			}
		}	
		
		
		List<User> users = UserDataAccess.getUsers();
		List<User> moreUsers = new ArrayList<>(users);
		
		if(!(action==null) && action.equalsIgnoreCase("DELETE")){
			UserDataAccess.deleteUser(email);
			User userToRemove = getUser(moreUsers, email);
			if(userToRemove != null){
				moreUsers.remove(userToRemove);
			}
			
			Gson gson = new Gson();		
			resp.getWriter().println(gson.toJson(moreUsers));
			return;
		}
		
		if(role == null || role.equals("") || Role.valueOf(role.toUpperCase()) == null || name == null || name.equals("")){
			resp.sendError(400);
			return;
		}
				
		User user = new User(email, Role.valueOf(role.toUpperCase()), name, new Date(), new Date());
		UserDataAccess.insert(user);
		if(action == null || action.equals("") || action.equalsIgnoreCase("ADD")){
			moreUsers.add(user);
			resp.setStatus(201);
		}else if(action.equalsIgnoreCase("EDIT")){
			log("In Edit");
			User userToRemove = getUser(moreUsers, email);
			if(userToRemove != null){
				moreUsers.remove(userToRemove);
			}
			
			moreUsers.add(user);
		}
		Gson gson = new Gson();		
		resp.getWriter().println(gson.toJson(moreUsers));
	}
	
	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		log.info("Query String:" + req.getQueryString());
		resp.setContentType("application/json");
		
		String email = req.getParameter("email");
		if(email == null || email.equals("")){
			resp.sendError(400);
			return;
		}
		
		List<User> users = UserDataAccess.getUsers();
		List<User> moreUsers = new ArrayList<>(users);
		
		UserDataAccess.deleteUser(email);
		User userToRemove = getUser(moreUsers, email);
		if(userToRemove != null){
			moreUsers.remove(userToRemove);
		}
		
		Gson gson = new Gson();		
		resp.getWriter().println(gson.toJson(moreUsers));
	}
	
	private User getUser(List<User> users, String email){
		for(User u: users){
			if(u.getEmail().equals(email)){
				return u;
			}
		}
		return null;
	}
	
	
}
