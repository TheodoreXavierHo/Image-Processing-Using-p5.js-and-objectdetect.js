/////////////////////////////////////
// IMAGE PROCESSING USING P5.JS AND OBJECTDETECT.JS
/////////////////////////////////////

// Image Processing Using p5.js and objectdetect.js
// This program processes a webcam image using p5.js for filtters/image maniplulation 
// and objectdetect.js for face detection.

/*
Commentary on the Image Processing App

Image Segmentation:
Using Each Colour Channel, in implementing image segmentation with a slider for each colour channel separately, 
distinct characteristics were observed in the segmentation results. When segmenting the image based on individual 
colour channels (red, green, and blue), each channel emphasized areas with higher intensity in its corresponding 
colour component while suppressing others. For example, the red channel segmentation highlighted regions with 
predominantly red hues, such as red objects or surfaces, while the green and blue channels targeted their 
respective colour components. This resulted in segmented images with varying emphasis on different colour 
components, providing insights into the distribution and intensity of hues present in the image.

Segmentation Results Using Colour-Converted Images:
When utilising alternative colour spaces like HSI or CMY(K) with a slider to control the threshold for image 
segmentation, distinct characteristics were observed compared to direct segmentation on the snapshot. 
These colour spaces offer different representations of colour, potentially leading to better noise reduction 
or preservation of relevant image features. However, challenges arise in balancing noise reduction with accurate 
segmentation, as different colour spaces may prioritise different aspects of the image data. Adjusting thresholds 
in HSI or CMY(K) may present challenges due to differences in colour component interpretation compared to RGB. 
Despite these challenges, exploring alternative colour spaces holds promise for improving segmentation results and 
enhancing image analysis tasks.

Addressing Challenges and Project Completion:
While striving for project completion, challenges arose, notably in implementing face detection functionality. 
Initially intending to utilize ml5.js, integration issues led to adopting objectdetect.js from the lecture video 
for face detection. This adjustment facilitated the inclusion of face detection in the project. While segmentation 
thresholding posed minor challenges, primarily concerning noise management, overall, it did not significantly 
impede progress. Refinement of segmentation algorithms to mitigate noise and lighting variations was pivotal for 
enhancing accuracy. 

Extension: Enhancing User Interaction with a Grid of Virtual Emitters:
As part of the creative extension, a grid of virtual emitters was implemented to enhance user interaction and 
engagement. This feature overlays on the image or webcam feed, emitting particles based on surrounding image 
content and user-defined rules. Parameters such as brightness or colour influence govern particle behaviour, 
while rules for particle generation, behaviour, or appearance are established based on nearby pixel influence. 
Real-time visual feedback enables users to witness how changes in the image content affect particle behaviour, 
creating an engaging experience. The extension aims to provide users with an interactive and dynamic visual 
representation of the image content, enhancing their overall experience.

In conclusion, the project explored various techniques for image segmentation and addressed challenges encountered 
along the way. Through experimentation and refinement, improvements were made to achieve desired outcomes. 
Additionally, the creative extension added a unique dimension to the project, enhancing user interaction and 
engagement.
*/

// Variables for video capture, buttons, snapshot, and images
let video; // Video capture element
let captureButton; // Button to capture a snapshot from the webcam
let snapshotButton; // Button to save the snapshot
let snapshot; // Variable to store the captured snapshot
let greyscaleImage; // Image variable for greyscale conversion
let modifiedImage; // Image variable for modifying brightness
let redSlider, greenSlider, blueSlider; // Sliders for segmentation thresholds
let fileInput; // Input element for loading external images
let captureStatus; // Set Capture Status
let greyscaleStatus; // Flag to indicate if greyscale filter is applied
let bluredStatus; // Flag to indicate if blur filter is applied
let colourConvertedStatus; // Flag to indicate if colour conversion is applied
let pixelatedStatus; // Flag to indicate if pixelation is applied
var detector; // Face detector
var classifier = objectdetect.frontalface; // Classifier for face detection
var faceImg; // Image variable for face detection
var faces; // Array to store detected faces
let maxParticles = 1000; // Maximum number of particles to generate
let particleSize = 5; // Size of particles
let maxParticlesSlider, particleSizeSlider;
let faceDetectionOn;

