function sharpenImage() {
    var img = new Image();
    img.onload = function() {
        // get canvas contexts
        var canvas = document.getElementById("canvas");
        var canvasSharpened = document.getElementById("canvasSharpened");
        var ctx = canvas.getContext("2d");
        var ctxSharpened = canvasSharpened.getContext("2d");

        // calculate new canvas dimensions based on 4K
        var width = 3840;
        var height = 3840;



        // set canvas dimensions
        canvas.width = 3840;
        canvas.height = 3840;
        canvasSharpened.width = width;
        canvasSharpened.height = height;

        // draw original image on canvas
        ctx.drawImage(img, 0, 0, width, height);

        // apply filter to canvas (This is the magic right hur, fk around, find out.)
        var filter = [-1, -1, -1, 
                      -1,  9, -1, 
                      -1, -1, -1];

        var imageData = ctx.getImageData(0, 0, width, height);
        var data = imageData.data;
        var newData = new Uint8ClampedArray(data.length);

        for (var i = 0; i < data.length; i += 4) {
            var r = data[i];
            var g = data[i + 1];
            var b = data[i + 2];
            var a = data[i + 3];

            var rTotal = 0;
            var gTotal = 0;
            var bTotal = 0;

            for (var j = 0; j < filter.length; j++) {
                var x = (i / 4) % width;
                var y = Math.floor(i / 4 / width);

                var pixelIndex = ((y + Math.floor(j / 3) - 1) * width + (x + j % 3 - 1)) * 4;
                if (pixelIndex < 0 || pixelIndex >= data.length) {
                    continue;
                }

                rTotal += data[pixelIndex] * filter[j];
                gTotal += data[pixelIndex + 1] * filter[j];
                bTotal += data[pixelIndex + 2] * filter[j];
            }

            newData[i] = rTotal;
            newData[i + 1] = gTotal;
            newData[i + 2] = bTotal;
            newData[i + 3] = a;
        }

        imageData.data.set(newData);
        ctxSharpened.putImageData(imageData, 0, 0);

        // show sharpened image
        var downloadLink = document.getElementById("downloadLink");
        downloadLink.href = canvasSharpened.toDataURL();
        downloadLink.style.display = "block";
    };

    // load image
    img.src = URL.createObjectURL(document.getElementById("imageFile").files[0]);
}
document.getElementById("sharpenButton").addEventListener("click", sharpenImage);
