# Secure DNS firewall

This is the repository for the code used in the bachelor thesises of Buster Hultgren Wärn and Tony Berglund. This is a collaboration between these students and Clavister.

Tonys work includes reasearching and testing DNS queries for Do53, DoT and DoH. His bachelor thesis paper can be found [here](https://www.umu.se/)

Busters work includes testing whether or not a DNS firewall is most suitable for a hired virtual server or for AWS lambda functions. His bachelor thesis paper can be found [here](https://www.umu.se/)

Together we built a prototype of a DNS firewall both for AWS lambda functions and a virtual server running with Node.js. These implementations can be found in subdirectories DNS_firewall and DNS_firwall_aws respecitvely.

We also did extensive testing, which ranged from testing Do53 vs. DoT vs. DoH and testing the prototype on Lambda vs. a virtual server. This code can be found under the directory benchmarks.

# DNS Firwall architecthure

The DNS firewall prototype is built with a microservice architecthure and consists of four different API's.

<img src="images/secure_dns_microservice.png"
     alt="secure_dns_microservice"
     style="max-height:400px;" />

#### DNS controller

This micro service acts as the main controller for the service and controls the flow of the program. The client will only make requests to this API and ignore the others.

#### DNS caching

This API will handle simple caching. It have a GET and a PUT request. The GET request have domain as input and will output an IP address together with an expiration date. The PUT requst will input a domain, and IP address and an expiration date. This way it can easily cache domains with their IP addresses.

#### DNS Query

This API makes actual DNS queries to Cloudfares DNS server. It inputs a domain and outputs an IP address. It is the same as shown in Figure \ref{fig:dns_query_service}.

#### DNS filtering

The filtering is the actual firewall. This API takes an input of an IP address and returns score for how safe that address is considered to be. The score is between 0-100 where 0 is not trusted and 100 is trusted. This filtering can be implemented in multiple ways. In the implemented prototype the scoring engine will always return a score of 100 in a constant response time of 10ms.


## Program flow

When a client makes a DNS request to the application, the flow of the program will work like this. First the controller will call the cache API to see if the domain is cached. If the domain is cached and has not expired, the IP address will be returned, and the controller will return the IP address. If not cached or if expired, the controller will call the DNS query API to get the IP address for that domain. Once the IP address is returned, the controller calls the Filter API with that IP address. The filter will return its score for that IP address. If the controller considers this score to be too low then it will not return the IP address to the client. If the IP address is considered to be trusted then two things will happen; the IP address will be returned to the client and the controller will call the cache API in order to cache the domain with an IP address with a TTL. This flow can be seen in the following figure.

<img src="images/prototype_design.png"
     alt="prototype_design"
     style="max-height:500px;" />
