# dt.MapReduceHelper.js

Map/Reduce scripts are different from every other type of script.  While most scripts have multiple entry points with each doing a single thing, Map/Reduce scripts have four entry points that all work together to accomplish a task.

Some of the concepts in a Map/Reduce scripts can be difficult to understand and tedious to implement.  The `dt.mapReduceHelper.js` library has a few methods that can be used to simplify some of those implementation details.

* Getting data from the `map` and `reduce` stages
* Logging errors
* Getting a summary of what happened in your script

The purpose of these helpers is to reduce the amount of mental effort it takes to understand and write Map/Reduce scripts by removing some of the menial work.

## getStageData()

You can call `getStageData(context)` at the beginning of your `map` and `reduce` entry points and it will return the data for that stage parsed and ready to go.

In the `map` stage, this function will return call `JSON.parse()` on the `.value` property of the context object.

In the `reduce` stage, this function will iterate through the `.values` array and call `JSON.parse()` on each element and return the fully parsed array, ready to use.  No need to loop and parse on your own.

## logErrors()

One of the things that trips up newcomers to Map/Reduce scripts is how error handling works.  When an unhandled exception works, we expect a script to stop working, but Map/Reduce scripts just keep on running, processing the next piece of data.  The expectation is that we'll log these errors in the `summarize()`stage.

Calling `logErrors(context)` in the `summarize` stage will automtatically log all errors from the `getInputData`, `map` and `reduce` stages to the server script log.

## getSummaryData()

If you prefer more flexibility with your error handling, you can call `getSummaryData()` in the `summarize` stage and it will return an object with the output data and errors from each stage.

```json
{
  "output": [],
  "inputError": {},
  "mapErrors": [
    { "title": "Map error for key ${key}", "details": "ex.message" }
  ],
  "reduceErrors": [
    { "title": "Reduce error for key ${key}", "details": "ex.message" }
  ]
}
```

This data can be used to quickly provide counts of success and failures for different records so you can send summary emails or provide additional processes for error handling.

The error objects are passed back ready to log with `title` and `details` property so you can iterate over them easily like and use the `N/log` module to log them:

```javascript
const summaryData = helper.getSummaryData(context);

summaryData.mapErrors.forEach(log.error);
summaryData.reduceErrors.forEach(log.error);
```

## Summary


These functions provide a little help to reduce the clutter in your Map/Reduce scripts so you can focus on the business purpose for writing the script in the first place.
