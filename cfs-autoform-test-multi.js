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
    file: function () {
      return MultiDocs.find({});
    },
    hasRows: function () {
      return MultiDocs.find({}).count() > 0;
    }
  });


  Template.multi_files.events({
    'click #removeRow': function (event, template) {
      MultiDocs.remove({_id: this._id});
    }
  });


  Template.multi_row.helpers({
    hasThumbnail: function () {
      return getThumbnail(this.fileId) !== undefined;
    },

    thumbnail: function () {
      return Files.find(this.fileIds);
    },

    thumbnail: function () {
      return getThumbnail(this.fileId);
    },

    icon: function () {
      return 'fa-file';
    }
  });


  Template.multi_row.events({
    'click .af': function (e) {
      Session.set('selectedId', this._id);
      $('#updateAutoForm').modal('show');
    },
    'click .qf': function (e) {
      Session.set('selectedId', this._id);
      $('#updateQuickForm').modal('show');
    }
  });
}