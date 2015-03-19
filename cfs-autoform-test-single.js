if (Meteor.isClient) {

  AutoForm.hooks({
    updateAFSingle: {
      onSuccess: function (operation, result, template) {
        $('#updateAutoFormSingle').modal('hide');
      }
    },
    updateQFSingle: {
      onSuccess: function (operation, result, template) {
        $('#updateQuickFormSingle').modal('hide');
      }
    },
    addSingle: {
      onSuccess: function (operation, result, template) {
        $('#addSingleModal').modal('hide');
      }
    }
  });


  Template.navbarSingle.events({
    'click .add': function(event, template) {
      $('#addSingleModal').modal('show');
    }
  });


  Template.single_files.helpers({
    file: function () {
      return Docs.find({});
    },
    hasRows: function () {
      return Docs.find({}).count() > 0;
    }
  });


  Template.single_files.events({
    'click #removeRow': function (event, template) {
      Docs.remove({_id: this._id});
    }
  });


  Template.single_row.helpers({
    hasThumbnail: function () {
      return getThumbnail(this.fileId) !== undefined;
    },

    thumbnail: function () {
      return getThumbnail(this.fileId);
    },

    icon: function () {
      return 'fa-file';
    }
  });


  Template.single_row.events({
    'click .af': function (e) {
      Session.set('selectedId', this._id);
      $('#updateAutoFormSingle').modal('show');
    },

    'click .qf': function (e) {
      Session.set('selectedId', this._id);
      $('#updateQuickFormSingle').modal('show');
    }
  });


  Template.updateQuickFormModalSingle.helpers({
    file: function () {
      return Docs.findOne(Session.get('selectedId'));
    }
  });


  Template.updateAutoFormModalSingle.helpers({
    file: function () {
      return Docs.findOne(Session.get('selectedId'));
    }
  });

}