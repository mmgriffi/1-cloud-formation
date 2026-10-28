# 1-cloud-formation
ATU Cloud Formation Assignment for Lab1
## Introduction. 
This assignment will demonstrate the concepts of three tier architectures and using S3 as a data store for static web pages.
## Branch Naming Styles
I will be using a branch naming style of **```<type>/<description>```** to aid clarity. 
Examples will be feature/001-add-index.html or doc/002-add-docs where a sequential number simulates a ticket number from a tracking system. 

##  Part 1  - Create a static website using AWS S3
Part 1 demonstrates the creation of a cloudformation script to create a static website. 
See [CLI Commands ](infra/cli/cli_commands.md) for the steps used. 

1. Create and validate Static Website. 
* Create S3 bucket, apply changes to enable static website hosting.
* Edit public address settings (to allow public access)
* Apply a bucket policy to make content publicy available. 
* Add index.html and error.html files.

2. Use AWS IaC generator.
* Scan Resources and Create Template file.
* Import to a CloudFormation Stack.
* Save template file to GitHub repository (CFtemplate-Assignment1-template.yaml). 

3.Apply the Cloud Formation Template.
````
aws cloudformation create-stack ^
  --stack-name CF-Stack-Assignment1 ^
  --template-body file://CFtemplate-Assignment1-template.yaml ^
  --region eu-west-1
````
* Redeploy the static files
aws s3 cp src/ s3://atu-l00213529-cloudformation/ --recursive --region eu-west-1

* Test the URL http://atu-l00213529-cloudformation.s3-website-eu-west-1.amazonaws.com/


## Part 2 - Create a 3 tier application (webserver, appnode + database)
To test CloudFormation I developed a a simple 3 tier application

- Web tier using node js and express. A web server on port 80 will make a call to the mid tier app via port 5000.
- App Tier using node js and express. Listening on port 5000, this will query MySQL Instance on port 3306.
- DB Tier using MySQL. Running on port 3306. Has a simple database with 2 records.

A browser session to the IP address of the web tier will return a page with a load users button. Clicking this will result in a query to the database and records returned to the page.

1. Create Networking Components. 
I created the VPC and associated components on AWS console initially. Then used IaC generator to scan applicable resources and created the Template file. Then edited the file to make a consistent naming scheme for the components. I used Co-Pilot to ID sections of the IaC generated script that were unnecessary and updated the file.

* Note : I wish to keep the VPC/subnets/security group creation seperate from the EC2 
instances and application setup. This is in line with AWS best practices (see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/best-practices.html#organizingstacks) 

* From the original layout I found that RDS Database required 2 Subnets, each in an Availability Zone, irrespective of if I was replicating the database across them  see [AWS Docs](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_VPC.WorkingWithRDSInstanceinaVPC.html). I've updated the network to that in Pull request #16 
* Further update was required to allow me pass my IP address as a paremetrer to the Network script , so the Web Security Group could add that to the inbound rules for port 22. See Pull Request #17

* The resulting Template file is CF-NetworkStack-Assignment2.yaml. Apply this as follows : 
````
aws cloudformation create-stack ^
--stack-name CF-NetworkStack-Assignment2 ^
--template-body file://CF-NetworkStack-Assignment2.yaml ^
--parameters ParameterKey=SSHLocation,ParameterValue=xx.xx.xxx.xx/32 ^
--region eu-west-1
````

![AssignmentVPC](images/AssignmentVPC.jpg)


2. Create basic Web app.
The code/files for the web application are in src\3tierapp. I got initial code from Google AI for for webfront-end and nodejs app running on pm2 (node 1) querying a mysql database on a database server (node 2).  This was expanded to a full 3 tier app , with a server script on webnode forwarding to the app tier. This was tested on homelab Ubuntu VMs with the network isolation blocking all requests to the app and db tier except from the webserver or app node respectively on defined ports.

3. Create Cloud Formation Scripts for EC2/Database. 
The initial template structure was listed in an AWS article [here](https://repost.aws/articles/ARGpERJ3jISbOAlnmfVUsvMQ/building-a-secure-and-scalable-three-tier-architecture-on-aws-using-cloudformation) and also from a AI prompt. The app in this case will be based on the code in src\3tierapp in this repo, but in this case the scripts for the nodejs components were created on the fly during standup of the EC2 instances. 

![Screenshot of webpage](images/3tierAppWebPage.png)

## ToDo/Issues
 - Using the webserver for SSH access is not recommended. Look at a bastion server.  
 - Incorrect sequencing the creation of the nodejs components caused the startup to fail.
 - Database setup is not automated. I need to ssh to the app node, login to mysql and run [init.sql](src/3tierapp/database/init.sql)
 - To enable updates to the mid-tier required an external IP address, and ensure that the "app-sg-assignment1" has an outbound rule allowing access. 
 - The external IP of the webserver is subject to change. For a production system and elastic IP and associated gateway is needed. 
 - The environment is not a high availability configuration.
 - The website is not secured with a SSL cert. 


## Co-Pilot/Google AI  prompts
Generate a basic cloud formation script that creates a basic flask based website and a rds database backend 

## Contact
Feel free to contact mailto:L00213529@atu.ie with questions or suggestions.