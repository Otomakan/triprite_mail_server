import * as shell from "shelljs";

shell.mkdir("dist/emailTemplates")
shell.cp("-R", "src/emailTemplates/testEmailTemplate", "dist/emailTemplates/testEmailTemplate");
shell.cp("-R", "src/emailTemplates/ticketIssueSuccess", "dist/emailTemplates/ticketIssueSuccess");

