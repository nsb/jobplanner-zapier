const listBusinesses = (z, bundle) => {
  z.console.log('hello from a console log!');
  const promise = z.request('https://api.myjobplanner.com/businesses/');
  return promise.then((response) => JSON.parse(response.content).results);
};

module.exports = {
  key: 'business',
  noun: 'Business',
  display: {
    label: 'New Business',
    description: 'Trigger when a new business is added.'
  },
  operation: {
    perform: listBusinesses
  }
};
