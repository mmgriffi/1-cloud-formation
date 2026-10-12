# Using CLI Commands to create a S3 bucket and static website.

The AWS turorial https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html give the steps to create a static S3 website. 
Use CLI commands so the process can be repeated or modified. 

* Create S3 Bucket

```aws s3api create-bucket \
    --bucket atu-l00213529-cloudformation \
    --region eu-west-1 \
    --create-bucket-configuration LocationConstraint=eu-west-1
```
That should return

```{
    "Location": "http://atu-l00213529-cloudformation.s3-website-eu-west-1.amazonaws.com"
}```

* Check the s3 bucket

``` aws s3api get-bucket-location \
    --bucket atu-l00213529-cloudformation ```

* Configure static content 
  I have created a basic index.html and 404.hml document with a css file. This will be copied to the S3 bucket once created.

``` aws s3 cp src/ s3://atu-l00213529-cloudformation/ --recursive ```

* Enable static website hosting

```aws s3 website s3://atu-l00213529-cloudformation/ \
    --index-document index.html \
    --error-document 404.html```

* Edit Block Public Address settings

```aws s3api put-public-access-block \
    --bucket atu-l00213529-cloudformation \
    --public-access-block-configuration \
    BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false
```

* Create bucket policy to make content publicy available. This in a file called bucket-policy.json

{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadForWebsite",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::atu-l00213529-cloudformation/*"
    }
  ]
}

* Apply the file 
``` aws s3api put-bucket-policy \
    --bucket atu-l00213529-cloudformation \
    --policy file://bucket-policy.json ```

* Test Endpoint

``` curl http://atu-l00213529-cloudformation.s3-website-eu-west-1.amazonaws.com ```

* AWS Cloudformation IaC generator

Once this is setup and verified use AWS CloudFormation IaC generator to create the Cloud Formation script. 

* Cleanup

to avoid costs remove the s3 bucket
``` aws s3 rm s3://atu-l00213529-cloudformation --recursive
aws s3api delete-bucket --bucket atu-l00213529-cloudformation````