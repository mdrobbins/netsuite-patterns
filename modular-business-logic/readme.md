## Using Modular Business Logic

If you have a user event script on a sales order, and you have a new request from the business that will require a user event script, it can be tempting to open the existing user event script and add your new logic.

But how can you keep the logic for individual requests separate so your changes to one does not impact the other?  Your first thought might be to create a new user event script.  There's certainly nothing wrong with having two scripts on the sales order record.  

Over time, the requests from the business keep coming in and the next thing you know, you've got 20 different scripts each for a different business purpose, maybe even some duplicated logic between them.

Another alternative is to have a smaller number of user event scripts that have multiple modules containing the separate business logic for each request.  The primary user event script references the individual modules and calls each in turn.  If there is any shared logic between modules (i.e., retrieving global config values), that logic can be added in the primary user event script and passed to the modules that need it.

The user event script in this folder shows how that might look.  There are three custom modules representing three different requests from the business.
* Set the custom form for certain subsidiaries
* Check the Custom Billing checkbox if the Term In Years value is not an integer.
* Place the record into a queue to be synced to an external system.

The primary user event script references each of the business logic modules and calls them as needed, passing the script context to each so they can be developed independently.

### Fixed Usage vs Unbounded Usage

Using this pattern, it's important that you understand how NetSuite's governance system works.  A user event only gets 1000 pts of governance and piling more and more modules into a single script can eat away at that usage.  I like to identify two different types of scripts from a governance perspective.  In the JSDoc comments of each module, I'll add the governance used by this module.
```javascript
/**
 * @governance 12
 * @params context
 */
```

#### Fixed Usage Scripts

These scripts, or modules, use the same amount of governance every time they run.  It's easy to combine these into a single script using this pattern since you will know when you approach the usage limit.  Add JSDoc comment in the primary user event script to indicate how much total usage is being consumed.

#### Unbounded Usage Scripts

These scripts, or modules, use a different amount of governance each time they run depending on the data they're given.  For example, if you are creating a new billing schedule for each line item, then the governance used by the script increases as the number of line items on the sales order increases.

It's best not to combine these types of modules with others unless you have a good understanding of your business and potential scenarios.
