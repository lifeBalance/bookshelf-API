# What is REST
The acronym **REST** (sometimes spelled ReST) stands for _**Re**presentational **S**tate **T**ransfer_, and it was coined in 2000 by [Roy Fielding][1] in his Ph.D dissertation at the University of California, Irvine.

> The dissertation was titled **Architectural Styles and
the Design of Network-based Software Architectures** and can be found [here][2]

ReST is a [software architectural style][3] usually used when building Web services. ReST can be described as a lightweight approach, especially when compared to more heavyweight solutions such as [SOAP][6].

> To learn more about what we mean by software architectural patterns and styles, aka design patterns check [here][4] and [here][5]


## Constraints
Basically, ReST imposes a series of constraints about the design of Web services. If the resulting application comply with these constraints, it can be described as **ReSTful**. These constraints are **six**:

### 1. Client-server
There must be a **separation of concerns** between the client and the server, meaning that clients should not be concerned with server details, such as data storage. By the same token, servers are not concerned with client aspects, such as the current state of the UI.

### 2. Stateless
Every client request must include all the information necessary to service the request. This means that session state is responsibility of the client, and must be sent on each request. This aspect is especially useful when our application scales up, and we need to introduce new servers. We don't have to worry about which server is gonna handle the request, since all the needed information is gonna be send by the client on every request.

### 3. Caching
Sometimes the response to the client doesn't need to include data that doesn't change very often. In these situations is useful that clients or intermediaries cache that information so the server doesn't have to send it again. There's also some data that changes all the time, that's why responses must define themselves (implicitly or explicitly) as **cacheable**, or **not cacheable**.

When caching data, special care must be taken to avoid that the client reuses **stale data**, so if the cached data has changed it must be send again, of course.

### 4. Layered system
A client cannot ordinarily tell whether it is connected directly to the end server, or to an intermediary along the way. Intermediary servers may improve system scalability by enabling load balancing and by providing shared caches. They may also enforce security policies.

### 5. Uniform interface
This constraint is **fundamental** in the design of a ReST service. It describes the characteristics of the interface between the server and the client, in order to get a decoupled architecture where the client side and the server side may evolve independently. This interface is **resource based**, meaning that everything evolves around the concept of **resources**.

Resources are designed using **nouns**. This is important when we compare REST with other styles such as SOAP, which are based on actions. A resource is a noun that is **unique**, can be represented as data and has at least one URI. Some examples of a resource could be:

* A book by an author.
* The author.
* The definition of ReST in Wikipedia.
* A post about the React framework.

A resource must not be confused with its **underlying data**. For example, we may have two resources pointing to the same data:

* An article about the Angular framework.
* A description of the most popular Front-end framework, which could be Angular, or given enough time, some other framework/library such as React.


Getting back to the **interface** itself, it's defined by four guiding principles:

#### Identification of resources
Each individual resource must be identified in the request URI. Also, a resource should be identified by at least one URI, but it may have more than one. For example, we may have two links to the mentioned article about React:

* http://superapi/trending/react
* http://superapi/libraries/react

#### Manipulation of Resources Through Representations
The **resources** themselves are conceptually separate from the **representations** that are returned to the client. For example, we may send to the client different representations (XML, JSON, etc) of the same resource.

#### Self-descriptive Messages
The representations sent to the client are also known as **messages**. These messages must include all the information necessary to interpret the message. For example, a message would include metadata that specifies which parser to invoke to interpret the body of the message. In this case that would be specified using an Internet media type (previously known as a MIME type). Another example of this principle would be information about its cacheability. Also, the message must include enough information to modify or delete the resource back in the server.

> When a client and a web service communicate they exchange **messages**. A request message is sent from the client to the web service. The web service responds with a response message.

#### Hypermedia as the Engine of Application State (HATEOAS)
This means that the transitions that the client make are defined dynamically by the server using hypermedia (hyperlinks within hypertext). So depending on the current state of the application, the client will have available the **hypermedia controls** that are relevant to change to another state.

> Check this to read about [hypermedia][11]

What this means is that each resource will include a set of hyperlinks that the client can use to navigate the API. For example,  a resource should include links to related resources and collections, and also links for different things to do next. This way, our APIs become self-documenting and discoverable.

#### HTTP Verbs
Even though ReST is based on resources, and resources are **nouns**, we are going to need to do stuff with those nouns, we need **verbs**. Web services that adhere to the REST architectural constraints are called RESTful APIs. These services are based on the HTTP protocol, so HTTP Verbs become an important of the interface.

> If the resources are the **nouns**, the HTTP methods are the **actions**.

The HTTP Verb that is used in the request determines the type of action we want to perform on the resource:

* `GET` is used to **read** (or retrieve) a representation of a resource. When the `GET` request hits a **happy path**, the server responds with a resource representation (JSON, XML) and an **200 (OK)** HTTP Response Code. In case of error, it just responds with a **404 (Not Found)** or **400 (Bad Request)**.

  According to the design of the HTTP specification, `GET` requests are used only to **read** data and not change it. Therefore, when used this way, they are considered **safe**. We shouldn't use `GET` requests to perform unsafe operations, meaning operations that modify any resources on the server.

  Additionally, `GET` requests are **idempotent**, which means that making multiple identical requests have the same result as a single request.

