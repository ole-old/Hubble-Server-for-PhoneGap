$(function() {
  App.Router = new (Backbone.Router.extend({

    routes: {
      ''                                         : 'Collections',
      'collections'                              : 'Collections',
      'collection/resource/add/:db'              : 'ResourceForm',
      'collection/resource/edit/:db/:resourceId' : 'ResourceForm',
      'collection/resource/send/:db/:resourceId' : 'ResourceSend',
      'collection/resources/:db'                 : 'CollectionResources',
      'collection/add'                           : 'CollectionAdd',
      'collection/:collectionId'                 : 'Collection',
    },

    ResourceSend : function(db, resourceId) {
      var collections = new App.Collections.Collections()
      collections.fetch()
      var resourceSendTable = new App.Views.ResourceSendTable({collection: collections})
      resourceSendTable.render()
      App.$el.children('#body').html(resourceSendTable.el)
    },

    CollectionAdd : function() {

      // Set up the model
      var collection = new App.Models.Collection()
      // when the users submits the form, the collection will be processed
      collection.on('processed', function() {
        this.save()
      })
      // after this collection is saved move on to the collections page
      collection.on('sync', function() {
        Backbone.history.navigate('collections', {trigger: true})
      })

      // Set up the form
      var collectionForm = new App.Views.CollectionForm({model: collection})
      collectionForm.render()
      $('#modal').modal('show')
      $("#modal .content").html(collectionForm.el)

    },

    ResourceForm : function(db, resourceId) {
      window.thisDb = db
      var resource = (resourceId)
        ? new App.Models.Resource({id: resourceId})
        : new App.Models.Resource()
      resource.on('processed', function() {
        Backbone.history.navigate('collection/resources/' + db, {trigger: true})
      })
      var resourceFormView = new App.Views.ResourceForm({model: resource})
      resourceFormView.render()
      App.$el.children('#body').html(resourceFormView.el)
    },

    CollectionResources: function(db) {
      App.thisDb = db
      var resources = new App.Collections.Resources()
      resources.fetch({success: function() {
        var resourcesTableView = new App.Views.ResourcesTable({collection: resources})
        resourcesTableView.render()
        $('#body').html(resourcesTableView.el)
      }})
     
    },

    // @todo When a CollectionRow's delete button is pressed and that CollectionRow was added since the last page
    // refresh, this Collections route will be called. Why?
    Collections: function() {
      // in case the modal is up, hide it
      $("#modal").modal("hide")
      collections = new App.Collections.Collections()
      collections.fetch({success: function() {
        collectionsTable = new App.Views.CollectionsTable({collection: collections})
        collectionsTable.render()
        App.$el.children('#body').html(collectionsTable.el)
      }})
    },

    Collection: function(collectionId) {
      
      // @todo Shouldn't I be feeding collectionId into this?
      App.resources = new App.Collections.Resources()
      App.resources.fetch({success: function() {
        console.log(App.resources)
        App.resourcesView = new App.Views.Resources({collection: App.resources})
        App.resourcesView.render()
        $("#app").html(App.resourcesView.el)
      }})

    }


  }))

})