function setup() {
    // Creating canvas with a larger size to accommodate grid layout and images
    createCanvas(520, 1000);
    pixelDensity(1); // Ensuring consistent pixel density

    // Creating video capture element
    video = createCapture(VIDEO);
    video.size(160, 120); // Setting video capture size to 160 x 120 pixels
    video.hide(); // Hiding the video element

    detector = new objectdetect.detector(160, 120, 1.2, classifier);
    faceImg = createImage(160, 120); // Creating an image for face detection

    // Creating buttons for snapshot capture and saving
    captureStatus = false;
    captureButton = createButton('Capture');
    captureButton.mousePressed(takeSnapshot); // Event handler for capture button
    captureButton.position(352, 960);

    snapshotButton = createButton('Save Snapshot');
    snapshotButton.mousePressed(saveSnapshot); // Event handler for save snapshot button
    snapshotButton.position(415, 960);

    // Creating file input element for loading images
    fileInput = createFileInput(handleFile); // Event handler for file input
    fileInput.position(270, 980);

    // Creating sliders for segmentation thresholds
    redSlider = createSlider(0, 255, 0); // Slider for red channel threshold
    redSlider.position(10, 450);
    greenSlider = createSlider(0, 255, 0); // Slider for green channel threshold
    greenSlider.position(180, 450);
    blueSlider = createSlider(0, 255, 0); // Slider for blue channel threshold
    blueSlider.position(350, 450);

    // Creating slider for segmentation threshold for CMY(K)
    thresholdSliderCMYK = createSlider(0, 255, 0);
    thresholdSliderCMYK.position(180, 770);

    // Creating slider for segmentation threshold for HSI
    thresholdSliderHSI = createSlider(0, 255, 0);
    thresholdSliderHSI.position(350, 770);

    // Create sliders for particle effect parameters
    maxParticlesSlider = createSlider(0, 10000, maxParticles);
    maxParticlesSlider.position(10, 950);

    particleSizeSlider = createSlider(0, 10, particleSize);
    particleSizeSlider.position(10, 975);

    // Initializing status flags for filters
    greyscaleStatus = false;
    bluredStatus = false;
    colourConvertedStatus = false;
    pixelatedStatus = false;
    faceDetectionOn = false;
}

