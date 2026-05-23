"""
This model determines if an image is motion-blurred or not. It takes 3 input channels (RGB) and outputs 1 neuron for binary classification.
"""

import torch.nn as nn

class BlurClassifier(nn.Module):
  def __init__(self):
    super().__init__() # for inheritance
    self.features = nn.Sequential(
      # add padding to avoid shrinking image due to convolution
      nn.Conv2d(in_channels=3, out_channels=32, kernel_size=3, padding=1),
      nn.ReLU(),
      nn.MaxPool2d(kernel_size=2),

      nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3, padding=1),
      nn.ReLU(),
      nn.MaxPool2d(kernel_size=2),

      nn.Conv2d(in_channels=64, out_channels=128, kernel_size=3, padding=1),
      nn.ReLU(),
    )
    # handles variable image sizes
    self.pool = nn.AdaptiveAvgPool2d(output_size=(1,1)) 
    self.classifier = nn.Sequential(
      nn.Linear(128, 64),
      nn.ReLU(),
      nn.Linear(64, 1) # single neuron for binary
    )
  
  def forward(self, x):
    x = self.features(x)
    x = self.pool(x)
    x = x.view(x.size(0), -1) # collapse remaining dims
    x = self.classifier(x)
    return x
    
    