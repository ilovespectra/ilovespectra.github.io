function sharpenImage(canvas, context) {
  var imgData = context.getImageData(0, 0, canvas.width, canvas.height);

  var kernel = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1]
  ];

  var factor = 1;
  var bias = 0;
  var sum = 0;
  var weight = 0;

  for (var x = 0; x < imgData.width; ++x) {
    for (var y = 0; y < imgData.height; ++y) {
      var r = 0, g = 0, b = 0, a = 0;

      // Apply kernel
      for (var i = 0; i < kernel.length; ++i) {
        for (var j = 0; j < kernel[i].length; ++j) {
          var pixelX = x + i - Math.floor(kernel.length / 2);
          var pixelY = y + j - Math.floor(kernel[i].length / 2);

          if (pixelX >= 0 && pixelX < imgData.width && pixelY >= 0 && pixelY < imgData.height) {
            var pixelIndex = (pixelY * imgData.width + pixelX) * 4;

            r += imgData.data[pixelIndex] * kernel[i][j];
            g += imgData.data[pixelIndex + 1] * kernel[i][j];
            b += imgData.data[pixelIndex + 2] * kernel[i][j];
            a += imgData.data[pixelIndex + 3] * kernel[i][j];
          }
        }
      }

      // Apply factor and bias
      r = factor * r + bias;
      g = factor * g + bias;
      b = factor * b + bias;
      a = factor * a + bias;

      // Clamp values to [0, 255]
      r = Math.min(255, Math.max(0, r));
      g = Math.min(255, Math.max(0, g));
      b = Math.min(255, Math.max(0, b));

      // Update image data
      var pixelIndex = (y * imgData.width + x) * 4;
      imgData.data[pixelIndex] = r;
      imgData.data[pixelIndex + 1] = g;
      imgData.data[pixelIndex + 2] = b;
      imgData.data[pixelIndex + 3] = a;
    }
  }

  context.putImageData(imgData, 0, 0);

  // Resize canvas to 300 pixels resolution
  var scale = 300 / Math.max(canvas.width, canvas.height);
  canvas.width *= scale;
  canvas.height *= scale;

  // Scale image up to 300 pixels resolution
  var dataUrl = canvas.toDataURL('image/png');
  var img = new Image();
  img.onload = function() {
    canvas.width = 300;
    canvas.height = 300;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
  img.src = dataUrl;

  // Set the result as the source of an <img> element
  var result = document.getElementById('result');
  result.src = dataUrl;
}