function draw() {
    background(255);

    // Update parameter values based on sliders
    maxParticles = maxParticlesSlider.value();
    particleSize = particleSizeSlider.value();

    // Displaying the title text "Webcam image" in the grid
    textSize(12);
    textAlign(CENTER);
    fill(0);
    text('Webcam image', 90, 145);

    // Displaying the webcam image in the grid
    image(video, 10, 10, 160, 120); // Display video feed

    // Capture snapshot if not already captured
    if (!captureStatus) {
        snapshot = get(10, 10, 160, 120);
    }

    // Display text below the modified snapshot
    text('Greyscale +20% Brightness', 260, 145);

    // Convert the snapshot to greyscale and increase brightness by 20%
    modifiedImage = createImage(160, 120); // Create modified image object
    modifiedImage.copy(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, snapshot.width, snapshot.height);
    modifiedImage.loadPixels(); // Load pixel data for modification
    for (let y = 0; y < modifiedImage.height; y++) {
        for (let x = 0; x < modifiedImage.width; x++) {
            let index = (x + y * modifiedImage.width) * 4;
            let pixelRed = modifiedImage.pixels[index];
            let pixelGreen = modifiedImage.pixels[index + 1];
            let pixelBlue = modifiedImage.pixels[index + 2];

            // Calculate the average value of RGB channels (greyscale)
            let average = pixelRed * 0.299 + pixelGreen * 0.587 + pixelBlue * 0.114;

            // Increase brightness by 20%
            average *= 1.2;
            average = constrain(average, 0, 255); // Clamping within the range 0-255

            // Set RGB channels to the increased brightness value
            modifiedImage.pixels[index] = average;
            modifiedImage.pixels[index + 1] = average;
            modifiedImage.pixels[index + 2] = average;
            modifiedImage.pixels[index + 3] = 255;
        }
    }
    modifiedImage.updatePixels(); // Update modified pixel data

    // Display the modified image
    image(modifiedImage, 180, 10, 160, 120); // Display modified image

    // Display the title text for colour channels
    text('Red Channel', 90, 295);
    text('Green Channel', 260, 295);
    text('Blue Channel', 430, 295);

    // Extracting colour channels from the snapshot
    let redChannel = getRedChannel(snapshot);
    let greenChannel = getGreenChannel(snapshot);
    let blueChannel = getBlueChannel(snapshot);

    // Displaying each colour channel in the grid
    image(redChannel, 10, 160, 160, 120);
    image(greenChannel, 180, 160, 160, 120);
    image(blueChannel, 350, 160, 160, 120);

    // Display the title text for segmented channels
    text('Segmented Red Channel', 90, 445);
    text('Segmented Green Channel', 260, 445);
    text('Segmented Blue Channel', 430, 445);

    // Applying segmentation to each channel based on slider values
    let segmentedChannels = segmentChannels(snapshot);

    // Displaying each segmented colour channel in the grid
    image(segmentedChannels.redImg, 10, 310, 160, 120);
    image(segmentedChannels.greenImg, 180, 310, 160, 120);
    image(segmentedChannels.blueImg, 350, 310, 160, 120);

    // Displaying the title text "Webcam image" in the grid
    text('Webcam image', 90, 615);

    // Displaying the webcam image in the grid
    image(snapshot, 10, 480, 160, 120);

    // Display CMY(K) and HSI text below the snapshot
    text('CMY(K) Conversion', 260, 615);
    text('HSI Conversion', 430, 615);

    // Convert the snapshot to CMY(K)
    cmykImage = convertToCMYK(snapshot);
    // Convert the snapshot to HSI
    hsiImage = convertToHSI(snapshot);

    // Display the CMY(K) image
    image(cmykImage, 180, 480, 160, 120);
    // Display the HSI image
    image(hsiImage, 350, 480, 160, 120);

    // Display the title text for segmented colour space
    text('Segmented CMY(K)', 260, 765);
    text('Segmented HSI', 430, 765);

    // Apply segmentation to the cmykImage based on static threshold
    let segmentedcmykImg = segmentImageDynamic(cmykImage, thresholdSliderCMYK);
    let segmentedhsiIMG = segmentImageDynamic(hsiImage, thresholdSliderHSI);

    // Display the segmented image
    image(segmentedcmykImg, 180, 630, 160, 120);
    image(segmentedhsiIMG, 350, 630, 160, 120);

    // Displaying the title text "Face Detection" in the grid
    text('Face Detection', 90, 765);

    // Copying the snapshot to a new image and detecting faces
    faceImg.copy(snapshot, 0, 0, snapshot.width, snapshot.height, 0, 0, snapshot.width, snapshot.height);
    faces = detector.detect(faceImg.canvas);

    // Call in Face Detection Function
    faceDetection(faces);

    // Displaying the title text "Image-Reactive Particle Effect" in the grid
    text('Image-Reactive Particle Effect', 90, 935);

    // Call applyImageReactiveEffect function at grid slot (10, 780)
    applyImageReactiveEffect(10, 800, snapshot);
}

/////////////////////////////////////
// All FUNCTIONS BESIDES SETUP AND DRAW
/////////////////////////////////////

function faceDetection(faces) {
    // Conditional rendering based on status flags
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        if (face[4] > 4) {
            faceDetectionOn = true;
            if (!greyscaleStatus && !bluredStatus && !colourConvertedStatus && !pixelatedStatus) {
                // If no filters are applied, display the original face image
                image(faceImg, 10, 630, 160, 120);

                // Draw rectangles around detected faces
                drawFaceRectangles(faces);

                // Display options
                push();
                textAlign(LEFT);
                text('Press Z to enable Greyscale Face Filter', 209, 840);
                text('Press X to enable Blur Face Filter', 209, 860);
                text('Press C to enable CMY(K) Colour Space Face Filter', 209, 880);
                text('Press V to enable Pixelated Face Filter', 209, 900);
                pop();
            };
            if (greyscaleStatus && !bluredStatus && !colourConvertedStatus && !pixelatedStatus) {
                // Apply greyscale filter if selected
                let faceImgGreyscale = applyGreyscale(faceImg);
                image(faceImgGreyscale, 10, 630, 160, 120);

                // Display options
                push();
                textAlign(LEFT);
                text('Press Z to disable Greyscale Face Filter', 209, 840);
                pop();
            };
            if (!greyscaleStatus && bluredStatus && !colourConvertedStatus && !pixelatedStatus) {
                // Display face image
                image(faceImg, 10, 630, 160, 120);

                // Apply blur filter to face if selected
                applyBlur();

                // Display options
                push();
                textAlign(LEFT);
                text('Press Z to disable Blur Face Filter', 209, 840);
                pop();
            };
            if (!greyscaleStatus && !bluredStatus && colourConvertedStatus && !pixelatedStatus) {
                // Display the face image
                image(faceImg, 10, 630, 160, 120);

                // Apply CMY(K) filter to face if selected
                applyCMYKFilter();

                // Display options
                push();
                textAlign(LEFT);
                text('Press Z to disable CMY(K) Colour Space Face Filter', 209, 840);
                pop();
            };
            if (!greyscaleStatus && !bluredStatus && !colourConvertedStatus && pixelatedStatus) {
                // Display the face image
                image(faceImg, 10, 630, 160, 120);

                // Apply Pixelated filter to face if selected
                applyPixelation();

                // Display options
                push();
                textAlign(LEFT);
                text('Press Z to disable ixelated Face Filter', 209, 840);
                pop();
            };
        } else {
            faceDetectionOn = false;
        }
    }
}

