const subscribeHook = (z, bundle) => {
  // `z.console.log()` is similar to `console.log()`.
  z.console.log("subscribehook", bundle.targetUrl, bundle.inputData.business);

  // bundle.targetUrl has the Hook URL this app should call when a client is created.
  const data = {
    target: bundle.targetUrl,
    business: bundle.inputData.business,
    event: "invoice.added",
    is_active: true
  };

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/hooks/`,
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  };

  // You may return a promise or a normal data structure from any perform method.
  return z
    .request(options)
    .then(response => {
      JSON.parse(response.content);
    })
    .catch(error => z.console.log(error));
};

const unsubscribeHook = (z, bundle) => {
  // bundle.subscribeData contains the parsed response JSON from the subscribe
  // request made initially.
  const hookId = bundle.subscribeData.id;

  // You can build requests and our client will helpfully inject all the variables
  // you need to complete. You can also register middleware to control this.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/hooks/${hookId}/`,
    method: "DELETE"
  };

  // You may return a promise or a normal data structure from any perform method.
  return z.request(options).then(response => JSON.parse(response.content));
};

const getInvoice = (z, bundle) => {
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
  return [bundle.cleanedRequest.data];
};

const getFallbackRealInvoice = (z, bundle) => {
  // For the test poll, you should get some real data, to aid the setup process.
  const options = {
    url: `${process.env.BASE_URL}/${process.env.API_VERSION}/invoices/`,
    params: {
      business: bundle.inputData.business
    }
  };

  return z
    .request(options)
    .then(response => JSON.parse(response.content).results);
};

// We recommend writing your triggers separate like this and rolling them
// into the App definition at the end.
module.exports = {
  key: "invoice",

  // You'll want to provide some helpful display labels and descriptions
  // for users. Zapier will put them into the UX.
  noun: "Invoice",
  display: {
    label: "New Invoice",
    description: "Trigger when a new invoice is added."
  },

  // `operation` is where the business logic goes.
  operation: {
    // `inputFields` can define the fields a user could provide,
    // we'll pass them in as `bundle.inputData` later.
    inputFields: [
      {
        key: "business",
        required: true,
        label: "Business",
        dynamic: "business.id.name",
        helpText: "Which business this should trigger on."
      }
    ],

    type: "hook",

    performSubscribe: subscribeHook,
    performUnsubscribe: unsubscribeHook,

    perform: getInvoice,
    performList: getFallbackRealInvoice,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obviously dummy values that we can show to any user.
    sample: {
      id: 17,
      created: "2018-04-14T13:57:32.274322Z",
      business: 1,
      client: {
        id: 1,
        business: 1,
        first_name: "Anna",
        last_name: "Hansen",
        email: "anna@example.com",
        phone: "1242134",
        notes: "This is a note",
        properties: [
          {
            id: 5,
            address1: "Min anden adresse",
            address2: "",
            city: "Aarhus",
            zip_code: "8800",
            country: ""
          },
          {
            id: 4,
            address1: "Oles Gade 2",
            address2: "",
            city: "Copenhagen SV",
            zip_code: "2300",
            country: ""
          }
        ],
        quotes: [],
        upcoming_visit_reminder_email_enabled: true,
        external_id: "",
        imported_from: "",
        imported_via: ""
      },
      job: 22,
      description: "",
      date: "2018-04-14",
      line_items: [
        {
          id: 1325,
          name: "Test 5",
          description: "test 5",
          quantity: 1,
          unit_cost: "19.00",
          total_cost: "0.00"
        }
      ],
      property: 4
    },

    // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
    // field definitions. The result will be used to augment the sample.
    // outputFields: () => { return []; }
    // Alternatively, a static field definition should be provided, to specify labels for the fields

    outputFields: []
  }
};
