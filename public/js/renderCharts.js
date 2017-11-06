// send cloudinary url to api for facial recognition
var dataSetData = [];
var hairDataSetData = [];

function processImage() {
    var subscriptionKey = 'ab957f71d79740ddb451c966aab58aca';
    var uriBase = "https://westus.api.cognitive.microsoft.com/face/v1.0/detect";
    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };
    // Display the image.
    var sourceImageUrl = document.querySelector(".inputImage").src;
    //api query
    $.ajax({
        url: uriBase + "?" + $.param(params),
        // Request headers.
        beforeSend: function(xhrObj){
            xhrObj.setRequestHeader("Content-Type","application/json");
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
        },
        type: "POST",
        data: '{"url": ' + '"' + sourceImageUrl + '"}',
    })
    .done(function(data) {
      //
      $('#jumbotron').toggle();
      $('.imageCharts').show();
      //
      var labels = ["Face", "Face 2", "Face 3", "Face 4", "Face 5", "Face 6"];
      var backgroundColors = ["rgba(255,0,0,0.2)",'rgba(102,0,204,0.2)', "rgba(0,102,204,0.2)", "rgba(102,204,0,0.2)", "rgba(204,0,204,0.2)", "rgba(0,0,204,0.2)"];
      var borderColors = ["rgba(255,0,0,1)","rgba(102,0,204,1)", "rgba(0,102,204,1)", "rgba(102,204,0,1)", "rgba(204,0,204,1)", "rgba(0,0,204,0.2)"];

      for(i=0;i<data.length; i++){
        //face square
        var info ="Gender: "+data[i].faceAttributes.gender+"\n Age: "+data[i].faceAttributes.age+"\n Smile: "+data[i].faceAttributes.smile+"\n Glasses: "+data[i].faceAttributes.glasses;
        var faceBox = $("<div></div>").attr({"data-toggle":"tooltip","title":info}).css({"position":"absolute", "top":data[i].faceRectangle.top, "left":data[i].faceRectangle.left, "width":data[i].faceRectangle.width, "height":data[i].faceRectangle.height, "borderWidth":"3px", "borderStyle":"solid", "borderColor": borderColors[i]});
        $('#imageBox').append(faceBox);

        //demographics
        var gender = $("<div>Gender: "+data[i].faceAttributes.gender+"</div>").css({"color":borderColors[i]});
        $("#otherData").append(gender);
        var age = $("<div>Age: "+data[i].faceAttributes.age+"</div>").css({"color":borderColors[i]});
        $("#otherData").append(age);
        if(data[i].faceAttributes.smile > .49){
          $("#otherData").append('<img src="/img/icons/smile.png">');
        }
        if(data[i].faceAttributes.glasses != "NoGlasses"){
          $("#otherData").append('<img src="/img/icons/glasses-1.png">');
        }
        if(data[i].faceAttributes.facialHair.beard > .49){
          $("#otherData").append('<img src="/img/icons/beard.png">');
        }
        if(data[i].faceAttributes.facialHair.moustache > .49){
          $("#otherData").append('<img src="/img/icons/moustache.png">');
        }

        //emotions data
          var newData = data[i].faceAttributes.emotion;
          dataSetData[i] = {
            label: labels[i],
            backgroundColor: backgroundColors[i],
            borderColor: borderColors[i],
            pointBorderColor: "#fff",
            pointBackgroundColor: borderColors[i],
            pointBorderColor: "#fff",
            data: [newData.anger,newData.contempt, newData.disgust, newData.fear, newData.neutral, newData.happiness, newData.sadness, newData.surprise]
          };
          //hair data
          var hairData = data[i].faceAttributes.hair.hairColor;
          if(hairData.length === 0){
            //do nothing
          }else{
            hairDataSetData[i] = {
              label: labels[i],
              backgroundColor: backgroundColors[i],
              borderColor: borderColors[i],
              pointBorderColor: "#fff",
              pointBackgroundColor: borderColors[i],
              pointBorderColor: "#fff",
              data: [hairData[0].confidence, hairData[1].confidence, hairData[2].confidence, hairData[3].confidence, hairData[4].confidence, hairData[5].confidence]
            };
          }
        }
        //emotions radar chart
        if(dataSetData.length === 0){
          $("#emotionChart").remove();
          $('<h5>Sorry, unable to recognize any emotions. <br><i class="fa fa-frown-o fa-2x" aria-hidden="true"></i></h5>').appendTo('#emotionError');
        }else{
          var ctx = document.getElementById("emotionChart").getContext('2d');
          var myRadarChart = new Chart(ctx, {
              type: 'radar',
              data: {
                labels: ["Anger", "Contempt", "Disgust", "Fear", "Neutral", "Happiness", "Sadness", "Surprise"],
                datasets: dataSetData
              },
              options: {
                legend: {
                  position: "bottom",
                  display: false
                },
                scale:{
                  ticks: {
                    beginAtZero: true,
                    max: 1
                  },
                },
                title: {
                  display: false
                }
              }
          });
        }
        //hair radar chart
        if(hairDataSetData.length === 0){
          $("#hairChart").remove();
          $('<h5>Sorry, unable to recognize any hair in your image. <br><i class="fa fa-frown-o fa-2x" aria-hidden="true"></i></h5>').appendTo('#hairError');
        }else{
          var ctx1 = document.getElementById("hairChart").getContext('2d');
          var myRadarChart = new Chart(ctx1, {
              type: 'radar',
              data: {
                labels: ["Brown", "Black", "Other", "Blond", "Red", "Grey"],
                datasets: hairDataSetData
              },
              options: {
                legend: {
                  position: "bottom",
                  display: false
                },
                scales:{
                  display: false,
                  ticks: {
                    display: false,
                    min: 0,
                    max: 1
                  },
                },
                title: {
                  display: false
                }
              }
            });
          }
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};
