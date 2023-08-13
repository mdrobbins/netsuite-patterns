# NetSuite Helpers

This is a repository of helpful patterns and libraries that I've accumulated over the years.  Hopefully you can find something useful to add to your workflow.

## Libraries

### [dt.mapReduceHelper.js](./src/FileCabinet/SuiteScripts/libraries/mapReduceHelper)

Creating a new Map/Reduce script comes with a lot of overhead that is common in every script.  Each time you start a new script you need to remember to write these processes over and over.  And you don't really do it enough to remember it off the top of your head.  Here are some helpers that you will take care of the tedious heavy lifting.

### [dt.search.js](./src/FileCabinet/SuiteScripts/libraries/search)

This is a library that wraps the most common functions from the `N/search` module but adds some interesting functions that lets us write clean, obvious code.  Each of these functions takes the exact same arguments that are used in `search.create()`.

It's mostly a drop-in replacement for `N/search` that adds useful features.

```javascript
// includes search.create(), .get(), and .getRange() in a single call.  
// Only returns the first 1000 records 
search.get({});

// returns all records even if there are more than 1000 
search.getAll({});

// returns the first record that matches your criteria
search.getOne({});

// return true if the search finds at least one record, false if no records are found
search.hasAny({});
```

### [dt.stateLabel.js](./src/FileCabinet/SuiteScripts/libraries/stateLabel)

Allows you to easily add a custom label to a transaction that mimics the native transaction status label.
```javascript
stateLabel.addLabel({
    context,
    text: 'DataTek: Approved',
    color: stateLabel.LabelColor.BLUE,
    hidePrimary: true,
});
```
Displays as

![Custom label](https://mikerobbins.me/images/sales-order-with-custom-label.png)

You can either replace the existing label or display your label side by side with the original status label.

## [dt.timer.js](./src/FileCabinet/SuiteScripts/libraries/timer)

A very easy way to track elapsed time within your applications.  You can track the total time since the timer started or track the time spent on individual iterations of a loop.

```javascript
// Get the total elapsed time for a process
let timer = new Timer();
// ...
let elapsedTime = timer.getElapsedSeconds();

// Get the time for each interation of a loop.
timer = new Timer();
for (let i = 0; i < lineLength; i++) {
    // ...
    const loopTime = timer.getIntervalSeconds();
}
```

### [dt.tryCatch.js](./src/FileCabinet/SuiteScripts/libraries/tryCatch)

This function automatically wraps function calls in a `try/catch` and logs any error that occurs.  It returns an object with an `isSuccess` property and a `result` property if the function call is successful.

```javascript
const customer = record.load({ type: record.Type.CUSTOMER, id: 123 })
    .setValue({ fieldId: 'memo', value: memo });

const save = tryCatch(customer.save);

if (!save.isSuccess) {
    // save.isSuccess: false
    // save.message: The message property from the exception that was thrown
    // save.details: the function that was called, the parameters passed to it and the stack trace of the error
}

const customerId = save.result;
```
## [Live Templates](./src/FileCabinet/SuiteScripts/live-templates)

This is a collection of Live Templates that I use with WebStorm or IntelliJ IDEA in all of my NetSuite projects.  There are shells for every script type and some for things that are very common, like:

`logv` - Logs a variable.  You only need to type the variable name once and the name will be used for `title` and the value for `details`

`logs` - Logs a string for both `title` and `details`;

`ns-search` - Creates a standalone function that calls `search.create()` and returns an array of objects with the results

## [Modular Business Logic](./src/FileCabinet/SuiteScripts/modular-business-logic)

Having too many individual user event scripts on a record can cause performance problems.  One way to reduce the number of user event scripts and still keeping individual pieces of logic separate is to put your business logic into separate modules and call those modules from a main user event script

(See [SuiteWorld 2021 Presentation](https://static.rainfocus.com/oracle/suiteworld21/sess/1624914792546001RbaM/PDFPF/DEV1102SES_Ries_10.21_130PM_Academy%20407_1634843502737001Oqdk.pdf) by Peter Ries)

Here's an [example](./src/FileCabinet/SuiteScripts/modular-business-logic) showing this method.

## [Saved Search Patterns](./src/FileCabinet/SuiteScripts/search-patterns)

When retrieving data whether using `N/search` or the `N/query` module, I always put my searches in a separate function and return an array of JavaScript objects rather than the `Search.SearchResult[]`.  

This prevents the need to litter my business logic code with `.getValue()` everywhere and I can work with property names that make sense, especially when script IDs for custom fields are often bulky.

See and example search format that I use consistenlty [here](./src/FileCabinet/SuiteScripts/search-patterns)