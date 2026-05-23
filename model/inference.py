"""
Creates API route for classification using the blur_classifier.
"""

from fastapi import FastAPI, UploadFile
import torch
import torchvision.transforms as transforms
from blur_classifier import BlurClassifier
from PIL import Image

app = FastAPI()

# device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# load model
model = BlurClassifier().to(device)
model.load_state_dict(
  torch.load('blur_classifier.pth', map_location=device, weights_only=True))
model.eval()

# transforms to input
transform = transforms.Compose([
  transforms.Resize((224, 224)),
  transforms.ToTensor(),
  transforms.Normalize(
    mean=[0.485, 0.456, 0.406],
    std=[0.229, 0.224, 0.225]
  )
])

# predict
@app.post("/predict")
async def predict(file: UploadFile):
  img = Image.open(file.file).convert("RGB")
  x = transform(img).unsqueeze(0).to(device)

  with torch.no_grad():
    y = model(x)
    prob = torch.sigmoid(y).item()
    label = 1 if prob >= 0.5 else 0
  
  return {
    "filename": file.filename,
    "label": label,
    "confidence": round(prob if label == 1 else 1 - prob, 4)
  }



