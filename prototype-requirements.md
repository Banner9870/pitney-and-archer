# Chicago.com prototype (April 1, 2026 iteration)
We're creating a second iteration of the project available at this repo: https://github.com/Banner9870/keeley-and-archer

Chicago.com is a hyperlocal engagement product that will be primarily built on New Public's Roundabout platform. You can find more information about Roundabout at these URLs:
- https://northchatt.roundabout.town/
- https://newpublic.org/local
- https://newpublic.substack.com/p/introducing-roundabout-built-for
- https://werd.io/introducing-roundabout/
- https://www.linkedin.com/posts/deepti-doshi-71a6022_big-day-over-here-at-new-public-our-new-activity-7401377467711832064-TOMX/

We're working on bringing Roundabout to Chicago on a domain that we own, chicago.com. Each neighborhood (every Chicago community area) will have its own forum. Design work is at a very early phase — you can reference the work in the keeley-and-archer repo for design inspiration (that work was done by Claude as well). We'll be working with the New Public team to extend the work that they've already done on ATProto to build a hyperlocal engagement platform.

The main thing we're building is additional guides functionality on top of the Roundabout platform.

## The purpose of this prototype
We're doing some user testing tomorrow. We'd like to have something for users to click around and experience the user flow. It does not need to be fully populated with real-life data (though I can provide the API keys for the Google Places API, the Chicago Open Data portal and other potential sources we can use to seed the prototype).

We'd like to see how users react to the guides concept. Does it make sense to them? Would they use it? So we don't need multiple user accounts, authentication, real-time updates, persistence, etc. But we'd like buttons to be clickable and engaging for users experiencing the prototype for the first time.

## Guides on chicago.com
Compared to the previous iteration of guides that's on the keeley-and-archer repo (the live version is here: https://keeley-and-archer-production.up.railway.app/), we're trying to make guides that include multiple content types as modules. A guide can include:
- places (like restaurants, landmarks and businesses)
- articles from the Chicago Sun-Times and WBEZ
- products (like menu items and store items)
- events (user-submitted and scraped from different sites)
- posts (user-generated posts with photos and text with a "read more" button for long posts)
- playlists from Spotify or Bancamp

A guide can be any combination of the content. Eventually, we will use an algorithm we have been developing independently to determine the neighborhoods the guide is relevant to, but for right now, we can just make a dummy version of this. A similar process can be used for "badges" that are interests that a guide is about (like coffee, books or bars for example).

One guide you might use for inspiration is "My perfect day in Humboldt Park." That guide might include:
- The user's favorite coffee shop
- Their favorite latte and breakfast sandiwch there
- The Humboldt Park Natural Area
- A post on how to hang a hammock
- A playlist to listen to in the hammock
- A recommended book from a local author
- A nearby wine bar they love

Guides should include some kind of image (it can be a placeholder image), the authors and collaborators of the guide, and maybe a short description. Users should be able to "remix" a guide and make it their own, keeping some posts, etc. and adding others. 

## Guide creation flow
We'd like to show people what it's like to create a guide to determine what it would take for them to contribute. They should be able to go through the whole process, but it doesn't need to appear in the feed (persistant storage is beyond scope).

Guides can be private, shared with friends or public. If a guide is public, it will be submitted for moderation before it appears in feeds. Users should have some basic options to be able to select from — it should be extensive enough for people not to notice how limited the database is. You can explore some possible low-cost API options to help seed the database.

Businesses can create "sponsored" guides and include deals on products that are included in guides that are available only the Chicago Public Media members.

## The explore feed
The explore feed will include a mix of guides from across the city. Some guides will just be "reviewed." Some people will be created by a newsroom, specifically, the Chicago Sun-Times and WBEZ for now. This is a project of Chicago Public Media — more news outlets and sources may be added as time goes on.

Users should be able to filter guides based on the types of content included and the badges. Their selections should be persistent and tied to the user's account. The feed should include the author's handle (using the ATProto standard handle format of @username.chicago.com), the number of likes and the number of people who said the guide was helpful.

## The profile page
I'd like for you to think through building out the profile page. It should include how long a person has lived in Chicago and what neighborhoods they have lived in — we think this is key for users to trust the source.

We want to center a user's experience and personality over the guides they have created. During the sign up flow, we're going to require them to create a guide that is their perfect day in the neighborhood they live in (to encourage high-quality contributions). We're going to have some hinge-style prompts for people to fill out in their profile, like "two loves and a loathe" for Chicago or how the best way to spend $10 in Chicago. You can suggest some further ones, but they should be tied to things to do and recommendations in Chicago. It should help people determine whether to follow someone or not.