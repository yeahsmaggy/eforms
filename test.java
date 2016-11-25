package uk.gov.selfserve;

import java.io.*;

import javax.mail.MessagingException;
import javax.servlet.*;
import javax.servlet.http.*;

import org.apache.log4j.Logger;

import java.io.PrintWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.ArrayList;
 
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.edit.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import com.google.gson.JsonObject;

//HttpServlet gets request response
public class BenefitChangeofDetailsPdf extends HttpServlet {
//custom logger
	static Logger log = Logger.getLogger(BenefitChangeofDetailsPdf.class);
	private ErrorHandling errorHandler;
	private PDDocument document;
	private PDPage page;
	private PDRectangle rect;
	private PDPageContentStream cos;
	private static final long serialVersionUID = 1L;
	public void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws IOException, ServletException
			{

		log.info("Running");
		
		boolean blnPDFCreated = false;
		//todo pdf moved after successful move
		boolean blnPDFEmailed = false;
		//static variables for error handling
		String   laganSystem      = getServletContext().getInitParameter("laganSystem");

		String strPDFLocation = "";
		String strPDFEmailTo = "";
		//checking which environment test or live
		//getInitParameter looks in web.xml
		if(laganSystem.equalsIgnoreCase("live")){
			strPDFLocation = getServletConfig().getInitParameter("PDFLocation");
			strPDFEmailTo  = getServletConfig().getInitParameter("PDFEmailTo");
		}
		else
		{
			strPDFLocation = getServletConfig().getInitParameter("PDFLocation-test");
			strPDFEmailTo  = getServletConfig().getInitParameter("PDFEmailTo-test");
		}
		strPDFLocation = getServletContext().getRealPath(strPDFLocation);


		String   strSmtpHost      = getServletContext().getInitParameter("smtpHost");
		String   strEmailFrom     = getServletContext().getInitParameter("emailFrom");
		String[] strErrorEmailTo  = { getServletContext().getInitParameter("errorEmailTo") };
		String[] strErrorEmailBCC = new String[0];
		String[] strEmailBCC      = {getServletConfig().getInitParameter("bccEmailAddress")};

		DateFormat dtfNow = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		Date       dteNow = new Date();
		String     strNow = dtfNow.format(dteNow);
	    
		errorHandler = new ErrorHandling(strNow,laganSystem,strErrorEmailTo,strErrorEmailBCC,strEmailFrom,strSmtpHost);
		//query string variables	
		Map<String, String[]> strQueryString = request.getParameterMap();
		//copy to new changeable map
		Map<String, String[]> strParameters  = new HashMap<String, String[]>();
		strParameters.putAll(strQueryString);
		
        String strTitle  = "";
        String strHeader = "";
        String strReferenceNumber = "";
        String strCaseReference = "";
        int intLine = 1;
		
		//pull out parameters
		//System.out.printline("blah");
		
		
		//iterate over the items we have in the Hash
		for (Map.Entry<String, String[]> entry : strQueryString.entrySet()) {
		    String key = entry.getKey();
		    String[] value = entry.getValue();
			log.info(key);
			for (String str : value){
				log.info(str);
			}


			try{

			}catch (Exception error)
	    {
    	log.error("BenefitChangeofDetailsPdf - " + error.toString());
		errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed Creating PDF",error.toString(),"");	
	    }
		}
		
        
	    try
	    {
        	intLine = funCreateDocument();   	   
	    	strHeader = "Claimant Details:";
	    	intLine = funCreatePage(strHeader,strTitle);
	    	
	    	//Claimant Details
	    	intLine = funWriteLine(strHeader, strTitle, "Claimant Name:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantName, intLine, 0,2);

	    	intLine = funWriteLine(strHeader, strTitle, "Claimant Address:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantAddress, intLine, 0,2);

	    	intLine = funWriteLine(strHeader, strTitle, "Claimant Telephone:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantTelephone, intLine, 0,2);

	    	intLine = funWriteLine(strHeader, strTitle, "Claimant Email Address:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantEmail, intLine, 0,2);

	    	intLine = funWriteLine(strHeader, strTitle, "Claimant HB Reference:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantHBReference, intLine, 0,2);

	    	intLine = funWriteLine(strHeader, strTitle, "Claimant National Insurance Number:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, txtClaimantNationalInsuranceNumber, intLine, 0,2);

	    	//Are you the landlord  / agent
	    	intLine = funWriteLine(strHeader, strTitle, "Are you the Landlord/Agent?:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, selectLandlordAgent, intLine, 0,2);
	    	if (selectLandlordAgent.equals("No")){
		    	intLine = funWriteLine(strHeader, strTitle, "Agent/Landlord Name :", intLine, 1,1);
		    	intLine = funWriteLine(strHeader, strTitle, txtLandlordAgentName, intLine, 0,2);

		    	intLine = funWriteLine(strHeader, strTitle, "Agent/Landlord Address :", intLine, 1,1);
		    	intLine = funWriteLine(strHeader, strTitle, txtLandlordAgentAddress, intLine, 0,2);

		    	intLine = funWriteLine(strHeader, strTitle, "Agent/Landlord Email Address :", intLine, 1,1);
		    	intLine = funWriteLine(strHeader, strTitle, txtLandlordAgentEmailAddress, intLine, 0,2);

		    	intLine = funWriteLine(strHeader, strTitle, "Agent/Landlord Telephone:", intLine, 1,1);
		    	intLine = funWriteLine(strHeader, strTitle, txtLandlordAgentTelephone, intLine, 0,2);
	    	};
	    	
	    	//Nature of the request
	    	intLine = funWriteLine(strHeader, strTitle, "Nature of Request:", intLine, 1,1);
	    	intLine = funWriteLine(strHeader, strTitle, selectNatureRequest, intLine, 0,2);
	    	
			switch (selectNatureRequest) {
				case "change-of-address":
			
					//change-of-address
					String txtWhenMoveTakePlace = strParameters.get("txtWhenMoveTakePlace")[0];
					String txtWhenDidTenancyStart = strParameters.get("txtWhenDidTenancyStart")[0];
					String txtWhatNewRentalAmount = strParameters.get("txtWhatNewRentalAmount")[0];
					String txtTotalNumberBedroom = strParameters.get("txtTotalNumberBedroom")[0];
					String txtAnyAdditionalInformation = strParameters.get("txtAnyAdditionalInformation")[0];
					
					
			    	intLine = funWriteLine(strHeader, strTitle, "When did the move take place?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtWhenMoveTakePlace, intLine, 0,2);
			
			    	intLine = funWriteLine(strHeader, strTitle, "When did the tenancy start?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtWhenDidTenancyStart, intLine, 0,2);
			
			    	intLine = funWriteLine(strHeader, strTitle, "What is the new rental amount?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtWhatNewRentalAmount, intLine, 0,2);
			
			    	intLine = funWriteLine(strHeader, strTitle, "Total number of bedrooms?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtTotalNumberBedroom, intLine, 0,2);
			
			    	intLine = funWriteLine(strHeader, strTitle, "Any additional information?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtAnyAdditionalInformation, intLine, 0,2);
					
			    	break;
			    	
				case "change-of-income": 
					
					//change-of-income
					String txtIncomeChange = strParameters.get("txtIncomeChange")[0];
					String txtIncomeWhoRelateTo = strParameters.get("txtIncomeWhoRelateTo")[0];
					String txtIncomeWhenChangeTakePlace = strParameters.get("txtIncomeWhenChangeTakePlace")[0];
					String txtIncomeNameExployer = strParameters.get("txtIncomeNameExployer")[0];
					String txtIncomeNumberHoursWorked = strParameters.get("txtIncomeNumberHoursWorked")[0];
					String txtIncomeStartDate = strParameters.get("txtIncomeStartDate")[0]; 
					String txtIncomeFinishDate = strParameters.get("txtIncomeFinishDate")[0];
					String txtIncomeCurrentSource = strParameters.get("txtIncomeCurrentSource")[0];
					String txtIncomeClaimDate = strParameters.get("txtIncomeClaimDate")[0];
					String txtIncomeMoreInfo = strParameters.get("txtIncomeMoreInfo")[0];
					
					
			    	intLine = funWriteLine(strHeader, strTitle, "What is the change?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeChange, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Who does it relate to?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeWhoRelateTo, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "When did the change take place?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeWhenChangeTakePlace, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Name of the employer?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeNameExployer, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Number of hours worked?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeNumberHoursWorked, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Start date:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeStartDate, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Finish Date?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeFinishDate, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Current source of income?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeCurrentSource, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Claim Date?:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeClaimDate, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "More information:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtIncomeMoreInfo, intLine, 0,2);
			    	
			    	break;
			    	
				case  "change-of-household":
				
					
					//change-of-household
					String txtChangeHouseholdTypeChange = strParameters.get("txtChangeHouseholdTypeChange")[0];
					String txtChangeHouseholdNamePersonMoving = strParameters.get("txtChangeHouseholdNamePersonMoving")[0];
					String txtChangeHouseholdDateChangeOccurred = strParameters.get("txtChangeHouseholdDateChangeOccurred")[0];
					String txtChangeHouseholdIncome = strParameters.get("txtChangeHouseholdIncome")[0];
					String txtChangeHouseholdWhereComeFrom = strParameters.get("txtChangeHouseholdWhereComeFrom")[0];
					String txtChangeHouseholdChildEnterDob = strParameters.get("txtChangeHouseholdChildEnterDob")[0];
					String txtChangeHouseholdMoreInformation = strParameters.get("txtChangeHouseholdMoreInformation")[0];
					
					
			    	intLine = funWriteLine(strHeader, strTitle, "Type of Change:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdTypeChange, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "Name(s) of person moving:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdNamePersonMoving, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "Date Change occurred :", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdDateChangeOccurred, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "Income:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdIncome, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "Where they come from:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdWhereComeFrom, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "If Child please enter dob :", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdChildEnterDob, intLine, 0,2);
	
			    	intLine = funWriteLine(strHeader, strTitle, "More information:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeHouseholdMoreInformation, intLine, 0,2);
			    	
			    	
				case "change-of-rent":
					
					
					String txtChangeRentDateChange = strParameters.get("txtChangeRentDateChange")[0];
					String txtChangeRentAmountNewRent = strParameters.get("txtChangeRentAmountNewRent")[0];
					String txtChangeRentMoreInformation = strParameters.get("txtChangeRentMoreInformation")[0];
					
					
			    	intLine = funWriteLine(strHeader, strTitle, "Date of Change:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeRentDateChange, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "Amount of new rent:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeRentAmountNewRent, intLine, 0,2);

			    	intLine = funWriteLine(strHeader, strTitle, "More information:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtChangeRentMoreInformation, intLine, 0,2);
			    	
			    	break;
			    	
				case "other-change":
					
					String txtOtherChangeMoreInformation = strParameters.get("txtOtherChangeMoreInformation")[0];

			    	intLine = funWriteLine(strHeader, strTitle, "More information:", intLine, 1,1);
			    	intLine = funWriteLine(strHeader, strTitle, txtOtherChangeMoreInformation, intLine, 0,2);
			    	
			    	break;

			}    	
	        intLine = funSavePage(); 
	        
			strPDFLocation = strPDFLocation + "/" + strReferenceNumber + ".pdf";
	        intLine = funSaveDocument(strPDFLocation);
	        
	        blnPDFCreated = true;
        }
	    catch (Exception error)
	    {
    	log.error("BenefitChangeofDetailsPdf - " + error.toString());
		errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed Creating PDF",error.toString(),"");	
	    }
               
        if ( blnPDFCreated)
        {
	    try
	    {
	    	//todo:move the file instead of email
        	funSendEmail(strPDFEmailTo,strEmailBCC,strPDFLocation,strReferenceNumber,strEmailFrom, strSmtpHost);
        	blnPDFEmailed = true;      	
        }
	    catch (Exception error)
	    {
    	log.error("BenefitChangeofDetailsPdf - " + error.toString());
		errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed Emailing PDF",error.toString(),"");	
	    }    
        }

		JsonObject results = new JsonObject();

		if ( blnPDFEmailed )
		{
			results.addProperty("success", true);
			results.addProperty("caseReference" , strCaseReference);	
		}
		else
		{
			results.addProperty("success", false);
			results.addProperty("message", "Error");	
		}

	    //like print_r
	    PrintWriter writer = response.getWriter();
		response.setContentType("application/json");
		
		writer.write(results.toString());
		writer.flush();
		writer.close();
		
		log.info("Finished");
		
	}
	
	private int funWriteLine(String strHeader, String strTitle,String strText, int intLine, int gap, int style) throws Error
	{
	    PDFont font = PDType1Font.HELVETICA;
	    int intLineLength = 98; 
		
	    gap = ( ( gap * 15 ) + 15 );
	    
		if (style == 1){font = PDType1Font.HELVETICA_BOLD;intLineLength = 98;}
		if (style == 2){font = PDType1Font.COURIER;intLineLength = 75;}
		if (style == 3){font = PDType1Font.COURIER_BOLD;intLineLength = 75;}
		
		strText = strText.replaceAll("[\\n\\r]", " xnewlinex ");
		strText = strText.replaceAll("[\\t]", "   ");
		
		String [] splitwords = strText.split(" ");
		ArrayList<String> words = new ArrayList<String>();
		ArrayList<String> lines = new ArrayList<String>();
		StringBuilder line = new StringBuilder();
		
		
		for (String word : splitwords)
		{
			while (word.length() > intLineLength)
			{
				words.add(word.substring(0,intLineLength));
				word = word.substring(intLineLength);
			}
			words.add(word);
		}
		
		for (String word : words)
		{
			word = word.replaceAll("[^\\p{Print}]", "");
			
			if ( !(word.equals("xnewlinex")))
			{
				if ( line.length() + word.length() < intLineLength)
				{
					line.append(word + " ");				
				}
				else
				{
					lines.add(line.toString());
					line = new StringBuilder();
					line.append(word + " ");
				}
			}
			else
			{
				lines.add(line.toString());
				line = new StringBuilder();
				line.append("");
			}
		}
		lines.add(line.toString());
		
		for ( String text : lines)
		{
			intLine = intLine - gap;
			gap = 15;
			
			if (intLine < 50)
			{
				intLine = funSavePage();
				intLine = funCreatePage(strHeader,strTitle);
				intLine = intLine - 30;
			}
		    try
		    {
	    	cos.beginText();
	    	cos.setFont(font, 12);
	    	cos.moveTextPositionByAmount(25,intLine);
	    	cos.drawString(text);
	    	cos.endText();
		    }
		    catch (Exception error)
		    {
	    	log.error("Writing a PDF line - " + error.toString());
			errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Writing a PDF line",error.toString(),"");	
			throw new Error("Writing a PDF line - " + error.toString()); 
		    }
		}
		
        return intLine;
	}
	
	private int funCreatePage(String strHeader, String strTitle) throws Error
	{
		int intLine = 0;
		
		PDFont fontPlain = PDType1Font.HELVETICA;
	    PDFont fontBold = PDType1Font.HELVETICA_BOLD;
	    		
	    try
	    {
	    	page = new PDPage(PDPage.PAGE_SIZE_A4);
	    	rect = page.getMediaBox();
        
	    	intLine = Math.round(rect.getHeight());

	    	document.addPage(page);

	    	cos = new PDPageContentStream(document, page);
	    
	    	intLine = intLine - 30;
	    	cos.beginText();
	    	cos.setFont(fontBold, 24);
	    	cos.moveTextPositionByAmount(25,intLine);
	    	cos.drawString(strTitle);
	    	cos.endText();
        
	    	intLine = intLine - 30;
	    	cos.beginText();
	    	cos.setFont(fontPlain, 24);
	    	cos.moveTextPositionByAmount(25,intLine);
	    	cos.drawString(strHeader);
	    	cos.endText();
	    }
	    catch (Exception error)
	    {
	    	log.error("Creating a PDF page - " + error.toString());
			errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Creating a PDF page",error.toString(),"");	
			throw new Error("Creating a PDF page - " + error.toString()); 
	    }
        
	    return intLine;
	}

	private int funSavePage() throws Error
	{
		int intLine = 0;
		
	    try
	    {
	    	cos.close();
	    }
	    catch (Exception error)
	    {
	    	log.error("Saving a PDF page - " + error.toString());
			errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Saving a PDF page",error.toString(),"");	
			throw new Error("Saving a PDF page - " + error.toString()); 
	    }
	    
	    return intLine;
	}
	
	private int funCreateDocument() throws Error
	{
	    int intLine = 0;
		
	    try
	    {	
	    	document = new PDDocument();
	    }
	    catch (Exception error)
	    {
	    	log.error("Creating a PDF document - " + error.toString());
			errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Creating a PDF document",error.toString(),"");	
			throw new Error("Creating a PDF document - " + error.toString()); 
		}
	    
	    return intLine;
	}
	
	private int funSaveDocument(String strFile) throws Error
	{
	    int intLine = 0;
		
	    try
	    {	
	        document.save(strFile);
	        document.close();
	    }
	    catch (Exception error)
	    {
	    	log.error("Saving a PDF document - " + error.toString());
	    	errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Saving a PDF document",error.toString(),"");	
			throw new Error("Saving a PDF document - " + error.toString()); 
		}
	    
	    return intLine;
	}
	
	private boolean funSendEmail(String strEmailTo,String[] strEmailBCC, String strAttachment, String strReference, String strEmailFrom, String strSmtpHost) throws Error
	{
	    boolean ret = true;
		
		String[] strTo      = { strEmailTo };
		String   strSubject = strReference + " - Second Property";
		String   strDetail  = strReference + " - Second Property";
		
		try
		{
			SendMail email = new SendMail();
			email.postAttachment(strTo, strEmailBCC, strSubject, strDetail, strEmailFrom, strSmtpHost, true, strAttachment);
		}
		catch (MessagingException error)
		{			
	    	log.error("Emailing a PDF document - " + error.toString());
	    	errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Emailing a PDF document",error.toString(),"");	
			throw new Error("Emailing a PDF document - " + error.toString()); 						
		}
		catch (IOException error)
		{			
	    	log.error("Emailing a PDF document - " + error.toString());
	    	errorHandler.sendMessage("MyCouncil Failed - BenefitChangeofDetailsPdf","BenefitChangeofDetailsPdf Failed - Emailing a PDF document",error.toString(),"");	
			throw new Error("Emailing a PDF document - " + error.toString()); 						
		}
					
	    return ret;
	}
	
}



