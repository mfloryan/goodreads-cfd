=GoodReads CFD=

This is all because of this tweet: https://twitter.com/agileactivist/status/255357951005581312

The idea is simple:

* All the data about the books you read is already on GoodReads http://www.goodreads.com/
* We should be able to pull the data through their API http://www.goodreads.com/api
* Using some simple JS we can massage the data into a correct format
* And use a visualisation library http://philogb.github.com/jit/ to draw a picture

==What you need==
* Probably your GoodReads API Key http://www.goodreads.com/api/keys
* Also your GoodReads user id
* A server to put it on (apache?)
* A browser to run it in (chrome)

==Any problems?==
So far I have not been able to get a successful AJAX call to GoodRead so I just downloaded the XML and loaded it locally from the server. You need to tweak the URL accordingly. If you dare trying this tool out, you know what you're doing anyway.
