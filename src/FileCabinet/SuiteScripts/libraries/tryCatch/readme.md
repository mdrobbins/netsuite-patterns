Ready to save your customer record? Don’t forget to wrap your call in a try/catch block, right? You need to handle the case when the save is successful...AND...you need to handle the case when the save is unsuccessful.

* What if your user forgot to enter some data?
* What if the value they entered for the email address on your custom form is incorrect?
* What if … any of 1000 other things go wrong when you try to save that record.

Try/catch blocks are pretty straight forward:

```javascript
var customer = record.create({ type: 'customer' });
customer.setValue({ fieldId: 'companyname', value: 'DataTek Software' });

try {
  var customerId = customer.save()
} catch(ex) {
  log.error({ title: "Error saving customer", details: ex.message });
  // TODO: more logic needed here to make it nice for the user
}
```

But how many times do you use `record.save()` in your code? What about searches? What about `record.submitFields()`? They’re all API calls that can fail. Are you handling them all? That a lot of try/catch blocks with it’s own error logging scattered throughout your code.

`tryCatch()` is a simple custom NetSuite module that you can use to easily add try/catch blocks and error logging to your SuiteScript without cluttering your code and taking away from the readability and maintainability of your code.

Here’s the same example but using the `tryCatch()` function:

```javascript
var customer = record.create({ type: 'customer' });
customer.setValue({ fieldId: 'companyname', value: 'DataTek Software' });

var create = tryCatch(customer.save);
if (create.isSuccess) {
  var customerId = create.result;
}
```

The `tryCatch()` function automatically wraps your function call in a try/catch block and will automatically log the error with a stack trace if an error is encountered. The object returned by `tryCatch()` contains an `isSuccess` property to tell you if the function call was successful or not. The return value of the function that was called will be in the `result` property.

In the example above, if the customer creation was successful, the `isSuccess` property will be `true` and the `result` property will be the internal ID of the newly created customer, since that’s what the `record.save()` function returns.

If the customer creation was unsuccessful, the `isSuccess` property will be `false` and the `message` property will contain the message exception.  If you need it, the `stack` property will contain the stack trace for the exception.

The `tryCatch()` function can also pass any number of parameters to the function you want to call. Just pass them as additional parameters to `tryCatch()` and they’ll be passed along to your function. For example:

```javascript
var recordId = record.submitFields({ type: 'customer', id: customerId, values: fieldValues });
```

becomes

```javascript
var update = tryCatch(record.submitFields, { type: 'customer', id: customerId, values: fieldValues });
``` 

> When using `tryCatch()`, store the variable in a verb that indicates what action you’re performing, like `create`, `update`, or `search`. When checking `create.isSuccess` with that variable naming convention, it will be easier to understand when you’re reading your code six months from now.
