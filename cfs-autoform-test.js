/*
 * @fileoverview
 * @external Meteor
 * @external SimpleSchema
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
} // if (Meteor.isClient())


