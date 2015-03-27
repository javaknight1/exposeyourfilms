$(document).ready(function() {
        'use strict';

        function isAllComplete(){
          var filmUploadVal = $('#film-saved').val();
          var trailerUploadVal = $('#trailer-saved').val();
          var coverUploadVal = $('#cover-saved').val();
          var infoUploadVal = $('#info-saved').val();

          if(filmUploadVal === 1 && trailerUploadVal === 1 &&
            coverUploadVal === 1 && infoUploadVal === 1){
            return true;
          }else{
            return false;
          }
        }

        // Dropzone graphical tools
        // ======================
        var dropZone = $('#drop-zone-film');
        var startUpload = function(files) {
          console.log(files);
        }
        dropZone.ondrop = function(e) {
          e.preventDefault();
          this.className = 'upload-drop-zone';
          startUpload(e.dataTransfer.files);
        }
        dropZone.ondragover = function() {
          this.className = 'upload-drop-zone drop';
          return false;
        }
        dropZone.ondragleave = function() {
          this.className = 'upload-drop-zone';
          return false;
        }

        $('#film-upload-container').show();

        // Upload functionality tools
        // =====================
        $('#film-select').click(function(){
          console.log("Clicked button!!");
          $('#film-upload-file').click();
        });

        $('#film-upload-file').change(function(){
          if($('#film-upload-file')[0].value.length == 0){
              console.log("You clicked cancel!!");
            }else{
              console.log("You didn't clicked cancel!!");
              $('#film-form').ajaxSubmit({
                  data: { 'sub' : 'film'},
                  beforeSubmit: function(data, form, options){
                      console.log("...Starting to send form...");
                      $('#film-upload-container').slideUp("slow", function(){
                        $('#film-timeline').slideDown();
                        $('#trailer-upload-container').slideDown();
                        $('#upload-warning').show();
                      });
                  },
                  uploadProgress: function(e, position, total, percent){
                      console.log("Percent (film): " + percent);
                      var realpercent = (position/total) * 100;
                      $('#film-upload-progress').css("width", realpercent + "%");
                  },
                  error: function(xhr) {
                    console.log('Error(Status): ' + xhr.status);
                  },
                  success: function(response) {
                      console.log("Success!!");
                      $('#film-saved').val(1);
                      if(ifAllComplete()){
                        //go to account page
                      }
                  }
              });
            }
        });

        $('#trailer-select').click(function(){
          console.log("Clicked button!!");
          $('#trailer-upload-file').click();
        });

        $('#trailer-upload-file').change(function(){
          if($('#trailer-upload-file')[0].value.length == 0){
              console.log("You clicked cancel!!");
            }else{
              console.log("You didn't clicked cancel!!");
              $('#trailer-form').ajaxSubmit({
                  data: { 'sub' : 'trailer'},
                  beforeSubmit: function(data, form, options){
                      console.log("...Starting to send form...");
                      $('#trailer-upload-container').slideUp("slow", function(){
                        $('#trailer-timeline').slideDown();
                        $('#cover-upload-container').slideDown();
                        $('#upload-warning').show();
                      });
                  },
                  uploadProgress: function(e, position, total, percent){
                      console.log("Percent (trailer): " + percent);
                      var realpercent = (position/total) * 100;
                      $('#trailer-upload-progress').css("width", realpercent + "%");
                  },
                  error: function(xhr) {
                    console.log('Error(Status): ' + xhr.status);
                  },
                  success: function(response) {
                      console.log("Success!!");
                      $('#trailer-saved').val(1);
                      if(ifAllComplete()){
                        //go to account page
                      }
                  }
              });
            }
        });

        $('#cover-select').click(function(){
          console.log("Clicked button!!");
          $('#cover-upload-file').click();
        });

        $('#cover-upload-file').change(function(){
          if($('#cover-upload-file')[0].value.length == 0){
              console.log("You clicked cancel!!");
            }else{
              console.log("You didn't clicked cancel!!");
              $('#cover-form').ajaxSubmit({
                  data: { 'sub' : 'cover'},
                  beforeSubmit: function(data, form, options){
                      console.log("...Starting to send form...");
                      $('#cover-upload-container').slideUp("slow", function(){
                          $('#cover-timeline').slideDown();
                          $('#film-info-container').slideDown();
                          $('#upload-warning').show();
                      });
                  },
                  uploadProgress: function(e, position, total, percent){
                      console.log("Percent (cover art): " + percent);
                      var realpercent = (position/total) * 100;
                      $('#cover-upload-progress').css("width", realpercent + "%");
                  },
                  error: function(xhr) {
                    console.log('Error(Status): ' + xhr.status);
                  },
                  success: function(response) {
                      console.log("Success!!");
                      $('#cover-saved').val(1);
                      if(ifAllComplete()){
                        //go to account page
                      }
                  }
              });
            }
        });

$(".overlay").hover(
      function() {
        $(this).stop().animate({"opacity": "1"}, "fast");
      },
      function() {
        $(this).stop().animate({"opacity": "0"}, "fast");
      }
    );
      });