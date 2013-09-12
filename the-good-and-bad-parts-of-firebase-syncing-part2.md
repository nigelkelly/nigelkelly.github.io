---
title: The Good and Bad of Firebase Syncing - A Followup
layout: post
---
                                                                                                
[Home](http://nigelkelly.github.io)

*12 Sept 2013*
## The Good and Bad of Firebase Syncing - A Followup

I wrote about an issue I noted with firebase syncing last week. The article can be found [here](http://nigelkelly.github.io/the-good-and-bad-parts-of-firebase-syncing-part1.html). I just wanted to write a followup. There is good news and bad news.

The bad news is that when I run my test locally then clients lose connections very quickly and data be lost. Here's two short videos of me running the test.

[Click to see my Video of Firebase Sync working](http://youtu.be/8zAGLiDf5uM)

[Click to see my Video of Firebase Sync losing data](http://youtu.be/b8MbvWi06CE)

You can download the tests [here](https://github.com/nigelkelly/firebase-tests) and run them yourself if you want to.

*The good news is that when I deployed the tests to Google App Engine that data was not lost despite the loss of client connections at times. It is a more robust solution that resembles real world app architecture.*

I also wanted to add that Firebase makes developing web apps so easy. There really is no backend to worry about. And the support at Firebase is really super.

### My test conditions

* My location is Dublin, Ireland. I think the Firebase servers are in San Francisco.
* I am behind a normal home router. 
* My connection is wifi (6.9Mbps donwload and 0.4Mbps up at moment, generally streams Netflix HD quite well). 
* I am using Snow Leaopard Mac.
* Safari Version 5.1.9 (6534.59.8) 
* Chrome Version 29.0.1547.65. 

### Running the test via local file

The video above shows the test when run off file://mypath/index.html
As you can see Firebase syncing stopped working quite quickly and data was lost.

*Result Fail*

### Running the test via local web server 

I set up a local web server using Google App Engine. I continued to observe that disconnections can occur rather quickly. Again data was lost.

*Result Fail*

### Running the test via remote web servers 

I then deployed the tests to [Google App Engine](http://testfirebase.appspot.com) I continued to add objects to firebase for about 2 hours. Everything worked great. No data was lost. Firebase syncing was now redeemed.
Open two web browser windows and point at them at [testfirebase.appspot.com](http://testfirebase.appspot.com) You should see things working fine.

*Result Success*

### What conclusions can we draw

Communicating with firebase in a development or test environment housed on your local workstation is a bad idea. You should deploy your development and test app to an infrastructure that more closely resembles real world conditions. It is comforting to know that firebase performs under more realistic conditions.

However alot of developers, when they first try out an emerging software library, will want to test off file:// or a local web server. It is just convenient in many cases. Having to deploy to the cloud can be overkill if we just want to dip our toe in the water.

Furthermore there are a whole class of apps that may run locally off the desktop (chrome web store apps, firefox add-ons, etc) or mobile device (phonegap) that will want to talk directly to firebase. The above test would indicate that this may be problematic for firebase. You could hack your own persistent local data storage with HTML5 and resync with Firebase after a connection is lost.

###**Comment on [Reddit](http://www.reddit.com/r/javascript/comments/1lsb5q/the_dark_side_of_firebase_syncing_test_procedure/) or [Hacker News](https://news.ycombinator.com/item?id=6334385)**