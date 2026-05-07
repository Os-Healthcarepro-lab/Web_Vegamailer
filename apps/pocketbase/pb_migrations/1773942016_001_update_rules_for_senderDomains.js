/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("senderDomains");
  collection.listRule = "businessId.userId = @request.auth.id";
  collection.viewRule = "businessId.userId = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "businessId.userId = @request.auth.id";
  collection.deleteRule = "businessId.userId = @request.auth.id";
  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("senderDomains");
  collection.listRule = "businessId.userId = @request.auth.id";
  collection.viewRule = "businessId.userId = @request.auth.id";
  collection.createRule = "@request.auth.id != ''";
  collection.updateRule = "businessId.userId = @request.auth.id";
  collection.deleteRule = "businessId.userId = @request.auth.id";
  return app.save(collection);
})