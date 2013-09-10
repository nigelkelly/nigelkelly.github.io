---
title: This will be used as the title-tag of the page head
---
<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>	
### The Dark Side of Firbase Syncing

I have been messing around with Firebase now for a few months and I an very impressed with it. Its greatest single feature is that you can code completely in “client side” javascript. You don’t need server side javascript. You don’t need node, meteor or derby. You don’t have to code in strange, alien javascript for the server which comes with a sense of dislocation. Firebase, for the most part, really is quite a painless experience to code in.
I say “for the most part” because there is a dark side. As I’ve said coding in it from a client side perspective is a pleasant experience. However I feel that its most marketed feature – real time syncing – can be an awkward and dislocating experience. Worse still there is a real risk that it can lose data. Syncing is a hard problem to solve and manage. I think Firebase gets us a good bit of the way there but it’s not bullet proof.
Firebase provides a number of syncing patterns for developers to work with. You need to understand how each of these work, their strengths and weaknesses, before choosing the most appropriate sync pattern for your app. In this post, I will talk about the .on() sync event pattern and show you the results of testing it and how it can lose data.

### .on() event pattern

The .on() event pattern is probably the sync pattern that is most shown in the firebase docs and tutorials. Here's how the pattern shapes up in html and javascript;


If you set up your firebase account you can point this code to your firebase test sandbox and see how it works. It really is magic. Let's try and break down the magic.
