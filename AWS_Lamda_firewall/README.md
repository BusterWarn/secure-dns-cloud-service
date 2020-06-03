# Aws lamda firewall

This Aws lamda firewall is a prototype as part of a [bachelor thesis paper](https://www.umu.se/) by Buster Hultgren Wärn. It is built together with Tony Berglund.

# Installation

Clone or download the git repository. From this directory `secure-dns-cloud-service/DNS_firewall` run the following command to install npm packgages.
Setup a AWS lamda enviroment.
upload each zipfile from the subfolders of secure-dns-cloud-service/AWS_lamda_firewall to a seperate lamda function with the same name.

the functions are:

secure_dns_service
dns_security_filter
dns_caching
dns_tls_query


every fuction need an api setup in AWS API gateway.
They also need neccecary premmisions from lamda to execute.
to execute sperate functions use the url from the API gateway


# secure_dns_service

controller class that binds the other functions togheter.

Needs to implement GET method with the following attribute 
{
	domain:
}
needs premmision to invoke other lamda functions.


# dns_security_filter

advices a security filter to get reputation of an ip.
using mockdata now but have the oppertunity to connect to a domain fiklter API.

Needs to implement GET method with the following attribute 
{
	ip:
}
needs premmision to be invoked by other lamda functions.

# dns_caching

recponcible for retrive and store data to cache.

Needs to implement GET method with the following attribute 
{
	domain:
	http_method
}

Needs to implement POST method with the following attribute 
{
	domain:
	ip:
	ttl:
	http_method
}

Needs to implement DELETE method with the following attribute 
{
    password:
    http_method:
}

needs premmision to be invoked by other lamda functions.
needs premmision to read/write to aws mongoDB.

# dns_tls_lookup

does external lookup to 1.1.1.1.

Needs to implement GET method with the following attribute 
{
	domain:
}
needs premmision to be invoked by other lamda functions.