function applyImageReactiveEffect(xOffset, yOffset, snapshotImage) {
    if (!snapshotImage) return; // Check if snapshot image is loaded

    // Load pixels of the snapshot image
    snapshotImage.loadPixels();

    // Limit the number of particles generated based on the image size
    let numParticles = min(maxParticles, snapshotImage.width * snapshotImage.height);

    // Generate particles based on the snapshot image
    for (let i = 0; i < numParticles; i++) {
        // Generate random position within the image
        let x = int(random(snapshotImage.width));
        let y = int(random(snapshotImage.height));

        // Get the brightness of the pixel at (x, y)
        let pixelBrightness = getPixelBrightness(snapshotImage, x, y);

        // Calculate particle colour based on brightness and generate particle
        generateParticle(x + xOffset, y + yOffset, pixelBrightness);
    }
}

// Get the brightness of the pixel at position (x, y) in the image
function getPixelBrightness(img, x, y) {
    let index = (x + y * img.width) * 4;
    let pixelRed = img.pixels[index];
    let pixelGreen = img.pixels[index + 1];
    let pixelBlue = img.pixels[index + 2];
    return (pixelRed * 0.299 + pixelGreen * 0.587 + pixelBlue * 0.114); // Return average brightness
}

// Calculate colour based on brightness
function generateParticle(x, y, brightness) {
    let hue = map(brightness, 0, 255, 0, 360); // Map brightness to hue
    let particleColour = color(hue, 100, 100); // Calculate colour in HSB format (Hue, Saturation, Brightness)

    // Render particle
    fill(particleColour);
    noStroke();
    ellipse(x, y, particleSize, particleSize);
}

// Function to apply pixelation to the detected face
function applyPixelation() {
    // Define the block size
    let blockSize = 5;
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        if (face[4] > 4) {
            // Define the region of interest (ROI) as the detected face region
            let x = face[0] + 10;
            let y = face[1] + 630;
            let w = face[2];
            let h = face[3];

            // Extract the pixels from the specified region
            let inputImage = get(x, y, w, h);

            // Ensure the inputImage is ready for pixel manipulation by loading its pixels into memory
            inputImage.loadPixels();

            // Create a separate output image to store results, preventing modification of the original
            let outimage = createImage(inputImage.width, inputImage.height);
            outimage.loadPixels();

            // Iterate through the image in blocks, stepping by the blockSize
            for (let y = 0; y < inputImage.height; y += blockSize) {
                for (let x = 0; x < inputImage.width; x += blockSize) {
                    // Calculate the average pixel intensity for the current block
                    let avePixInt = calculateAverageIntensity(inputImage, x, y, blockSize);

                    // Paint the entire block in the output image using the average intensity
                    for (let blockY = 0; blockY < blockSize; blockY++) {
                        for (let blockX = 0; blockX < blockSize; blockX++) {
                            // Calculate coordinates within the output image
                            let outX = x + blockX;
                            let outY = y + blockY;

                            // Set the pixel in the output image to the calculated average intensity
                            outimage.set(outX, outY, avePixInt);
                        }
                    }
                }
            }
            // Update the output image's pixels 
            outimage.updatePixels();

            // Draw the blurred face region back onto the snapshot
            image(outimage, x, y);
        }
    }
}

