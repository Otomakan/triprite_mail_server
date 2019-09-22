import * as shell from "shelljs";

shell.rm("-rf","dist/emailTemplates")
// shell.mkdir("dist/emailTemplates")
shell.cp("-R", "src/emailTemplates", "dist/emailTemplates")
// shell.cp("-R", "src/emailTemplates/testEmailTemplate", "dist/emailTemplates/testEmailTemplate");
// shell.cp("-R", "src/emailTemplates/ticketIssueSuccess", "dist/emailTemplates/ticketIssueSuccess");
// shell.cp("-R", "src/emailTemplates/issueTicketTemplate", "dist/emailTemplates/issueTicketTemplate");


