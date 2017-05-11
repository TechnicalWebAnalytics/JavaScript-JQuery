/* UNIVERSAL OR COLLECTION

This not only takes care of the redirect, but makes it much easier to construct campaign parameters since you only need to use a single naming convention. Whoever is managing the campaigns will need to make sure to update a lookup variable in GTM so the conditional detects the hashbang and injects the constructed campaign. The only thing to be mindful of is that the variable is an "equal" conditional, not a contains. So whatever you throw in here will have to be an exact match. 

Here are the steps in basic terms with the example goal of setting up a new PR campaign on Mashable. Screenshots attached for each step.

1. Go to GTM and Navigate to Variables
2. Navigate to the variable called "Vanity URLs example.com"
3. Within the variable you will want to set up the name of your Campaign under "Input" and the Medium under "Output"
4. Now we just need to use the vanity url of https://example.com/#getexample on www.mashable.com
5. When a user clicks on the link it will redirect to example2.com/#getexample ( note: we want to use a hashbang because a page path will create a 404 when redirected )
6. If "getexample" is detected in the lookup table, the conditional will cause a GA event to fire that invokes the new Campaign construct as follows. Let me know if you want this adjusted in any way. I tried to keep the standard format and just bucket the origin of example.com in the Campaign Content. 

Campaign Name: getexample
Source: mashable.com
Medium: pr 
Content: example.com

*/