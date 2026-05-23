"""
Loads blur and sharp images from /data for the BlurClassifier.
Combines data/myblur and data/blur as class 0 and sharp as class 1.
Uses stratified splitting for a small dataset.
"""

from torchvision import datasets, transforms
from torch.utils.data import DataLoader, Subset
from sklearn.model_selection import train_test_split

# transforms
transform = transforms.Compose([
  transforms.Resize((224, 224)),
  transforms.ToTensor(),
  transforms.Normalize(
    mean=[0.485, 0.456, 0.406],
    std=[0.229, 0.224, 0.225]
  )
])

# blur = 0, sharp = 1
class_to_label = {
  'myblur': 0,
  'blur': 0,
  'mysharp': 1,
  'sharp': 1,
}

def remap(dataset):
  dataset.samples = [
    (path, class_to_label[dataset.classes[label]]) 
    for path, label in dataset.samples
  ]
  dataset.targets = [label for _, label in dataset.samples]
  return dataset

# load datasets
train_data = remap(datasets.ImageFolder(root='data', transform=transform))
val_test_data = remap(datasets.ImageFolder(root='data', transform=transform))

labels = [label for _, label in train_data.samples]

# stratified split 
train_idx, temp_idx = train_test_split(
  range(len(train_data)),
  test_size=0.30,
  stratify=labels,
  random_state=99
)
temp_labels = [labels[i] for i in temp_idx]
val_idx, test_idx = train_test_split(
  temp_idx,
  test_size = 0.50,
  stratify=temp_labels,
  random_state=99
)

# augmented train, val, test
train_dataset = Subset(train_data, train_idx)
val_dataset = Subset(val_test_data, val_idx)
test_dataset = Subset(val_test_data, test_idx)

# dataloaders
train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=16, shuffle=False)
test_loader = DataLoader(test_dataset, batch_size=16, shuffle=False)

print(f"Classes: {class_to_label}")
print(f"Train: {len(train_dataset)} | Val: {len(val_dataset)} | Test: {len(test_dataset)}")