// Function to calculate average pixel intensity within a block
function calculateAverageIntensity(image, startX, startY, blockSize) {
    let totalIntensity = 0;
    let pixelCount = 0;

    // Iterate over each pixel within the specified block
    for (let y = startY; y < startY + blockSize; y++) {
        for (let x = startX; x < startX + blockSize; x++) {
            // Calculate the index of the pixel in the image's pixel array
            let index = (x + y * image.width) * 4;

            // Extract the red component (grayscale, so R, G, B are the same)
            let r = image.pixels[index + 0];

            // Add the red component to the total intensity
            totalIntensity += r;
            pixelCount++; // Increment the count of pixels considered
        }
    }

    // Calculate and return the average intensity
    return totalIntensity / pixelCount;
}

// Apply CMY(K) filter to face if selected
function applyCMYKFilter() {
    // Convert the face iamge to CMY(K)
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        if (face[4] > 4) {
            // Define the region of interest (ROI) as the detected face region
            let x = face[0] + 10;
            let y = face[1] + 630;
            let w = face[2];
            let h = face[3];

            // Extract the pixels from the specified region
            let cropedIMG = get(x, y, w, h);

            // Apply blur to the cropped face region
            let faceCMYKImage = convertToCMYK(cropedIMG);

            push();
            fill(255);
            // Draw rectangle around the detected face
            rect(face[0] + 10, face[1] + 630, face[2], face[3]);
            pop();

            // Draw the blurred face region back onto the snapshot
            image(faceCMYKImage, x, y);
        }
    }
}

// Function to apply blur to the detected faces
function applyBlur() {
    // Get the detected faces
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        if (face[4] > 4) {
            // Define the region of interest (ROI) as the detected face region
            let x = face[0] + 10;
            let y = face[1] + 630;
            let w = face[2];
            let h = face[3];

            // Extract the pixels from the specified region
            let croppedFace = get(x, y, w, h);

            // Apply blur to the cropped face region
            croppedFace.filter(BLUR, 5);

            // Draw the blurred face region back onto the snapshot
            image(croppedFace, x, y);
        }
    }
}

// Function to draw rectangles around detected faces
function drawFaceRectangles(faces) {
    push();
    strokeWeight(5);
    stroke(255, 0, 0);
    noFill();
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        if (face[4] > 4) {
            // Draw rectangle around the detected face
            rect(face[0] + 10, face[1] + 630, face[2], face[3]);
        }
    }
    pop();
}

// Function to apply greyscale filter to an input image
function applyGreyscale(inputImage) {
    // Create a new image object to store the greyscaled version
    let greyscaleImage = createImage(inputImage.width, inputImage.height);

    // Load pixels of the original image
    inputImage.loadPixels();
    greyscaleImage.loadPixels();

    // Loop through each pixel of the input image
    for (let x = 0; x < inputImage.width; x++) {
        for (let y = 0; y < inputImage.height; y++) {
            // Get the pixel index
            let index = (x + y * inputImage.width) * 4;

            // Get the RGB values of the current pixel
            let pixelRed = inputImage.pixels[index];
            let pixelGreen = inputImage.pixels[index + 1];
            let pixelBlue = inputImage.pixels[index + 2];

            // Calculate the greyscale value using specified formula
            let greyscale = pixelRed * 0.299 + pixelGreen * 0.587 + pixelBlue * 0.114;

            // Set the greyscale value for each channel (R, G, B)
            greyscaleImage.pixels[index] = greyscale;
            greyscaleImage.pixels[index + 1] = greyscale;
            greyscaleImage.pixels[index + 2] = greyscale;
            greyscaleImage.pixels[index + 3] = 255; // Set alpha value
        }
    }

    // Update pixels of the greyscaled image
    greyscaleImage.updatePixels();

    // Return the greyscaled image
    return greyscaleImage;
}

