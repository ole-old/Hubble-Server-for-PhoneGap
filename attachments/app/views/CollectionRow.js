$(function() {

  App.Views.CollectionRow = Backbone.View.extend({

    tagName: "tr",

    events: {
      "click .destroy" : function(e) {
        e.preventDefault()
        this.model.destroy()
        this.remove()
      },
      "click .browse" : function(e) {
        e.preventDefault()
        $('#modal').modal({show:true})
      }
    },

    template : $("#template-CollectionRow").html(),

    initialize: function() {
      //this.model.on('destroy', this.remove, this)
    },

    render: function () {
      
      var vars = this.model.toJSON()
      vars.sendToDevice = '/hubble/_design/hubble-local/index.html#collections/add/' + 
          location.hostname + 
          (location.port && ":" + location.port) +
          this.model.get('database') 
      this.$el.append(_.template(this.template, vars))
    }

  })

})
