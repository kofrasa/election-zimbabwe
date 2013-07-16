package com.rancard.election;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
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
	private static final Logger log = Logger.getLogger(DataEntryHandler.class
			.getName());

	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws IOException {
		log.info(req.getQueryString());

		UserService userService = UserServiceFactory.getUserService();
		User user = userService.getCurrentUser();

		String thisURL = req.getRequestURI();

		resp.setContentType("text/html");
		if (user != null) {
			log.info("User has logged in");
			com.rancard.election.models.User dbaseUser = UserDataAccess
					.findUser(user.getEmail());

			if (dbaseUser == null) {
				log.info("User does not have access");
				resp.getWriter()
						.println(
								"<p>Hello, "
										+ req.getUserPrincipal().getName()
										+ "!  You do not have permission to use this service. You can <a href=\""
										+ userService.createLogoutURL(thisURL)
										+ "\">sign out</a>.</p>");
			} else {
				resp.setContentType("text/html");
				
				String response = writeHTMLStart()
						+ writeHeader(user.getEmail(), userService.createLogoutURL(thisURL))
						+ writeContent()
						+ writeHTMLEnd();
				
				
				resp.getWriter().println(response);
			}
		} else {
			resp.getWriter().println(
					"<p>Please <a href=\""
							+ userService.createLoginURL(thisURL)
							+ "\">sign in</a>.</p>");
		}
	}

	private String writeHTMLStart() {
		String html = "<!DOCTYPE html>\n" 
				+ "<html>\n" 
				+ "	<head>\n"
				+ "		<title>Election Results from Google (Data Entry)</title>\n" 
				+ "		<link rel=\"stylesheet\" type=\"text/css\" href=\"css/data-entry.css\">\n"
				+ "	</head>\n"
				+ "	<body>\n";

		return html;
	}

	private String writeHeader(String email, String signOutURL) {
		String header = "		<div id = \"explorer\">\n" 
				+ "		<div id = \"header\">\n"
				+ "			<div id = \"logo\">\n"
				+ "			</div>\n"
				+ "			<div id = \"user-info\">\n" 
				+ "				<ul>\n" 
				+ "					<li><strong>" + email	+ "</strong></li>\n" 
				+ "					<li>|</li>"
				+ "					<li><a href=\"" + signOutURL + "\">sign out</a></li>\n" 
				+ "				</ul>\n" 
				+ "			</div>\n" 
				+ "		</div>\n";

		return header;
	}
	
	private String writeContent(){
		String html = "			<div id = \"content\">"
				+ "				<div id = \"tabs\">\n"
				+ "					<div id = \"users-tab\" class = \"tab\">Users</div>\n"
				+ "					<div id = \"pollingstations-tab\" class = \"tab\">Polling Stations</div>\n"
				+ "					<div id = \"wards-tab\" class = \"tab\">Wards</div>\n"
				+ "					<div id = \"constituencies-tab\" class = \"tab\">Constituencies</div>\n"
				+ "					<div id = \"provinces-tab\" class = \"tab\">Provinces</div>\n"
				+ "				</div>\n"
				+ "				<div class = \"tabs-clear\"></div>"
				+ "				<div class = \"tab-content\"></div>"		
				+ "			</div>";
		return html;
	}
	
	private String writeHTMLEnd(){
		String html = "		</div>\n"
				+ "	</body>\n"
				+ "</html>\n";
		
		return html;
	}
}
