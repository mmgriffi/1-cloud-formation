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

## Contact
Feel free to contact mailto:L00213529@atu.ie with questions or suggestions.