* Requests that use the `POST` method are used to **create** new resources. The server will use the content enclosed in the request to create a new instance subordinate to an existing resource (a new author, a new book, etc). On successful creation, return HTTP status **201 (Created)**, returning a `Location` header with a link to the newly-created resource. If the resource already exists, a **409 (Conflict)** is returned.

  `POST` requests are **not safe**, meaning they modify resources on the server. They are **not idempotent** either, meaning making two identical `POST` requests will most-likely result in two resources containing the same information.

* `PUT` is most-often used for **update** resources, meaning sending an updated representation of the original resource in the request body. If the update is successful the server responds with **200 (OK)** if we are including the updated resource in the body of the response, or **204 (No Content)** otherwise. In case or error, we should return a **404 (Not Found)** when the ID of the resource is invalid or not found.

  `PUT` is not a safe operation, since it modifies state on the server, but it is **idempotent**. In other words, if we update a resource using `PUT` and then make that same request again, the resource is still there and still has the same state as it did with the first call.

  Sometimes, a `PUT` request increments a counter within the resource, so such a request can no longer be called idempotent. However, it's recommended to keep `PUT` requests idempotent.

* `PATCH` requests are also used for **updating** resources, but only partially, meaning the request only needs to contain the changes to the resource, not the complete resource. This doesn't mean that the body of the `PATCH` request only contains the modified part of the resource. On the contrary, `PATCH` body should a set of instructions describing how a resource currently residing on the server should be modified to produce a new version. This set of instructions must use some kind of patch language like [JSON Patch][7] or [XML Patch][8].

  > Read more about building JSON APIs [here][9], and about JSON Patch [here][10]

  `PATCH` requests are not **safe** for obvious reasons. They are not **idempotent** either, although they can be designed in such a way as to be idempotent, which also helps prevent bad outcomes from collisions between two PATCH requests on the same resource in a similar time frame. Collisions from multiple PATCH requests may be more dangerous than PUT collisions because some patch formats need to operate from a known base-point or else they will corrupt the resource. Clients using this kind of patch application should use a conditional request such that the request will fail if the resource has been updated since the client last accessed the resource. For example, the client can use a strong ETag in an If-Match header on the PATCH request.

  The status codes are the same that the ones used for `PUT` requests.

* `DELETE` requests are used to **delete** a resource identified by a URI. On successful deletion, we may return a HTTP status **200 (OK)** along with a response body which often includes the representation of the deleted item, but since this requires too much bandwith, returning a **204 (No Content)** or just a **200 (OK)** are the recommended responses. We would return a **404 (Not Found)** in those cases when the ID of the resource is invalid or not found.

  `DELETE` requests are obviously **not safe**. On the other hand, they are **idempotent** since once a resource has been removed, subsequent `DELETE` requests will not change the state of the resource in the server. There is one caveat though, and it's that requesting `DELETE` on a resource a second time will often return a **404 (NOT FOUND)** since it was already removed and therefore is no longer available, what for some people make these requests no longer idempotent.

  In those cases when there have been set up counters on the resource, the `DELETE` request can no longer be considered idempotent.


#### CRUD Actions
Each of the aforementioned **HTTP verbs** map to a **CRUD operation** on the server side. As a refresher, CRUD stands for **Create, Read, Update and Delete** and refers to the most common operations on a database. Check the following table for reference:

HTTP Verb         | CRUD Action
------------------|------------
`POST`            | Create
`GET`             | Read
`UPDATE`, `PATCH` | Update
`DELETE`          | Delete

### 6. Code on Demand
This is the only **optional** constraint of the REST architecture. Servers can temporarily extend or customize the functionality of a client by the transfer of executable code. An example of this constraint would be client-side JavaScript.

## The Richardson Maturity Model
It's a model developed by [Leonard Richardson][12] to measure the level of compliance of our Web service with the constraints defined in the ReST architectural style. It has four levels, starting counting at 0:

* Level 0: Using HTTP as a transport system for remote interactions, but without using any of the mechanisms of the web.
* Level 1 - Resources: Build our service around resources.
* Level 2 - HTTP Verbs: Read last section. They introduce uniformity regarding the actions to be performed on the resources themselves.
* Level 3 - Hypermedia Controls: That ugly acronym we mentioned before (HATEOAS) and that makes our ReSTful API self-documenting and user friendly.

These levels should be seen as a whole, Roy Fielding himself made clear that level 3 is a pre-condition of REST, so don't think "Oh my API scored 2, it should be fine".

> Read more about this model [here][13]

---
[:arrow_backward:][back] ║ [:house:][home] ║ [:arrow_forward:][next]

<!-- navigation -->
[home]: ../README.md
[back]: ../README.md
[next]: getting_started.md


<!-- links -->
[1]: http://roy.gbiv.com/
[2]: http://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm
[3]: https://en.wikipedia.org/wiki/Architectural_pattern
[4]: https://en.wikipedia.org/wiki/List_of_software_architecture_styles_and_patterns
[5]: https://en.wikipedia.org/wiki/Software_design_pattern
[6]: https://en.wikipedia.org/wiki/SOAP
[7]: https://tools.ietf.org/html/rfc6902
[8]: https://tools.ietf.org/html/rfc5261
[9]: http://jsonapi.org/
[10]: http://jsonapi.org/extensions/jsonpatch/
[11]: https://en.wikipedia.org/wiki/Hypermedia
[12]: http://www.crummy.com/self/
[13]: http://martinfowler.com/articles/richardsonMaturityModel.html
