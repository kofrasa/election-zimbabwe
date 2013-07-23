package com.rancard.election;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import com.rancard.election.persistence.UserDataAccess;

@SuppressWarnings("serial")
public class DataEntryHandler extends HttpServlet {
	private static final Logger log = Logger.getLogger(DataEntryHandler.class.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		log.info(req.getQueryString());

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		String thisURL = req.getRequestURI();

		resp.setContentType("text/html");
		/*if (user != null) {
			log.info("User has logged in");
			com.rancard.election.models.User dbaseUser = UserDataAccess
					.getUsers(user.getEmail());

			if (dbaseUser == null) {
				log.info("User does not have access");
				resp.getWriter()
						.println(
								"<p>Hello, "
										+ req.getUserPrincipal().getName()
										+ "!  You do not have permission to use this service. You can <a href=\""
										+ userService.createLogoutURL(thisURL)
										+ "\">sign out</a>.</p>");
			} else {*/
				resp.setContentType("text/html");
				
				BufferedReader reader = null;				
				String response = "";
				try	{
					reader = new BufferedReader(new FileReader("js/data_entry/data_entry.html"));		
					String line = null;
			
					while((line = reader.readLine())!=null){
						response = response + line + "\n";
					}
					
					//response = response.replace("{{user_email}}", user.getEmail());
					//response = response.replace("{{user_signout_url}}", userService.createLogoutURL(thisURL));
					
					resp.getWriter().println(response);
				}catch(Exception e){
					log.log(Level.SEVERE, "There was a problem: "+e.getMessage());
					resp.getWriter().println("ERROR");
					
				}finally{
					if(reader !=null){
						reader.close();
					}
				}			
				
			/*}
		} else {
			resp.getWriter().println(
					"<p>Please <a href=\""
							+ userService.createLoginURL(thisURL)
							+ "\">sign in</a>.</p>");
		}*/
	}


	
}
