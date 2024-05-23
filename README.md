# Image-Processing-Using-p5.js-and-objectdetect.js

/////////////////////////////////////
// IMAGE PROCESSING USING P5.JS AND OBJECTDETECT.JS
/////////////////////////////////////

Image Processing Using p5.js and objectdetect.js
This program processes a webcam image using p5.js for filtters/image maniplulation and objectdetect.js for face detection.

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
