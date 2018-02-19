const subscribeHook = (z, bundle) => {
  // `z.console.log()` is similar to `console.log()`.
  z.console.log('subscribehook', bundle.targetUrl, bundle.inputData.business);

  // bundle.targetUrl has the Hook URL this app should call when a client is created.
  const data = {
    target: bundle.targetUrl,
    business: bundle.inputData.business,
    event: 'client.added',
    is_active: true
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/webhooks/`,
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => {
      JSON.parse(response.content)
    })
    .catch((error) => z.console.log(error));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/webhooks/${hookId}/`,
    method: 'DELETE',
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options)
    .then((response) => JSON.parse(response.content));
};

const getClient = (z, bundle) => {
  // bundle.cleanedRequest will include the parsed JSON object (if it's not a
  // test poll) and also a .querystring property with the URL's query string.
  // const recipe = {
  //   id: bundle.cleanedRequest.id,
  //   name: bundle.cleanedRequest.name,
  //   directions: bundle.cleanedRequest.directions,
  //   style: bundle.cleanedRequest.style,
  //   authorId: bundle.cleanedRequest.authorId,
  //   createdAt: bundle.cleanedRequest.createdAt
  // };
  //
  // return [recipe];
  return [bundle.cleanedRequest.data]
};

const getFallbackRealClient = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/clients/`,
    params: {
      business: bundle.inputData.business
    }
  };

  return z.request(options)
    .then((response) => JSON.parse(response.content).results);
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: 'client',

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: 'Client',
  display: {
    label: 'New Client',
    description: 'Trigger when a new client is added.'
  },

  // `operation` is where the business logic goes.
  operation: {

    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [
      {
         key: 'business',
         required: true,
         label: 'Business',
         dynamic: 'business.id.name',
         helpText: 'Which business this should trigger on.'
      },
    ],

    type: 'hook',

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getClient,
    performList: getFallbackRealClient,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 1,
      business: 1,
      first_name: 'Donald',
      last_name: 'Trump',
      email: 'donald@whitehouse.gov',
      phone: '12341234',
      notes: 'this is a note',
      properties: [{
        "id": 1,
        "address1": "1600 Pensylvania Ave",
        "address2": "",
        "city": "Washington",
        "zip_code": "1234",
        "country": "USA"
      }],
      upcoming_visit_reminder_email_enabled: true
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields

    outputFields: [
      {key: 'id', label: 'ID'},
      {key: 'business', label: 'Business'},
      {key: 'first_name', label: 'First name'},
      {key: 'last_name', label: 'Last name'},
      {key: 'email', label: 'Email'},
      {key: 'phone', label: 'Phone'},
      {key: 'notes', label: 'Notes'},
      {key: 'properties', label: 'Properties'},
      {key: 'upcoming_visit_reminder_email_enabled', label: 'Email reminder enabled'}
    ]
  }
};
