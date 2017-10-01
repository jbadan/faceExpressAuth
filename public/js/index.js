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
            // Show formatted JSON on webpage.
            $("#responseTextArea").val(JSON.stringify(data, null, 2));
            var newData = data[0].faceAttributes.emotion;
            //build emotion radar chart
            var ctx = document.getElementById("emotionChart").getContext('2d');
            var myRadarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                  labels: ["Anger", "Contempt", "Disgust", "Fear", "Happiness", "Neutral", "Sadness", "Surprise"],
                  datasets: [
                    {
                      label: "Emotions",
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
                  title: {
                    display: true,
                    text: 'Distribution in % of emotion'
                  }
                }
            });
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
            // Display error message.
            var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
            errorString += (jqXHR.responseText === "") ? "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                jQuery.parseJSON(jqXHR.responseText).message : jQuery.parseJSON(jqXHR.responseText).error.message;
            alert(errorString);
        });
    };
