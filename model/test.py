"""
Load a trained .pth model and test it.
"""

import torch
import torch.nn as nn
from blur_classifier import BlurClassifier
from dataset import test_loader

# device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# load model
model = BlurClassifier().to(device)
model.load_state_dict(torch.load('blur_classifier.pth', map_location=device))
model.eval()

def test():
  loss_fn = nn.BCEWithLogitsLoss()
  test_loss = 0
  correct = 0
  total = 0

  with torch.no_grad():
    for images, labels in test_loader:
      images = images.to(device)
      labels = labels.float().unsqueeze(1).to(device)

      outputs = model(images)
      test_loss += loss_fn(outputs, labels).item()

      predicted = (torch.sigmoid(outputs) > 0.5).float()
      correct += (predicted == labels).sum().item()
      total += labels.size(0)

  print(f"Test Loss {test_loss/len(test_loader):.4f} | Test Accuracy {correct/total:.2%}")

test()