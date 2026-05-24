# Blurry Photo Sorter

This [**Blurry Photo Sorter**](http://blurry-photo-sorter-app.s3-website-us-east-1.amazonaws.com/) is a full-stack web application that sorts blurry photos from a set of uploaded photos. The classifier was built using PyTorch and trained on my own labeled images!

### 💡 Motivation

Somehow, I manage to take random blurry photos as I take out or put away my phone. When uploading large amount of photos from my phone to my desktop, I wanted to be able to filter out the blurry photos without sifting through them myself. So this application aims to streamline that process.

### 📜 Implementation

The backend is implemented as a *RESTful API* using **Express** and **TypeScript**. It handles image uploads, converts any **.HEIC** images to **.JPG**, and stores them in **AWS S3**. The frontend is built with **React** and **Vite**. The model was created using **PyTorch** and **torchvision**, using a 3-layer convolutional neural network (CNN) for binary classification of blurry vs. sharp images. The app is deployed on **AWS EC2** with the frontend hosted on **AWS S3**.

## Tools Used For This Project:

<div style="display: flex; align-items: center; flex-wrap: nowrap;">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg" width="50" /> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="50" /> &nbsp 
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original-wordmark.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" width="50"/> &nbsp
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="50"/> &nbsp
</div>

## Acknowledgements:
- [AWS](https://aws.amazon.com/) - AWS EC2 and S3 for hosting and generating presigned URLs
- [heroicons](https://heroicons.com/outline) - Provided icons used in Blurry Photo Sorter
- [Devicon](https://devicon.dev/) - Provided icons for this README.md
