"""
Trains the BlurClassifier using images from /data.
"""

import torch
import torch.nn as nn
import torch.optim as optim
from blur_classifier import BlurClassifier
from dataset import train_loader, val_loader

# device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
print(f"Using: {device}")

# params
learning_rate = 1e-3
epochs = 100

# setup
model = BlurClassifier().to(device)
loss_fn = nn.BCEWithLogitsLoss() # contains sigmoid function
optimizer = optim.Adam(model.parameters(), lr=learning_rate)

def prepare_labels(labels):
  return labels.float().unsqueeze(1).to(device)

def train():
  model.train()
  for images, labels in train_loader:
    images = images.to(device)
    labels = prepare_labels(labels)
    optimizer.zero_grad()
    outputs = model(images)
    loss = loss_fn(outputs, labels)
    loss.backward()
    optimizer.step()
  return loss.item()

def validate():
  model.eval()
  val_loss = 0
  correct = 0
  total = 0

  with torch.no_grad():
    for images, labels in val_loader:
      images = images.to(device)
      labels = prepare_labels(labels)
      outputs = model(images)
      val_loss += loss_fn(outputs, labels).item()

      predicted = (torch.sigmoid(outputs) > 0.5).float()
      correct += (predicted == labels).sum().item()
      total += labels.size(0)

  return val_loss / len(val_loader), correct / total

best_val_loss = float('inf')
# training loop
for epoch in range(epochs):
  train_loss = train()
  val_loss, val_accuracy = validate()

  # save only when model improves
  if val_loss < best_val_loss:
    best_val_loss = val_loss
    torch.save(model.state_dict(), '/content/drive/MyDrive/blur_classifier.pth')

  # save every 10 epochs
  if epoch % 10 == 0:
    print(f"Epoch {epoch} | Loss {train_loss:.4f} | Val Loss {val_loss:.4f} | Val Accuracy {val_accuracy:.2%}")

torch.save(model.state_dict(), 'blur_classifier.pth')
print("Model saved.")