// Function to segment an image based on a dynamic threshold using sliders
function segmentImageDynamic(img, thresholdSlider) {
    let segmentedImg = createImage(img.width, img.height);
    img.loadPixels();
    segmentedImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let pixelRed = img.pixels[i];
        let pixelGreen = img.pixels[i + 1];
        let pixelBlue = img.pixels[i + 2];

        // Calculate the greyscale value of the pixel
        let greyscaleValue = (pixelRed * 0.299 + pixelGreen * 0.587 + pixelBlue * 0.114);

        // Get the threshold value from the slider
        let thresholdValue = thresholdSlider.value();

        // Apply thresholding
        if (greyscaleValue > thresholdValue) {
            // Set pixel to white
            segmentedImg.pixels[i] = 255;
            segmentedImg.pixels[i + 1] = 255;
            segmentedImg.pixels[i + 2] = 255;
            segmentedImg.pixels[i + 3] = 255;
        } else {
            // Set pixel to black
            segmentedImg.pixels[i] = 0;
            segmentedImg.pixels[i + 1] = 0;
            segmentedImg.pixels[i + 2] = 0;
            segmentedImg.pixels[i + 3] = 255;
        }
    }
    segmentedImg.updatePixels();
    return segmentedImg;
}

// Function to convert RGB to CMY(K)
function convertToCMYK(img) {
    let cmykImg = createImage(img.width, img.height);
    img.loadPixels();
    cmykImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i] / 255;
        let g = img.pixels[i + 1] / 255;
        let b = img.pixels[i + 2] / 255;

        // Calculate CMY values
        let cyan = 1 - r;
        let magenta = 1 - g;
        let yellow = 1 - b;

        // Calculate black component
        let black = Math.min(cyan, magenta, yellow);

        // Convert CMY to CMYK
        let k = black;
        cyan = (cyan - black) / (1 - black);
        magenta = (magenta - black) / (1 - black);
        yellow = (yellow - black) / (1 - black);

        // Scale values to the range [0, 255]
        cmykImg.pixels[i] = cyan * 255;
        cmykImg.pixels[i + 1] = magenta * 255;
        cmykImg.pixels[i + 2] = yellow * 255;
        cmykImg.pixels[i + 3] = k * 255;
    }
    cmykImg.updatePixels();
    return cmykImg;
}

// Function to convert RGB to HSI
function convertToHSI(img) {
    let hsiImg = createImage(img.width, img.height);
    img.loadPixels();
    hsiImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        let r = img.pixels[i] / 255;
        let g = img.pixels[i + 1] / 255;
        let b = img.pixels[i + 2] / 255;
        let intensity = (r + g + b) / 3;
        let minRGB = Math.min(r, g, b);
        let hue, saturation;
        if (intensity === 0) {
            saturation = 0;
        } else {
            saturation = 1 - (3 / (r + g + b)) * minRGB;
        }
        if (saturation === 0) {
            hue = 0; // Undefined hue for achromatic colours
        } else {
            hue = Math.acos((0.5 * ((r - g) + (r - b))) / Math.sqrt((r - g) ** 2 + (r - b) * (g - b)));
            if (b > g) {
                hue = (2 * Math.PI) - hue;
            }
        }
        hue = radiansToDegrees(hue);
        if (b / intensity > g / intensity) {
            hue = 360 - hue;
        }
        hsiImg.pixels[i] = hue;
        hsiImg.pixels[i + 1] = saturation * 100;
        hsiImg.pixels[i + 2] = intensity * 255;
        hsiImg.pixels[i + 3] = 255; // Alpha value
    }
    hsiImg.updatePixels();
    return hsiImg;
}

// Function to convert radians to degrees
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

// Function to extract the red channel from an image
function getRedChannel(img) {
    let redImg = createImage(img.width, img.height);
    img.loadPixels();
    redImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        redImg.pixels[i] = img.pixels[i];
        redImg.pixels[i + 1] = 0;
        redImg.pixels[i + 2] = 0;
        redImg.pixels[i + 3] = 255;
    }
    redImg.updatePixels();
    return redImg;
}

// Function to extract the green channel from an image
function getGreenChannel(img) {
    let greenImg = createImage(img.width, img.height);
    img.loadPixels();
    greenImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        greenImg.pixels[i] = 0;
        greenImg.pixels[i + 1] = img.pixels[i + 1];
        greenImg.pixels[i + 2] = 0;
        greenImg.pixels[i + 3] = 255;
    }
    greenImg.updatePixels();
    return greenImg;
}

// Function to extract the blue channel from an image
function getBlueChannel(img) {
    let blueImg = createImage(img.width, img.height);
    img.loadPixels();
    blueImg.loadPixels();
    for (let i = 0; i < img.pixels.length; i += 4) {
        blueImg.pixels[i] = 0;
        blueImg.pixels[i + 1] = 0;
        blueImg.pixels[i + 2] = img.pixels[i + 2];
        blueImg.pixels[i + 3] = 255;
    }
    blueImg.updatePixels();
    return blueImg;
}

