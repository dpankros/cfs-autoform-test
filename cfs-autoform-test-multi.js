if (Meteor.isClient) {

  AutoForm.hooks({
    updateAFMuti: {
      onSuccess: function (operation, result, template) {
        $('#updateAutoFormMulti').modal('hide');
      }
    },
    updateQFMulti: {
      onSuccess: function (operation, result, template) {
        $('#updateQuickFormMulti').modal('hide');
      }
    },
    addMulti: {
      onSuccess: function (operation, result, template) {
        $('#addMultiModal').modal('hide');
      }
    }
  });


  Template.navbarMulti.events({
    'click .add': function(event, template) {
      $('#addMultiModal').modal('show');
    }
  });


  Template.multi_files.helpers({
    doc: function () {
      return MultiDocs.find({});
    },
    hasRows: function () {
      return MultiDocs.find({}).count() > 0;
    }
  });


  Template.multi_files.events({
    'click #removeRowM': function (event, template) {
      MultiDocs.remove({_id: this._id});
    }
  });


  Template.multi_row.helpers({
    hasThumbnail: function () {
      return getThumbnail(this._id) !== undefined;
    },

    file: function () {
      return Files.find({_id:{$in: this.fileIds}});
    },

    thumbnail: function () {
      return getThumbnail(this._id);
    },

    icon: function () {
      return 'fa-file';
    },
    fileIds: function () {
      //allow the text to wrap by adding a whitespace character
      return this.fileIds.join(', ');
    }
  });


  Template.multi_row.events({
    'click .af': function (e) {
      Session.set('selectedId', this._id);
      $('#updateAutoFormMulti').modal('show');
    },
    'click .qf': function (e) {
      Session.set('selectedId', this._id);
      $('#updateQuickFormMulti').modal('show');
    }
  });


  Template.updateQuickFormModalMulti.helpers({
    file: function () {
      return MultiDocs.findOne(Session.get('selectedId'));
    }
  });


  Template.updateAutoFormModalMulti.helpers({
    file: function () {
      return MultiDocs.findOne(Session.get('selectedId'));
    }
  });
}