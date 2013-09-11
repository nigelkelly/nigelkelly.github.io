---
title: The Good and Bad of Firebase Syncing - A Followup
layout: post
---
                                                                                                
[Home](http://nigelkelly.github.io)

*12 Sept 2013*
## The Good and Bad of Firebase Syncing - A Followup

I wrote about an issue I noted with firebase syncing last week. The article can be found [here](http://nigelkelly.github.io/the-good-and-bad-parts-of-firebase-syncing-part1.html). I had observed that data created locally by a client will not necessarily make it back to the firebase servers, that there is no inbuilt mechanism to warn the developer or the user when a connection is lost, firebase continues to operate as if nothing has happened and that if you do a page refresh, whilst a disconnection is in play, that data can be lost. You can download the tests here and run them yourself or you can watch this video I created of myself running the test.

[Click to see my Video of the Test](https://youtube.googleapis.com/v/q_A732VS6C8%26hl=en%26fs=1)

### My test conditions

I am behind a normal home router. 
My connection is wifi (6.9Mbps donwload and 0.4Mbps up at moment, generally streams Netflix HD quite well). 
I am using Snow Leaopard Mac.
Safari Version 5.1.9 (6534.59.8) Chrome Version 29.0.1547.65. 

### Running the test via file://

The video above shows the test when run off file://mypath/index.html
As you can see Firebase syncing stopped working quite quickly.


### Running the test via local web server

I set up a local web server using Google App Engine. I continued to observe that disconnections can occur rather quickly.

### Running the test via remote web servers

I then deployed the tests to [Google App Engine](http://testfirebase.appspot.com) I continued to add objects to firebase for about 2 hours and no disconnection occurred. Everything worked great. Firebase syncing was now redeemed.
Open two web browser windows and point at them at (http://testfirebase.appspot.com) You should see things working fine.

### What conclusions can we draw

Communicating with firebase in a development or test environment housed on your local workstation is a bad idea. You should deploy your development and test app to an infrastructure that more closely resembles real world conditions. It is comforting to know that firebase performs under more realistic conditions.

However alot of developers, when they first try out an emerging software library, will want to test off file:// or a local web server. It is just convenient in many cases. Having to deploy to the cloud can be overkill if we just want to dip our toe in the water.

Furthermore there are a whole class of apps that may run locally off the desktop (chrome web store apps, firefox add-ons, etc) or mobile device (phonegap) that will want to talk directly to firebase. The above test would indicate that this may be problematic for firebase.
