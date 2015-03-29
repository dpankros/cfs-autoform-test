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
      collection: 'files'
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


function pruneUnusedFiles() {
  var referencedFileIds = [];

  Docs.find({}).forEach(function(d){
    referencedFileIds.push(d.fileId);
  });

  MultiDocs.find({}).forEach(function(md){
    referencedFileIds = _.union(referencedFileIds, md.fileIds);
  });

  var unreferencedFilesCursor = Files.find(
      {
        _id: {
          $not: {
            $in: referencedFileIds
          }
        }
      });
  var unreferencedFileIds = [];
  unreferencedFilesCursor.forEach(
      function(f) {
        unreferencedFileIds.push(f._id);
      }
  );

  unreferencedFileIds.forEach(
      function(id) {
        Files.remove({_id: id});
      }
  );
};

if (Meteor.isClient) {
  Meteor.startup(function () {
    //defaults.  These must match the defaults on the corresponding html page
    CfsAutoForm.prefs.msg.set('filePlaceholder', 'Give Me a File!!');
    CfsAutoForm.prefs.set('deleteOnRemove', true);
    CfsAutoForm.prefs.set('uploadOnSelect', true);
  });


  getThumbnail = function getThumbnail(fileId) {
    if (!fileId) {
      return undefined;
    }

    var fileObj = CfsAutoForm.getFileWithCollectionAndId('files', fileId);

    if (!fileObj) {
      return undefined;
    }
    //check if it is an image type of file
    switch (fileObj.type().toLowerCase()){
      case 'image/jpg':
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return CfsAutoForm.getThumbnailSrc(fileObj);
    }
    //if it's not, there won't be a thumbnail, but we could return a generic
    //path to a pdf icon or a document icon, depending on the type, too.
    return undefined;
  };


  getIcon = function getIcon(fileId) {
    if (!fileId) {
      return 'fa-file-o'; //generic icon
    }

    var fileObj = CfsAutoForm.getFileWithCollectionAndId('files', fileId);

    if (!fileObj) {
      return 'fa-file-o';
    }

    var icon = 'fa-file-o';
    //check it's type against a known list.  This, of course, should eb edited
    //to contain types that your application supports.  It is not meant to be
    //exhaustive.  It uses types defined at:
    //http://www.iana.org/assignments/media-types/media-types.xhtml
    //These may or MAY NOT match what is returned by FS.File.type(). See e.g.,
    //application/mp4 and video/mp4, below.
    switch (fileObj.type().toLowerCase()) {
      case 'application/msword': //doc
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': //docx
        icon = 'fa-file-word-o';
        break;
      case 'application/vnd.ms-excel': //xls
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': //xslx
        icon = 'fa-file-excel-o';
        break;
      case 'application/vnd.ms-powerpoint': //ppt
      case 'application/vnd.openxmlformats-officedocument.presentationml.presentation'://pptx
        icon = 'fa-file-powerpoint-o';
        break;
      case 'application/pdf': //pdfs
        icon = 'fa-file-pdf-o';
        break;
      case 'application/zip': //zip files
        icon = 'fa-file-zip-o';
        break;
      case 'text/rtf': //text files
        icon = 'fa-file-text-o';
        break;
      case 'text/javascript': //code files
      case 'text/xml':
        icon = 'fa-file-code-o';
        break;
      case 'application/mp4': //mpegs, and the like
      case 'video/mp4':
      case 'application/mpeg4-generic':
      case 'application/mp21':
        icon = 'fa-file-video-o';
        break;
      default:
        icon = 'fa-file-o';
    }
    return icon;
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

  Template.dbInfo.helpers({
    docs_count: function(){ return Docs.find().count();},
    multidocs_count: function() {return MultiDocs.find().count();},
    files_count: function() {return Files.find().count();}
  });

  Template.dbInfo.events({
    'click #clear-docs': function(e){
      var objs = Docs.find();
      objs.forEach(function(o){Docs.remove(o._id);});
    },
    'click #clear-multidocs': function(e){
      var objs = MultiDocs.find();
      objs.forEach(function(o){MultiDocs.remove(o._id);});
    },
    'click #clear-files': function(e) {
      var objs = Files.find();
      objs.forEach(function(o){Files.remove(o._id);});
    },
    'click #prune-files': function(e) {
      pruneUnusedFiles();
    }
  });
} // if (Meteor.isClient())

