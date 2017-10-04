// send cloudinary url to api for facial recognition
function processImage() {
    var subscriptionKey = '777602b32d52468babf62398a5630de4';
    var uriBase = "https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";
    // Request parameters.
    var params = {
        "returnFaceId": "true",
        "returnFaceLandmarks": "false",
        "returnFaceAttributes": "age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise",
    };
    // Display the image.
    var sourceImageUrl = document.querySelector("#inputImage").src;
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
      $('#jumbotron').toggle();
      $('.imageCharts').show();
      var faceBox = $("<div></div>").css({"position":"absolute", "top":data[0].faceRectangle.top, "left":data[0].faceRectangle.left, "width":data[0].faceRectangle.width, height:data[0].faceRectangle.height, "border":"2px solid blue"});
      $('#imageBox').append(faceBox);

        var newData = data[0].faceAttributes.emotion;
        var ctx = document.getElementById("emotionChart").getContext('2d');
        var myRadarChart = new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness", "Neutral", "Sadness", "Surprise"],
              datasets: [
                {
                  label: "",
                  backgroundColor: "rgba(255,99,132,0.2)",
                  borderColor: "rgba(255,99,132,1)",
                  pointBorderColor: "#fff",
                  pointBackgroundColor: "rgba(255,99,132,1)",
                  pointBorderColor: "#fff",
                  data: [newData.anger, newData.contempt, newData.disgust, newData.fear, newData.happiness, newData.neutral, newData.sadness, newData.surprise]
                }
              ]
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
                display: true,
                text: 'Distribution of Emotions'
              }
            }
        });
        // build hair data chart
        var hairData = data[0].faceAttributes.hair.hairColor;
        var ctx1 = document.getElementById("hairChart").getContext('2d');
        var myHairChart = new Chart(ctx1, {
          type: 'horizontalBar',
          data: {
            labels: ["Brown", "Black", "Other", "Blond", "Red", "Grey"],
            datasets: [
              {
              label: "Confidence",
              backgroundColor: ["#8b7355","#000000","#bf3eff","#ffb90f","#c45850", "#8a8a8a"],
              data: [hairData[0].confidence, hairData[1].confidence, hairData[2].confidence, hairData[3].confidence, hairData[4].confidence, hairData[5].confidence]
              }
            ]
          },
        options: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Hair Color'
          }
        }
      });
    })
    .fail(function(jqXHR, textStatus, errorThrown) {
        var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
        errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
            jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
        alert(errorString);
    });
};
