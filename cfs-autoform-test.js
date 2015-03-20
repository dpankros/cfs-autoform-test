/*
 * @fileoverview
 * @external Meteor
 * @external SimpleSchema
 * @external CfsAutoForm
 */


Docs = new Meteor.Collection('docs');


Docs.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  fileId: {
    type: String,
    optional: true,
    autoform: {
      type: 'cfs-file',
      collection: 'files'
    }
  }
}));


MultiDocs = new Meteor.Collection('multi-docs');


MultiDocs.attachSchema(new SimpleSchema({
  name: {
    type: String
  },
  fileIds: {
    type: [String],
    optional: true,
    autoform: {
      type: 'cfs-files',
      collection: 'Files'
    }
  }
}));


Files = new FS.Collection('files', {
  stores: [new FS.Store.GridFS('filesStore')]
});


Files.allow({
  download: function () {
    return true;
  },
  fetch: null
});


if (Meteor.isClient) {
  Meteor.startup(function () {
    CfsAutoForm.prefs.msg.set('filePlaceholder', 'Give Me a File!!');
    CfsAutoForm.prefs.set('deleteOnRemove', true);
    CfsAutoForm.prefs.set('uploadOnSelect', true);
  });


  getThumbnail = function getThumbnail(fileId) {
    if (!fileId) {
      return undefined;
    }
    var fileObj = CfsAutoForm.getFileWithCollectionAndId('files', fileId);
    return CfsAutoForm.getThumbnailSrc(fileObj);
  };

  Template.opts.events({
    'change #uploadOnSelect': function (e) {
      console.log("Setting uploadOnSelect to true");
      CfsAutoForm.prefs.set('uploadOnSelect', true);
    },
    'change #uploadOnSubmit': function (e) {
      console.log("Setting uploadOnSelect to false");
      CfsAutoForm.prefs.set('uploadOnSelect', false);
    },
    'change #deleteOnRemove': function (e) {
      console.log("Setting deleteOnRemove to true");
      CfsAutoForm.prefs.set('deleteOnRemove', true);
    },
    'change #deleteNever': function (e) {
      console.log("Setting deleteOnRemove to false");
      CfsAutoForm.prefs.set('deleteOnRemove', false);
    },
    'click #placeholderSetButton': function (e) {
      var phText = $('#placeholderTextInput').val();
      console.log('Placeholder text is now: ' + phText);
      CfsAutoForm.prefs.msg.set('filePlaceholder', phText );
    },
    'keydown #placeholderTextInput': function (e) {
      //If enter is pressed, click the 'set' button
      if (e.which === 13) {
        $('#placeholderSetButton').click();
        return false;
      }
    }
  });
} // if (Meteor.isClient())