// Function to apply segmentation to each colour channel based on slider values
function segmentChannels(img) {
    let redImg = createImage(img.width, img.height);
    redImg.loadPixels();
    let greenImg = createImage(img.width, img.height);
    greenImg.loadPixels();
    let blueImg = createImage(img.width, img.height);
    blueImg.loadPixels();

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {
            let pixelIndex = ((img.width * y) + x) * 4;
            let pixelRed = img.pixels[pixelIndex];
            let pixelGreen = img.pixels[pixelIndex + 1];
            let pixelBlue = img.pixels[pixelIndex + 2];

            // Applying segmentation for red channel
            if (redSlider.value() > pixelRed) {
                pixelRed = 0;
            } else {
                pixelRed = 255;
            }
            redImg.pixels[pixelIndex] = pixelRed;
            redImg.pixels[pixelIndex + 1] = 0;
            redImg.pixels[pixelIndex + 2] = 0;
            redImg.pixels[pixelIndex + 3] = 255;

            // Applying segmentation for green channel
            if (greenSlider.value() > pixelGreen) {
                pixelGreen = 0;
            } else {
                pixelGreen = 255;
            }
            greenImg.pixels[pixelIndex] = 0;
            greenImg.pixels[pixelIndex + 1] = pixelGreen;
            greenImg.pixels[pixelIndex + 2] = 0;
            greenImg.pixels[pixelIndex + 3] = 255;

            // Applying segmentation for blue channel
            if (blueSlider.value() > pixelBlue) {
                pixelBlue = 0;
            } else {
                pixelBlue = 255;
            }
            blueImg.pixels[pixelIndex] = 0;
            blueImg.pixels[pixelIndex + 1] = 0;
            blueImg.pixels[pixelIndex + 2] = pixelBlue;
            blueImg.pixels[pixelIndex + 3] = 255;
        }
    }

    redImg.updatePixels();
    greenImg.updatePixels();
    blueImg.updatePixels();

    return { redImg, greenImg, blueImg };
}

// Function to capture a snapshot from the webcam
function takeSnapshot() {
    captureStatus = true;
    snapshot = get(10, 10, 160, 120); // Capturing the current contents of the video feed area
}

// Function to save the captured snapshot
function saveSnapshot() {
    if (snapshot) {
        save(snapshot, 'snapshot.png'); // Saving the snapshot as an image file
    } else {
        console.log('No snapshot taken yet.');
    }
}

// Function to handle loading of external image file
function handleFile(file) {
    if (file.type === 'image') {
        loadImage(file.data, img => {
            // Resizing the loaded image to 160 x 120 pixels
            img.resize(160, 120);
            snapshot = img;
            console.log('Image loaded successfully.');
            captureStatus = true;
        });
    } else {
        console.log('Please select an image file.');
    }
}

// Key press event handler
function keyPressed() {
    if (faceDetectionOn == true) {
        if (keyCode === 90) { // 'Z' Key
            if (!greyscaleStatus & !bluredStatus & !colourConvertedStatus & !pixelatedStatus) {
                greyscaleStatus = true;
                console.log('Greyscale On');
            } else {
                greyscaleStatus = false;
                console.log('Greyscale Off');
            }
        };
        if (keyCode === 88) { // 'X' key
            if (!greyscaleStatus & !bluredStatus & !colourConvertedStatus & !pixelatedStatus) {
                bluredStatus = true;
                console.log('Blur On');
            } else {
                bluredStatus = false;
                console.log('Blur Off');
            }
        };
        if (keyCode === 67) { // 'C' Key
            if (!greyscaleStatus & !bluredStatus & !colourConvertedStatus & !pixelatedStatus) {
                colourConvertedStatus = true;
                console.log('Colour Conversion On');
            } else {
                colourConvertedStatus = false;
                console.log('Colour Conversion Off');
            }
        };
        if (keyCode === 86) { // 'V' Key
            if (!greyscaleStatus & !bluredStatus & !colourConvertedStatus & !pixelatedStatus) {
                pixelatedStatus = true;
                console.log('Pixelated On');
            } else {
                pixelatedStatus = false;
                console.log('Pixelated Off');
            }
        };
    };
}